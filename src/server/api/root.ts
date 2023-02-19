import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { interviewRouter } from "./routers/interview";
import { supportRouter } from "./routers/support";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => "it works!"),
  interview: interviewRouter,
  support: supportRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
