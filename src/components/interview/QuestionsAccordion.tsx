import { Question } from '.prisma/client';
import {
  ArrowDownCircleIcon,
  HandRaisedIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid';
import { Accordion, Button, Label, Textarea } from 'flowbite-react';
import { createRef, Fragment, RefObject, useEffect, useState } from 'react';

type QuestionAccordionProps = {
  questions: Question[];
  interviewerName: string;
  callbackQuestion: (questionId: number, answer: string) => any;
  callbackAskForAnswer: (questionId: number) => any;
};

function getColor(correct: boolean | null) {
  if (correct) {
    return 'success';
  } else if (correct === false) {
    return 'danger';
  }
  return 'primary';
}

export const QuestionsAccordion = ({
  questions,
  interviewerName,
  callbackQuestion,
  callbackAskForAnswer,
}: QuestionAccordionProps) => {
  const [refs, setRefs] =
    useState<Map<number, RefObject<HTMLTextAreaElement>>>();

  useEffect(() => {
    const refs = new Map<number, RefObject<HTMLTextAreaElement>>();
    questions.forEach((question) => {
      refs.set(question.id, createRef());
    });
    setRefs(refs);
    console.log(refs);
  }, [questions]);

  return (
    <Accordion alwaysOpen={true} arrowIcon={ArrowDownCircleIcon}>
      {questions.map((question) => (
        <Accordion.Panel key={question.id}>
          <Accordion.Title className={`bg-${getColor(question.correct)}Bg`}>
            <div className="flex">
              {question.correct !== null ? (
                question.correct ? (
                  <HandThumbUpIcon className="w-5 h-5 mr-2" />
                ) : (
                  <HandThumbDownIcon className="w-5 h-5 mr-2" />
                )
              ) : (
                <HandRaisedIcon className="w-5 h-5 mr-2" />
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
                    /* disabled={!refs?.get(question.id)?.current?.value} */
                    onClick={() => {
                      callbackQuestion(
                        question.id,
                        refs?.get(question.id)?.current?.value || '',
                      );
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
                </div>
              </Fragment>
            )}
            {question.answer && (
              <div className="p-3 mb-3 rounded-lg border border-info bg-infoBg">
                <h5 className="mb-2 text-md font-medium">Your answer</h5>
                {question.answer}
              </div>
            )}
            {question.interviewerAnswer && (
              <div
                className={`p-3 rounded-lg border ${
                  question.correct
                    ? 'border-success bg-successBg'
                    : 'border-danger bg-dangerBg'
                }`}
              >
                <h5 className="mb-2 text-md font-medium">{`${interviewerName}'s answer`}</h5>
                {question.interviewerAnswer}
              </div>
            )}
          </Accordion.Content>
        </Accordion.Panel>
      ))}
    </Accordion>
  );
};
