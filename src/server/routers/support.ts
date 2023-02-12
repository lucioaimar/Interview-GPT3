import { protectedProcedure, router } from '../trpc';
import { prisma } from '../prisma';
//Router that has getters for Frameworks and Seniorities
//This is used to populate the dropdowns in the frontend

export const supportRouter = router({
  getFrameworks: protectedProcedure.query(async () => {
    const frameworks = await prisma.framework.findMany();
    return frameworks;
  }),
  getSeniorities: protectedProcedure.query(async () => {
    const seniorities = await prisma.seniority.findMany();
    return seniorities;
  }),
});
