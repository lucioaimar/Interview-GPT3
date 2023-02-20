import { Card } from "flowbite-react";
import Link from "next/link";
import { Tag } from "../core/Tag";
import Image from "next/image";

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
    <Link
      className="w-full md:min-w-[50rem]"
      href={`/interview/${interview.id}`}
    >
      <Card className="cursor-pointer hover:bg-sky-100">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="font-primary w-36 text-lg font-medium">
            {interview.title}
          </div>
          <Tag label="Tech" color="primary">
            {interview.framework.name}
            <Image
              width={30}
              height={30}
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
