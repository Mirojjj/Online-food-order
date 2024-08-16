import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "../db";

type CreateContextOptions = Record<string, never>;

const createInnerTRPCContext = async (_opts: CreateContextOptions) => {
  return {
    prisma,
  };
};


export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const {res, req} = _opts;
  return {
    res,req, prisma,
  }
};


import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { verifyAuth } from "../../lib/auth";

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return shape;
    },
  });


  //middleware
  const isAdmin = t.middleware(async ({ ctx, next }) => {
    const { req } = ctx
    const token = req.cookies['user-token']
  
    if (!token) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing user token' })
    }
    const verifiedToken = await verifyAuth(token)
  
    if (!verifiedToken) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid user token' })
    }
  
    return next()
  })


export const createTRPCRouter = t.router;


export const publicProcedure = t.procedure;
export const adminPorcedure = t.procedure.use(isAdmin);
