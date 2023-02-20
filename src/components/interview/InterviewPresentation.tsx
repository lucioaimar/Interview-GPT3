import { Card } from "flowbite-react";
import Link from "next/link";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { QuestionRow } from "./QuestionRow";
import type { Interview, Framework, Seniority, Question } from "@prisma/client";
import { Tag } from "../core/Tag";

export const InterviewPresentation = ({
  interview,
}: {
  interview: Interview & {
    framework: Framework;
    seniority: Seniority;
    questions: Question[];
  };
}) => {
  return (
    <Card className="w-full md:max-w-6xl">
      <div className="flex flex-col gap-5 p-5">
        <h2 className="text-3xl">{interview.title}</h2>
        <div className="flex flex-col gap-2">
          <Tag label="Tech" color="primary">
            {interview.framework.name}
            <img
              width={30}
              className="ml-2"
              src={interview.framework.image}
              alt="Framework image"
            />
          </Tag>
          <Tag label="Seniority" color="green-600">
            {interview.seniority.name}
          </Tag>
          <Tag label="Questions" color="red-600">
            {interview.questionNumber}
          </Tag>
        </div>
        Hi I&apos;m {interview.interviewerName} and I will be your interviewer
        for the {interview.seniority.name} {interview.framework.name} interview.
        I will ask you {interview.questions.length} questions. Good luck!
        <ul>
          {interview.questions.map((question) => (
            <li className="mb-2" key={question.id}>
              <QuestionRow question={question}></QuestionRow>
            </li>
          ))}
        </ul>
        <Link
          className="flex w-fit items-center gap-2 rounded border border-blue-800 bg-blue-400 p-2 hover:bg-blue-800 hover:text-white"
          href={`/interview/${interview.id}`}
        >
          Answer the questions
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
        </Link>
      </div>
    </Card>
  );
};
