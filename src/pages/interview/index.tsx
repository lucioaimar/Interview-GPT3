import { Button } from "flowbite-react";
import Link from "next/link";
import { Loader } from "~/components/core/Loader";
import type { InterviewForRow } from "~/components/interview/InterviewRow";
import { InterviewRow } from "~/components/interview/InterviewRow";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { api } from "~/utils/api";

export default function CreateInterviewPage() {
  useAuthGuard();
  const { data, isLoading } = api.interview.getInterviews.useQuery({
    pageNumber: 1,
    pageSize: 10,
  });

  return (
    <div className="flex w-full justify-center p-3 md:p-0">
      <div className="mt-10">
        {data && (
          <div className="mb-5">
            <h1 className="mb-5 text-3xl">My Interviews</h1>
            <Link href="/interview/createInterview">
              <Button className="bg-primary">Create Interview +</Button>
            </Link>
          </div>
        )}
        <div className="flex w-full flex-col items-center justify-center gap-5">
          {data?.map((interview: InterviewForRow) => (
            <InterviewRow
              key={interview.id}
              interview={interview}
            ></InterviewRow>
          ))}
        </div>
        {isLoading && <Loader />}
      </div>
    </div>
  );
}
