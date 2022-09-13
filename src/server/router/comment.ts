import { createRouter } from "./context";
import { number, string, z } from "zod";
import { prisma } from "../db/client";
import bcrypt from "bcrypt";
import { Comment } from "@prisma/client";

export const commentRouter = createRouter()
  .query("getBy", {
    input: z.object({
      title: z.string().optional(),
      chapter: z.string().optional(),
    }),
    async resolve({ input }) {
      const commentMap = new Map<number, Comment[]>();
      const comments = await prisma.comment.findMany({ where: input });
      for (const comment of comments) {
        if (!commentMap.get(comment.startIndex)) {
          commentMap.set(comment.startIndex, [comment]);
          continue;
        }
        commentMap.set(comment.startIndex, [
          ...commentMap.get(comment.startIndex)!,
          comment,
        ]);
      }
      return commentMap;
    },
  })
  .mutation("create", {
    input: z.object({
      startIndex: z.number(),
      endIndex: z.number(),
      startOffset: z.number(),
      endOffset: z.number(),
      content: z.string(),
      title: z.string(),
      chapter: z.string(),
    }),
    async resolve({ input, ctx: { prisma, session } }) {
      if (!session) return null;
      const { userId } = session;
      const comment = await prisma.comment.create({
        data: { ...input, user: { connect: { id: session.userId } } },
      });
      return comment;
    },
  });
