import LoginForm from "@/components/Forms/LoginForm/LoginForm";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="h-dvh flex flex-col justify-center items-center gap-5">
      <div>
        <img
          src="/img/gsgLogo.png"
          alt="Gaza Sky Geeks logo"
          width={70}
          height={70}
          className="m-auto"
        />
        <p className="text-2xl mt-3.5">Sign in to GSG</p>
      </div>
      <LoginForm />
      <div className="text-center border-1 p-5 rounded-lg w-[90%] sm:w-96">
        <p>New to Gaza Sky Geeks?</p>
        <Link href={"/signup"} className="text-blue-400 hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default page;
