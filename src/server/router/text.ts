import fs from "fs";
import path from "path";

import { createRouter } from "./context";
import { string, z } from "zod";
import { prisma } from "../db/client";
import bcrypt from "bcrypt";
import { Comment } from "@prisma/client";

export const textRouter = createRouter().query("getText", {
  input: z.object({
    title: z.string(),
    chapter: z.string(),
  }),
  async resolve({ input }) {
    const { chapter, title } = input;
    const text = fs
      .readFileSync(path.join(`./books/${title}/${chapter}.txt`), "utf8")
      .split("\n")
    return text;
  },
});
