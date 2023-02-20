/*
  Warnings:

  - You are about to drop the column `interviewerImage` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `interviewerName` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "interviewerImage",
DROP COLUMN "interviewerName";
