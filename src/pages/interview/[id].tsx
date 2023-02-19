import { Card, Spinner } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Tag } from "~/components/core/Tag";
import { QuestionsAccordion } from "~/components/interview/QuestionsAccordion";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { api } from "~/utils/api";

export default function InterviewPage() {
  useAuthGuard();

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

    if (interviewQuery.isLoading)
      return (
        <Fragment>
          <p className="text-md">Loading...</p>
          <Spinner aria-label="Extra large spinner example" size="xl" />
        </Fragment>
      );

    return (
      <section className="flex w-full justify-center">
        <div className="relative mt-10 w-2/3">
          {interviewQuery.data && (
            <Card>
              <div className="flex flex-col gap-5 p-5">
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
                <Tag label="Interviewer" color="red-600">
                  {interviewQuery.data.interviewerName}
                </Tag>
                <img
                  className="absolute top-0 right-16 -translate-y-16 rounded-full border"
                  width={200}
                  src={interviewQuery.data.interviewerImage}
                  alt=""
                />
                <div className="text-800 rounded-lg border border-primary bg-primaryBg p-2 text-lg">
                  Hi I&apos;m {interviewQuery.data.interviewerName} and I will
                  be your interviewer for the{" "}
                  {interviewQuery.data.seniority.name}{" "}
                  {interviewQuery.data.framework.name} assesment. Please respond
                  these {interviewQuery.data.questions.length} questions. Good
                  luck!
                </div>
                {interviewQuery.data?.questions && (
                  <QuestionsAccordion
                    callbackAskForAnswer={callbackAskForAnswer}
                    callbackQuestion={callbackFunction}
                    questions={interviewQuery.data?.questions}
                    interviewerName={interviewQuery.data.interviewerName}
                  />
                )}
              </div>
            </Card>
          )}
        </div>
      </section>
    );
  }

  return <div> That interview does not exits </div>;
}
