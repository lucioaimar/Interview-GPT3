/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Framework` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Seniority` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Framework_name_key" ON "Framework"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Seniority_name_key" ON "Seniority"("name");
