// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { userRouter } from "./user";
import { commentRouter } from "./comment";
import { textRouter } from "./text";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("user.", userRouter)
  .merge("comment.", commentRouter)
  .merge("text.", textRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
