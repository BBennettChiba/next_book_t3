import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: "",
    password: "",
  });

  const [error, setError] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    const val = await signIn("credentials", {
      ...userInfo,
      callbackUrl: "/",
      redirect: false,
    });
    if (val?.error) {
      setError(true);
      return;
    }
    router.push("/");
  };

  const input = "block border border-grey-light w-full p-3 rounded mb-4";
  const errorDiv = "absolute left-full top-0 w-full px-8";

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <form
        onSubmit={handleLogin}
        className="container relative max-w-sm mx-auto flex flex-1 flex-col items-center justify-center px-2"
      >
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign In</h1>
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="username"
              id="username"
              required
              className={`${input} ${error && "animate-shake"}`}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
            ></input>
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="password"
              id="password"
              required
              className={`${input} ${error && "animate-shake"}`}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            ></input>
          </div>

          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

//**@TODO find out why it loads twice on this page */
