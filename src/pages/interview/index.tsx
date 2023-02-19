import { Loader } from "~/components/core/Loader";
import type { InterviewForRow } from "~/components/interview/InterviewRow";
import { InterviewRow } from "~/components/interview/InterviewRow";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { api } from "~/utils/api";

export default function CreateInterviewPage() {
  useAuthGuard();
  const { data, isLoading } = api.interview.getInterviews.useQuery();

  return (
    <div>
      <h1 className="my-10 ml-36 text-3xl">My Interviews</h1>
      <div className="flex w-full flex-col items-center justify-center gap-5">
        {data?.map((interview: InterviewForRow) => (
          <InterviewRow key={interview.id} interview={interview}></InterviewRow>
        ))}
        {isLoading && <Loader />}
      </div>
    </div>
  );
}
