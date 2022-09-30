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

        setErrors((e) => {
          let newErrors = { ...e };
          for (const field in fieldErrors) {
            newErrors[`${field as Keys}Error`] =
              fieldErrors[field as Keys] || null;
          }
          return newErrors;
        });
        createUserMutation.reset();
      }
      if (error?.data?.prismaError) {
        console.log(error.data.prismaError);
      }
      /**@TODO get these erros gone. get visual client errors for unique fields problems, on success push to home */
    },
  });

  console.log(createUserMutation.error?.message);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors((e) => {
      let errorsCopy = { ...e };
      for (let key in errorsCopy) {
        errorsCopy[key as keyof typeof errorsCopy] = null;
      }
      return errorsCopy;
    });
    createUserMutation.mutate(userInfo);
  };

  const input = "block border border-grey-light w-full p-3 rounded mb-4";
  const error = "absolute left-full top-0 w-full px-8";

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="container relative max-w-sm mx-auto flex flex-1 flex-col items-center justify-center px-2"
      >
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="username"
              id="username"
              required
              className={`${input} ${errors.nameError && "animate-shake"}`}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
            ></input>
            {errors.nameError && (
              <div className={error}>
                {errors.nameError.map((e) => (
                  <div key={e}>{e}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="password"
              id="password"
              required
              className={`${input} ${errors.passwordError && "animate-shake"}`}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            ></input>
            {errors.passwordError && (
              <div className={error}>
                {errors.passwordError.map((e) => (
                  <div key={e}>{e}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="confirm password"
              id="confirmPassword"
              required
              className={`${input} ${
                errors.confirmPasswordError && "animate-shake"
              }`}
              onChange={(e) =>
                setUserInfo({ ...userInfo, confirmPassword: e.target.value })
              }
            ></input>
            {errors.confirmPasswordError && (
              <div className={error}>
                {errors.confirmPasswordError.map((e) => (
                  <div key={e}>{e}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="email"
              placeholder="email"
              id="email"
              required
              className={`${input} ${errors.emailError && "animate-shake"}`}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            ></input>
            {errors.emailError && (
              <div className={error}>
                {errors.emailError.map((e) => (
                  <div key={e}>{e}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="confirmEmail"
              placeholder="confirm email"
              id="confirmEmail"
              required
              className={`${input} ${
                errors.confirmEmailError && "animate-shake"
              }`}
              onChange={(e) =>
                setUserInfo({ ...userInfo, confirmEmail: e.target.value })
              }
            ></input>
            {errors.confirmEmailError && (
              <div className={error}>
                {errors.confirmEmailError.map((e) => (
                  <div key={e}>{e}</div>
                ))}
              </div>
            )}
          </div>
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
