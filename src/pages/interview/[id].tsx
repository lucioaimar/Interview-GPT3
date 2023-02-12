import { Avatar } from 'flowbite-react';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';

export default function CreateInterviewPage() {
  const router = useRouter();
  const { id } = router.query;

  if (id) {
    const { data, isLoading } = trpc.interview.getInterviewById.useQuery({
      interviewId: +id,
    });
    return (
      <div className="p-5">
        <h1 className="text-3xl mb-5">Interview: {data?.title}</h1>
        <Avatar img={data?.interviewerImage} size="xl" />
        <h1 className="text-3xl mb-5">Interviewer: {data?.interviewerName}</h1>
      </div>
    );
  }

  return <div> That interview does not exits </div>;
}
