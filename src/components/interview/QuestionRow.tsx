import type { Question } from '.prisma/client';

type QuestionRowProps = {
  question: Question;
};

export const QuestionRow = ({ question }: QuestionRowProps) => {
  return (
    <div className="p-2 rounded-md bg-green-400 border border-green-800 text-green-800">
      {question.content}
    </div>
  );
};
