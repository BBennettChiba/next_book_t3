import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { error } = router.query;
  const [userInfo, setUserInfo] = useState({
    name: "",
    password: "",
  });

  const handleLogin = async () => {
    const val = await signIn("credentials", { ...userInfo, callbackUrl: "/" });
  };

  return (
    <div className="flex items-center justify-center bg-slate-400 h-screen">
      {error && <div>something went wrong</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="flex flex-col h-full w-4/12"
      >
        <h1 className="self-center text-6xl p-4">Sign In</h1>
        <div className="flex flex-col self-center">
          <label className="text-xl">
            <h3>Username</h3>
            <input
              required
              type="text"
              id="username"
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
              className="h-12"
            />
          </label>
        </div>
        <div className="flex flex-col self-center">
          <label className="text-xl">
            <h3>Password</h3>
            <input
              required
              type="password"
              id="password"
              onChange={(e) => {
                setUserInfo({ ...userInfo, password: e.target.value });
              }}
              className="h-12"
            />
          </label>
        </div>
        <input
          value="submit"
          type="submit"
          className=" bg-blue-400 border-2 w-1/2 self-center mt-4 h-20 text-3xl rounded-md"
        />
      </form>
    </div>
  );
}
