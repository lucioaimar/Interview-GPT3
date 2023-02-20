import { useUser } from "@auth0/nextjs-auth0/client";
import { Card } from "flowbite-react";
import { useRouter } from "next/router";
import { Loader } from "~/components/core/Loader";
import { Tag } from "~/components/core/Tag";
import { QuestionsAccordion } from "~/components/interview/QuestionsAccordion";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { api } from "~/utils/api";

export default function InterviewPage() {
  useAuthGuard();

  const user = useUser();

  const id = useRouter().query.id || 0;

  const questionMutation = api.interview.answerQuestion.useMutation();

  const askForAnswerMutation = api.interview.askForAnswer.useMutation();

  const interviewQuery = api.interview.getInterviewById.useQuery({
    interviewId: +id,
  });

  if (interviewQuery.data) {
    const callbackFunction = async (questionId: number, answer: string) => {
      await questionMutation.mutateAsync({
        questionId,
        answer,
      });
      await interviewQuery.refetch();
    };

    const callbackAskForAnswer = async (questionId: number) => {
      await askForAnswerMutation.mutateAsync({
        questionId,
      });
      await interviewQuery.refetch();
    };

    return (
      <section className="flex w-full justify-center md:p-10">
        <Card>
          {interviewQuery.data && (
            <div className="flex w-full flex-col gap-5 p-5">
              <h2 className="text-5xl font-semibold text-primary">
                {interviewQuery.data.title}
              </h2>
              <Tag label="Tech" color="primary">
                {interviewQuery.data.framework.name}
                <img
                  width={30}
                  className="ml-2"
                  src={interviewQuery.data.framework.image}
                  alt="Framework image"
                />
              </Tag>
              <Tag label="Seniority" color="green-600">
                {interviewQuery.data.seniority.name}
              </Tag>
              <Tag label="Questions" color="red-600">
                {interviewQuery.data.questionNumber}
              </Tag>
              <div className="rounded-lg border border-primary bg-primaryBg p-4 text-xl">
                Hi {user.user?.name} I will be your interviewer for the{" "}
                {interviewQuery.data.seniority.name}{" "}
                {interviewQuery.data.framework.name} assesment. Please respond
                these {interviewQuery.data.questions.length} questions. Good
                luck!
              </div>
              {interviewQuery.data?.questions && (
                <QuestionsAccordion
                  callbackAskForAnswer={() => {
                    void callbackAskForAnswer;
                  }}
                  callbackQuestion={() => {
                    void callbackFunction;
                  }}
                  questions={interviewQuery.data?.questions}
                  interviewerName={interviewQuery.data.interviewerName}
                />
              )}
            </div>
          )}
        </Card>
      </section>
    );
  } else if (interviewQuery.isLoading) {
    return (
      <div className="mt-5 flex w-full justify-center">
        <Loader />;
      </div>
    );
  } else {
    return (
      <div className="mt-5 flex w-full justify-center">
        {" "}
        That interview does not exits{" "}
      </div>
    );
  }
}
