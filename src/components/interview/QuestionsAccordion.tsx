import {
  ArrowDownCircleIcon,
  HandRaisedIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import type { Question } from "@prisma/client";
import { Accordion, Button, Label, Textarea } from "flowbite-react";
import type { RefObject } from "react";
import { createRef, Fragment, useEffect, useState } from "react";

type QuestionAccordionProps = {
  questions: Question[];
  callbackQuestion: (questionId: number, answer: string) => void;
  callbackAskForAnswer: (questionId: number) => void;
};

function getColor(correct: boolean | null) {
  if (correct) {
    return "success";
  } else if (correct === false) {
    return "danger";
  }
  return "primary";
}

export const QuestionsAccordion = ({
  questions,
  callbackQuestion,
  callbackAskForAnswer,
}: QuestionAccordionProps) => {
  const [refs, setRefs] =
    useState<Map<number, RefObject<HTMLTextAreaElement>>>();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const refs = new Map<number, RefObject<HTMLTextAreaElement>>();
    questions.forEach((question) => {
      refs.set(question.id, createRef());
    });
    setRefs(refs);
  }, [questions]);

  const isAllowed = (value: string | undefined) => {
    console.log(value);
    if (!value || value?.length < 10 || value?.length > 1000) {
      setError("Your answer must be between 10 and 1000 characters");
      return false;
    }
    return true;
  };

  return (
    <Accordion alwaysOpen={true} arrowIcon={ArrowDownCircleIcon}>
      {questions.map((question) => (
        <Accordion.Panel key={question.id}>
          <Accordion.Title className={`bg-${getColor(question.correct)}Bg`}>
            <div className="flex">
              {question.correct !== null ? (
                question.correct ? (
                  <HandThumbUpIcon className="mr-2 h-5 w-5" />
                ) : (
                  <HandThumbDownIcon className="mr-2 h-5 w-5" />
                )
              ) : (
                <HandRaisedIcon className="mr-2 h-5 w-5" />
              )}

              {question.content}
            </div>
          </Accordion.Title>
          <Accordion.Content>
            {!question.answer && !question.interviewerAnswer && (
              <Fragment>
                <div id="textarea">
                  <div className="mb-2 block">
                    <Label htmlFor="answer" value="Your answer" />
                  </div>
                  <Textarea
                    ref={refs?.get(question.id)}
                    id="answer"
                    placeholder="Write your answer to this question here..."
                    required={true}
                    rows={4}
                  />
                </div>
                <div className="flex">
                  <Button
                    className="my-3 mr-3"
                    onClick={() => {
                      const textValue = refs?.get(question.id)?.current?.value;
                      if (isAllowed(textValue)) {
                        callbackQuestion(
                          question.id,
                          refs?.get(question.id)?.current?.value || ""
                        );
                      }
                    }}
                  >
                    Answer
                  </Button>
                  <Button
                    className="my-3"
                    onClick={() => {
                      callbackAskForAnswer(question.id);
                    }}
                  >
                    I don&apos;t know
                  </Button>
                  <div className="text-red-500 ml-3 flex items-center">{error}</div>
                </div>
              </Fragment>
            )}
            {question.answer && (
              <div className="mb-3 rounded-lg border border-info bg-infoBg p-3">
                <h5 className="text-md mb-2 font-medium">Your answer</h5>
                {question.answer}
              </div>
            )}
            {question.interviewerAnswer && (
              <div
                className={`rounded-lg border p-3 ${
                  question.correct
                    ? "border-success bg-successBg"
                    : "border-danger bg-dangerBg"
                }`}
              >
                <h5 className="text-md mb-2 font-medium">{`Interviewer answer`}</h5>
                {question.interviewerAnswer}
              </div>
            )}
          </Accordion.Content>
        </Accordion.Panel>
      ))}
    </Accordion>
  );
};
