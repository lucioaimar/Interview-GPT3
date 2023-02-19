import type { Question } from "@prisma/client";

type QuestionRowProps = {
  question: Question;
};

export const QuestionRow = ({ question }: QuestionRowProps) => {
  return (
    <div className="rounded-md border border-green-800 bg-green-400 p-2 text-green-800">
      {question.content}
    </div>
  );
};
