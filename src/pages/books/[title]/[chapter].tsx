import fs from "fs";
import path from "path";
import {
  InferGetStaticPropsType,
  GetStaticPropsContext,
  GetStaticPaths,
} from "next";
import { ParsedUrlQuery } from "querystring";
import Chapter from "../../../components/Chapter";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "../../../server/router";
import superjson from "superjson";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PrismaClient } from "@prisma/client";

/**
 * maybe modulize things to make it smaller and easier.
 */

interface Params extends ParsedUrlQuery {
  title: string;
  chapter: string;
}

export const getStaticProps = async (
  context: GetStaticPropsContext<Params>
) => {
  const { title, chapter } = context.params!;
  console.log(context);

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: {
      req: undefined,
      res: undefined,
      session: undefined,
      // @ts-ignore
      prisma: undefined,
    },
    transformer: superjson,
  });

  await ssg.prefetchQuery("comment.getBy", { title, chapter });
  await ssg.prefetchQuery("text.getText", { title, chapter });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      title,
      chapter,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const books = fs
    .readdirSync("./books/", { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);
  const paths: { params: { title: string; chapter: string } }[] = [];
  books.forEach((title) => {
    const chapters = fs.readdirSync(path.join(`./books/${title}/`));
    chapters.forEach((chapter) => {
      paths.push({ params: { title, chapter: chapter.replace(".txt", "") } });
    });
  });
  return {
    paths,
    fallback: "blocking",
  };
};

const Index = ({
  title,
  chapter,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const session = useSession();
  if (session.status === "unauthenticated") {
    router.push("/signin");
  }
  if (session.status === "loading") {
    return <div>loading...</div>;
  }
  return <Chapter title={title} chapter={chapter} />;
};

export default Index;
