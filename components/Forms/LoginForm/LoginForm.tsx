"use client";
import {
  loginUser,
  LoginUserStatus,
} from "@/controllers/actions/loginUserAction";
import Link from "next/link";
import React, { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Role } from "@/types";

const roleHome: Record<Role, string> = {
  [Role.ADMIN]: "/admin",
  [Role.MONITOR]: "/monitor",
  [Role.CO_MONITOR]: "/co-monitor",
  [Role.STUDENT]: "/student",
};

function isSafeRedirect(path: string | null, homePrefix: string): path is string {
  return !!path && path.startsWith(homePrefix);
}

const initialState: LoginUserStatus = {
  success: false,
  message: "",
  error: "",
  userId: undefined,
  id: undefined,
  role: undefined,
};

const LoginForm = () => {
  const [formState, action] = useActionState(loginUser, initialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (formState.success) {
      setLoading(true);
      const home = formState.role ? roleHome[formState.role] : undefined;
      if (!home) {
        router.push("/");
        return;
      }
      const redirect = searchParams.get("redirect");
      router.push(isSafeRedirect(redirect, home) ? redirect : home);
    }
  }, [formState.success, formState.role, router, searchParams]);

  return (
    <form
      action={action}
      className="p-5 w-[90%] sm:w-96 flex flex-col gap-5 bg-[#EEEEEE] rounded-lg shadow-lg"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          name="email"
          id="email"
          className="border-1 border-gray-300 px-1.5 py-1 rounded focus:outline-blue-500 bg-white"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="password">Password</label>
          <Link
            href={"/forget-password"}
            className="text-blue-400 hover:underline"
          >
            Forget password?
          </Link>
        </div>
        <input
          type="password"
          name="password"
          id="password"
          className="border-1 border-gray-300 px-1.5 py-1 rounded focus:outline-blue-500 bg-white"
          required
        />
      </div>

      {formState.error && (
        <p className="text-red-500 text-sm">{formState.error}</p>
      )}
      <input
        disabled={loading}
        type="submit"
        value={loading ? "Loading..." : "Sign in"}
        className="mt-1.5 bg-[#222831] hover:bg-[#393E46] rounded p-2 text-white cursor-pointer"
      />
    </form>
  );
};

export default LoginForm;
