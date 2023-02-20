import type { Framework, Seniority, Interview, Question } from ".prisma/client";
import { Button, Card, Label, TextInput } from "flowbite-react";
import React, { useRef } from "react";
import { useState } from "react";
import { Loader } from "~/components/core/Loader";
import { Select } from "~/components/core/Select";
import { InterviewPresentation } from "~/components/interview/InterviewPresentation";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { api } from "~/utils/api";

export default function CreateInterviewPage() {
  useAuthGuard();

  const frameworks = api.support.getFrameworks.useQuery();

  const seniorities = api.support.getSeniorities.useQuery();

  const numberOfQuestions = [
    { id: 5, name: "5" },
    { id: 10, name: "10" },
    { id: 15, name: "15" },
  ];

  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(
    null
  );

  const [selectedSeniority, setSelectedSeniority] = useState<Seniority | null>(
    null
  );

  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] =
    useState<number>(5);

  const titleInput = useRef<HTMLInputElement>(null);

  const interviewMutation = api.interview.createInterview.useMutation();

  const [interviewCreated, setInterviewCreated] = useState<
    | (Interview & {
        framework: Framework;
        seniority: Seniority;
        questions: Question[];
      })
    | null
  >(null);

  const [loadingInterviewCreated, setloadingInterviewCreated] =
    useState<boolean>(false);

  const createInterview = async () => {
    if (
      !selectedFramework ||
      !selectedSeniority ||
      !titleInput ||
      !titleInput.current
    ) {
      return;
    }

    setloadingInterviewCreated(true);

    const interviewCreated = await interviewMutation.mutateAsync({
      frameworkId: selectedFramework.id,
      seniorityId: selectedSeniority.id,
      questionNumber: selectedNumberOfQuestions,
      title: titleInput.current.value,
    });

    setInterviewCreated(interviewCreated);

    setloadingInterviewCreated(false);
  };

  return (
    <>
      <div className="flex gap-5 w-full justify-center md:p-10">
        <Card className="w-full md:max-w-6xl">
          <h1 className="text-3xl">Create Interview</h1>
          <form className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput
                id="title"
                ref={titleInput}
                placeholder="Interview name"
              ></TextInput>
            </div>
            <div>
              <div className="block">
                <Label htmlFor="selectFramework" value="Framework" />
              </div>
              <Select<Framework>
                label="Select a framework"
                isLoading={frameworks.isLoading}
                data={frameworks.data || []}
                onChange={setSelectedFramework}
              ></Select>
            </div>
            <div>
              <div className="block">
                <Label htmlFor="selectSeniority" value="Seniority" />
              </div>
              <Select<Seniority>
                label="Select a seniority"
                isLoading={seniorities.isLoading}
                data={seniorities.data || []}
                onChange={setSelectedSeniority}
              ></Select>
            </div>
            <div>
              <div className="block">
                <Label
                  htmlFor="selectQuestionNumber"
                  value="Number of questions"
                />
              </div>
              <Select<{ id: number; name: string }>
                label="Select a number"
                isLoading={false}
                data={numberOfQuestions}
                onChange={(value) => setSelectedNumberOfQuestions(value.id)}
              ></Select>
            </div>
            <Button
              disabled={
                !selectedNumberOfQuestions ||
                !selectedFramework ||
                !selectedSeniority ||
                !titleInput.current
              }
              className="mt-5"
              onClick={() => {
                void createInterview();
              }}
            >
              Create Interview
            </Button>
          </form>
        </Card>
        {loadingInterviewCreated && <Loader />}
        {interviewCreated && (
          <InterviewPresentation
            interview={interviewCreated}
          ></InterviewPresentation>
        )}
      </div>
    </>
  );
}
