// src/server/router/context.ts
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { ZodError } from "zod";

import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { prisma } from "../db/client";

type Fields = "name" | "email";

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  const req = opts?.req;
  const res = opts?.res;

  const session =
    req && res && (await getServerSession(req, res, nextAuthOptions));

  return {
    req,
    res,
    session,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () =>
  trpc.router<Context>().formatError(({ shape, error }) => {
    if (
      error.cause instanceof PrismaClientKnownRequestError &&
      error.cause.code === "P2002"
    ) {
      const target = (error.cause.meta?.target as [Fields])[0];

      return {
        ...shape,
        data: {
          ...shape.data,
          prismaError: {
            message: `A user with that ${target} already exists`,
            field: target,
          },
          zodError: null,
        },
      };
    }
    return {
      ...shape,
      data: {
        ...shape.data,
        prismaError: null,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  });
