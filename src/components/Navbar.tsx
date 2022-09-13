import { Session } from "inspector";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Navbar: FC<Props> = ({ children }) => {
  const handleLogout = async () => {
    signOut();
  };

  const session = useSession();
  return (
    <>
      <nav className="mt-2 mr-auto pt-2 flex justify-end items-end border-b-2 border-b-gray-400 h-20 text-3xl pr-4">
        <Link href="/">home</Link>
        {session?.data?.user && (
          <Link href="/books">
            <a className="ml-3">books</a>
          </Link>
        )}
        {!session?.data?.user && (
          <Link href="/signup">
            <a className="ml-3">signup</a>
          </Link>
        )}
        {session?.data?.user && (
          <Link href="/upload">
            <a className="ml-3">upload</a>
          </Link>
        )}
        {!session?.data?.user && (
          <Link href='/signin'>
            <a className="ml-3" onClick={() => signIn()}>
              signin
            </a>
          </Link>
        )}
        {session?.data?.user && (
          <a className="ml-3" onClick={handleLogout}>
            logout
          </a>
        )}
      </nav>
      {children}
    </>
  );
};
