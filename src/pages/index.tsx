import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="flex">
      <div className="p-5">
        <p className="mb-5 text-4xl font-medium text-primary">
          Welcome to InterviewGPT3. This app will allow you to have interviews
          with an AI interviewers, this is hopefully useful to practice for your
          next interview.
        </p>
        <Button>
          <Link href="/interview/createInterview">Create Interview</Link>
        </Button>
        <Button className="mt-3">
          <Link href="/interview">My Interviews</Link>
        </Button>
      </div>
      <img
        className="w-1/2"
        src="https://openai.com/content/images/size/w1400/2023/01/chatgpt.jpg"
        alt="Interviews with GPT3"
      />
    </div>
  );
}
