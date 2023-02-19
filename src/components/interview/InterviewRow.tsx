import { Card } from "flowbite-react";
import Link from "next/link";
import { Tag } from "../core/Tag";

export type InterviewRowProps = {
  interview: InterviewForRow;
};

export type InterviewForRow = {
  title: string;
  frameworkId: number;
  seniorityId: number;
  questionNumber: number;
  framework: {
    name: string;
    image: string;
  };
  seniority: {
    name: string;
  };
  userEmail: string;
  id: number;
};

export const InterviewRow = ({ interview }: InterviewRowProps) => {
  return (
    <Link href={`/interview/${interview.id}`}>
      <Card className="cursor-pointer hover:bg-sky-100">
        <div className="flex w-[50rem]  flex-row items-center justify-between">
          <div className="font-primary w-36 text-lg font-medium">
            {interview.title}
          </div>
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
      </Card>
    </Link>
  );
};
