import { Framework, Interview, Question, Seniority } from '.prisma/client';
import { Card } from 'flowbite-react';
import Link from 'next/link';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { QuestionRow } from './QuestionRow';

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
    <div className="max-w-2xl">
      <Card>
        <div className="p-5 flex flex-col gap-5">
          <h2 className="text-3xl">{interview.title}</h2>
          <div className="grid grid-cols-2">
            <div>
              <h5 className="text-xl">Seniority: {interview.seniority.name}</h5>
              <div className="flex items-center gap-3">
                <h5 className="text-xl">Tech: {interview.framework.name}</h5>
                <img
                  width={50}
                  src={interview.framework.image}
                  alt="Framework image"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <h5 className="text-xl">
                Interviewer: {interview.interviewerName}
              </h5>
              <img width={150} src={interview.interviewerImage} alt="" />
            </div>
          </div>
          Hi I&apos;m {interview.interviewerName} and I will be your interviewer
          for the {interview.seniority.name} {interview.framework.name}{' '}
          interview. I will ask you {interview.questions.length} questions. Good
          luck!
          <ul>
            {interview.questions.map((question) => (
              <li className="mb-2" key={question.id}>
                <QuestionRow question={question}></QuestionRow>
              </li>
            ))}
          </ul>
          <Link
            className="bg-blue-400 hover:bg-blue-800 hover:text-white p-2 rounded border border-blue-800 w-fit flex items-center gap-2"
            href={'/interview/' + interview.id}
          >
            Answer the questions
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </Link>
        </div>
      </Card>
    </div>
  );
};
