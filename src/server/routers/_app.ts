import { publicProcedure, router } from '../trpc';
import { interviewRouter } from './interview';
import { supportRouter } from './support';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'it works!'),
  interview: interviewRouter,
  support: supportRouter,
});

export type AppRouter = typeof appRouter;
