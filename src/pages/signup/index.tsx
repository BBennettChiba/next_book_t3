import { useState } from "react";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

export default function Login() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    confirmEmail: "",
  });

  const createUserMutation = trpc.useMutation("user.create-user");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserMutation.mutate(userInfo);
  };

  const label = "font-bold mt-4 flex justify-between";
  const input = "p-2 border rounded-md  h-1/2 mt-auto mb-auto";

  return (
    <div className="ml-[30vw] mr-[30vw]">
      signup
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label className={label}>
          <h3>Username </h3>
          <input
            className={input}
            required
            type="text"
            id="username"
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />
        </label>
        <label className={label}>
          <h3> Password </h3>
          <input
            className={input}
            required
            type="password"
            id="password"
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
        </label>
        <label className={label}>
          <h3> Confirm password</h3>
          <input
            required
            className={input}
            type="password"
            id="confirmPassword"
            onChange={(e) =>
              setUserInfo({ ...userInfo, confirmPassword: e.target.value })
            }
          />
        </label>
        <label className={label}>
          <h3>Email</h3>
          <input
            className={input}
            required
            type="email"
            id="email"
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
          />
        </label>
        <label className={label}>
          <h3>Confirm Email</h3>
          <input
            className={input}
            required
            type="email"
            id="confirmEmail"
            onChange={(e) =>
              setUserInfo({ ...userInfo, confirmEmail: e.target.value })
            }
          />
        </label>

        <input value="submit" type="submit" />
      </form>
      <PasswordStrengthMeter password={userInfo.password} />
    </div>
  );
}
