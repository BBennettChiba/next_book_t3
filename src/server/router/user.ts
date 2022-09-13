import { createRouter } from "./context";
import { z } from "zod";
import bcrypt from "bcrypt";

export const userRouter = createRouter().mutation("create-user", {
  input: z
    .object({
      email: z.string().email(),
      confirmEmail: z.string().email(),
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
      name: z.string().min(3),
    })
    .strict()
    .refine(({ email, confirmEmail }) => email === confirmEmail, {
      message: "Email and confirm email must match",
      path: ["confirmEmail"],
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: "Passwords must match",
      path: ["password"],
    }),
  resolve({ input, ctx: { prisma } }) {
    const { email, password: unhashedPassword, name } = input;
    const password = bcrypt.hashSync(unhashedPassword, 10);
    const user = prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    return user;
  },
});
