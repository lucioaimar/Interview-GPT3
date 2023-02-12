/*
  Warnings:

  - You are about to drop the column `userId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userEmail` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_userId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "userId",
ADD COLUMN     "userEmail" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "User";
