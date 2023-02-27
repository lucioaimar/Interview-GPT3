import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "flowbite-react";
import { LoginButton } from "~/components/core/AuthButton";
import Link from "next/link";

export default function IndexPage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col justify-center bg-primaryBg p-5 pt-10 text-center">
      <div className="ml-10 flex flex-col">
        <h1 className="text-4xl font-medium text-primary">
          Welcome to InterviewGPT3.
        </h1>
        <h2 className="mb-5 text-4xl font-medium text-primary">
          The best way to prepare for your next interview.
        </h2>
      </div>
      <p className="text-left text-xl">
        This app will be your companion for your next interview. We will ask you
        a series of questions and you will answer them. We will then use GPT-3
        to generate a report with the most common answers to the questions you
        answered.
      </p>
      {user ? (
        <div className="mt-10 flex items-center justify-center gap-5">
          <Link href="/interview/createInterview">
            <Button className="bg-primary">Create New Interview +</Button>
          </Link>
          <Link href="/interview">
            <Button className="bg-primary">My Interviews</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 flex items-center justify-center gap-5">
          Please login to continue.
          <LoginButton />
        </div>
      )}
    </div>
  );
}
