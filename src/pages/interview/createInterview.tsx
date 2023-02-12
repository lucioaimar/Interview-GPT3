import { Framework, Seniority } from '.prisma/client';
import { Button, TextInput } from 'flowbite-react';
import React, { useRef } from 'react';
import { useState } from 'react';
import { Select } from '~/components/Select';
import { trpc } from '~/utils/trpc';

export default function CreateInterviewPage() {
  const frameworks = trpc.support.getFrameworks.useQuery();
  const seniorities = trpc.support.getSeniorities.useQuery();
  const numberOfQuestions = [
    { id: 5, name: '5' },
    { id: 10, name: '10' },
    { id: 15, name: '15' },
  ];

  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(
    null,
  );

  const [selectedSeniority, setSelectedSeniority] = useState<Seniority | null>(
    null,
  );

  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] =
    useState<number>(5);

  const titleInput = useRef<HTMLInputElement>(null);

  const interviewMutation = trpc.interview.createInterview.useMutation();

  const createInterview = () => {
    if (
      !selectedFramework ||
      !selectedSeniority ||
      !titleInput ||
      !titleInput.current
    ) {
      return;
    }

    interviewMutation.mutate({
      frameworkId: selectedFramework.id,
      seniorityId: selectedSeniority.id,
      questionNumber: selectedNumberOfQuestions,
      title: titleInput.current.value,
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl mb-5">Create Interview</h1>
      <div className="w-1/2">
        <TextInput ref={titleInput} placeholder="Interview name"></TextInput>
      </div>
      <div className="flex gap-5 items-center my-3">
        <h5 className="text-xl">Framework:</h5>
        {frameworks.data && (
          <Select
            label="Select a framework"
            isLoading={frameworks.isLoading}
            data={frameworks.data}
            onChange={setSelectedFramework}
          ></Select>
        )}
      </div>
      <div className="flex gap-5 items-center mb-3">
        <h5 className="text-xl">Seniority:</h5>
        {seniorities.data && (
          <Select
            label="Select a seniority"
            isLoading={seniorities.isLoading}
            data={seniorities.data}
            onChange={setSelectedSeniority}
          ></Select>
        )}
      </div>
      <div className="flex gap-5 items-center mb-3">
        <h5 className="text-xl">Number of questions:</h5>
        <Select
          label="Select a number"
          isLoading={false}
          data={numberOfQuestions}
          onChange={(value) => setSelectedNumberOfQuestions(value.id)}
        ></Select>
      </div>
      <Button onClick={createInterview}>Create Interview</Button>
    </div>
  );
}
