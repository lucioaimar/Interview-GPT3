import { createTRPCRouter } from "./../trpc";
import { protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
//Router that has getters for Frameworks and Seniorities
//This is used to populate the dropdowns in the frontend

export const supportRouter = createTRPCRouter({
  getFrameworks: protectedProcedure.query(async () => {
    const frameworks = await prisma.framework.findMany();
    return frameworks;
  }),
  getSeniorities: protectedProcedure.query(async () => {
    const seniorities = await prisma.seniority.findMany();
    return seniorities;
  }),
});
