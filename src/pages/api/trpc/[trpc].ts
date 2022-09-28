// src/pages/api/trpc/[trpc].ts
import { TRPCError } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { ZodError } from "zod";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/router/context";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
