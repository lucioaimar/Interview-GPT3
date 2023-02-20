import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import AWS from "aws-sdk";
import { prisma } from "~/server/db";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

function transformQuestions(questions: string) {
  return questions
    .replaceAll("\n", "")
    .replaceAll(/(\d{1,2}\.\s)+/g, "XXX")
    .trim()
    .split("XXX")
    .slice(1);
}

async function uploadImageS3(imageUrl: string, name: string): Promise<string> {
  // This is the local /public/images folder
  const res = await fetch(imageUrl);
  const blob = await res.arrayBuffer();

  const uploadedImage = await s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: name + ".png",
      Body: Buffer.from(blob),
    })
    .promise();

  return uploadedImage.Location;
}

async function getInterviewerImage(interviewerName: string) {
  const respInterviewerImage = await openai.createImage({
    prompt: `Give me a realistic style image of an technical interviewer who is called ${interviewerName}`,
    n: 1,
    size: "256x256",
  });
  const imageUrl = respInterviewerImage.data.data[0]!.url!;
  const interviewerImage = await uploadImageS3(imageUrl, interviewerName);
}

async function getInterviewerName() {
  const respInterviewerName = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Give me a random name",
    temperature: 0.5,
    max_tokens: 20,
  });
  const interviewerName = respInterviewerName.data.choices[0]!.text!.replaceAll(
    "\n",
    ""
  );
  return interviewerName;
}

const openai = new OpenAIApi(configuration);

export const interviewRouter = createTRPCRouter({
  createInterview: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        frameworkId: z.number(),
        seniorityId: z.number(),
        questionNumber: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const framework = await prisma.framework.findUnique({
        where: {
          id: input.frameworkId,
        },
      });
      const seniority = await prisma.seniority.findUnique({
        where: {
          id: input.seniorityId,
        },
      });

      if (!framework || !seniority) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The framework or seniority is not registered",
        });
      }

      let prompt = `You are a Technical Interviewer an have to asses a candidate for an ${framework.name} ${seniority.name} 
      position. Give the candidate ${input.questionNumber} questions.
      Try to only ask technical questions about the technology and not questions about experience.
      Respond "I don't care" if they ask something unrelated to the interview.
      Respond if they ask for a more complete answer.`;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.9,
        max_tokens: 200,
      });
      const resp = response.data.choices[0]!.text!;
      prompt = prompt + resp;
      const questions = transformQuestions(resp);
      const interview = await prisma.interview.create({
        data: {
          title: input.title,
          userEmail: ctx.user.email as string,
          frameworkId: input.frameworkId,
          seniorityId: input.seniorityId,
          questionNumber: input.questionNumber,
          prompt,
          questions: {
            createMany: {
              data: questions.map((question) => ({
                content: question,
              })),
            },
          },
        },
      });
      const interviewWithQuestions = await prisma.interview.findUnique({
        where: {
          id: interview.id,
        },
        include: {
          seniority: true,
          framework: true,
          questions: true,
        },
      });
      if (!interviewWithQuestions) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The interview does not exist",
        });
      }
      return interviewWithQuestions;
    }),
  getInterviews: protectedProcedure
    .input(
      z.object({
        pageNumber: z.number(),
        pageSize: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const interviews = await prisma.interview.findMany({
        skip: (input.pageNumber - 1) * input.pageSize,
        take: input.pageSize,
        where: {
          userEmail: ctx.user.email as string,
        },
        select: {
          id: true,
          title: true,
          questionNumber: true,
          userEmail: true,
          frameworkId: true,
          seniorityId: true,
          seniority: {
            select: {
              name: true,
            },
          },
          framework: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      return interviews;
    }),
  getInterviewById: protectedProcedure
    .input(z.object({ interviewId: z.number() }))
    .query(async ({ input }) => {
      const interview = await prisma.interview.findUnique({
        where: {
          id: input.interviewId,
        },
        include: {
          seniority: true,
          framework: true,
          questions: true,
        },
      });
      if (!interview) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The interview does not exist",
        });
      }
      return interview;
    }),
  answerQuestion: protectedProcedure
    .input(z.object({ questionId: z.number(), answer: z.string() }))
    .mutation(async ({ input }) => {
      const question = await prisma.question.findUnique({
        where: {
          id: input.questionId,
        },
      });
      if (!question) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The question does not exist",
        });
      }
      if (question.correct) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This question has already been answered",
        });
      }
      const interview = await prisma.interview.findUnique({
        where: {
          id: question.interviewId,
        },
      });
      if (!interview) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The interview does not exist",
        });
      }
      let prompt =
        interview.prompt +
        `\n\n As a response to the question "${question.content}. My answer is ${input.answer}. Is that correct? Can you give me a more complete answer?`;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 300,
        top_p: 0.3,
      });
      const resp = response.data.choices[0]!.text!;
      prompt += resp;
      console.log("resp", resp);
      let newQuestion;
      if (resp.includes("Yes")) {
        newQuestion = await prisma.question.update({
          where: {
            id: question.id,
          },
          data: {
            answer: input.answer,
            interviewerAnswer: resp,
            correct: true,
          },
        });
        await updateInterviewPrompt(interview.id, prompt);
      } else if (resp.includes("No")) {
        newQuestion = await prisma.question.update({
          where: {
            id: question.id,
          },
          data: {
            answer: input.answer,
            interviewerAnswer: resp,
            correct: false,
          },
        });
        await updateInterviewPrompt(interview.id, prompt);
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Try a valid answer for a question please",
        });
      }
      return newQuestion;
    }),
  askForAnswer: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/askForHelp",
        tags: ["interview"],
        protect: true,
      },
    })
    .input(z.object({ questionId: z.number() }))
    .mutation(async ({ input }) => {
      const question = await prisma.question.findUnique({
        where: {
          id: input.questionId,
        },
      });
      if (!question) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The question does not exist",
        });
      }
      if (question.interviewerAnswer) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This question has already been answered",
        });
      }
      const prompt = `I don't know the question "${question.content}" can you respond it for me?`;
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.5,
        max_tokens: 100,
      });
      const resp = response.data.choices[0]!.text!;
      const questionUpdated = await prisma.question.update({
        where: {
          id: input.questionId,
        },
        data: {
          correct: false,
          interviewerAnswer: resp,
        },
      });
      return questionUpdated;
    }),
  deleteInterview: protectedProcedure
    .input(z.object({ interviewId: z.number() }))
    .mutation(async ({ input }) => {
      await prisma.interview.delete({
        where: {
          id: input.interviewId,
        },
      });
    }),
});

const updateInterviewPrompt = async (interviewId: number, prompt: string) => {
  await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      prompt,
    },
  });
};
