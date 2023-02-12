import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma } from '../prisma';
import { publicProcedure, router } from '../trpc';

export const JWT_SECRET = 'secret';

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The email is already taken',
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
        },
      });
      return user;
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The email is not registered',
        });
      }

      const passwordMatch = await bcrypt.compare(
        input.password,
        user.password as string,
      );

      if (!passwordMatch) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The password is incorrect',
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      return token;
    }),
});
