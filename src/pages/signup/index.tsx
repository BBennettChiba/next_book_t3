import { useState } from "react";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { string } from "zod";

type Keys = "name" | "password" | "confirmPassword" | "email" | "confirmEmail";

type UserInfo = { [k in Keys]: string };

type Errors = {
  [k in keyof UserInfo as `${k}Error`]: string[] | null;
};

export default function Login() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    confirmEmail: "",
  });
  const [errors, setErrors] = useState<Errors>({
    emailError: null,
    confirmEmailError: null,
    confirmPasswordError: null,
    passwordError: null,
    nameError: null,
  });

  const createUserMutation = trpc.useMutation("user.create-user", {
    onError: (error) => {
      if (error?.data?.zodError?.fieldErrors) {
        const fieldErrors = error.data.zodError.fieldErrors as {
          [K in Keys]?: string[];
        };
        let newErrors = { ...errors };
        for (const field in fieldErrors) {
          newErrors[`${field as Keys}Error`] =
            fieldErrors[field as Keys] || null;
        }
        setErrors(newErrors);
        createUserMutation.reset();
      }
    },
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserMutation.mutate(userInfo);
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="container max-w-sm mx-auto flex flex-1 flex-col items-center justify-center px-2"
      >
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          <input
            type="text"
            name="username"
            placeholder="username"
            id="username"
            required
            className="block border border-grey-light w-full p-3 rounded mb-4"
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          ></input>
          {errors.nameError && <div>{JSON.stringify(errors.nameError)}</div>}
          <input
            type="password"
            name="password"
            placeholder="password"
            id="password"
            required
            className="block border border-grey-light w-full p-3 rounded mb-4"
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          ></input>
          {errors.passwordError && (
            <div>{JSON.stringify(errors.passwordError)}</div>
          )}
          <input
            type="password"
            name="confirmPassword"
            placeholder="confirm password"
            id="confirmPassword"
            required
            className="block border border-grey-light w-full p-3 rounded mb-4"
            onChange={(e) =>
              setUserInfo({ ...userInfo, confirmPassword: e.target.value })
            }
          ></input>
          {errors.confirmPasswordError && (
            <div>{JSON.stringify(errors.confirmPasswordError)}</div>
          )}
          <input
            type="text"
            name="email"
            placeholder="email"
            id="email"
            required
            className="block border border-grey-light w-full p-3 rounded mb-4"
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
          ></input>
          {errors.emailError && <div>{JSON.stringify(errors.emailError)}</div>}
          <input
            type="text"
            name="confirmEmail"
            placeholder="confirm email"
            id="confirmEmail"
            required
            className="block border border-grey-light w-full p-3 rounded mb-4"
            onChange={(e) =>
              setUserInfo({ ...userInfo, confirmEmail: e.target.value })
            }
          ></input>
          {errors.confirmEmailError && (
            <div>{JSON.stringify(errors.confirmEmailError)}</div>
          )}
          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1"
          >
            Create Account
          </button>
        </div>

        <PasswordStrengthMeter password={userInfo.password} />
      </form>
    </div>
  );
}


/**
 * @TODO add shake effect on errors
 * @TODO add popup messages explaining error
 */