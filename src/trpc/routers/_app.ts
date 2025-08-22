import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';


export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
      console.log("using ctx:-", opts.ctx.clerkUserId)
      return {
        greeting: ` Hello ${opts.input.text}`,
      };
    }),
  getUser: protectedProcedure.query(async (opts) => {
    console.log("From ctx:-")
    console.dir(opts.ctx.dbUser)

    return opts.ctx
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;