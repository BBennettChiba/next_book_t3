import fs from "fs";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  books: string[];
};

const Books = ({ books }: Props) => {
  const router = useRouter();
  const session = useSession();
  if (session.status === "unauthenticated") {
    router.push("/signin");
  }
  if (session.status === "loading") {
    return <div>loading...</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>books!</h1>
      {books.map((book: string, key: number) => (
        <Link key={key} href={`books/${book}`}>
          {book}
        </Link>
      ))}
    </div>
  );
};
export const getStaticProps: GetStaticProps = () => {
  const books = fs
    .readdirSync("./books/", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  return { props: { books } };
};


export default Books;
