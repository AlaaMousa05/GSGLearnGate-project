import Link from "next/link";
import { SkipBack } from "phosphor-react";
import React from "react";

const Header = () => {
  return (
    <div className="md:w-[750] lg:w-[970] xl:w-[1170] m-auto py-2.5 px-2.5">
      <div className="flex justify-between items-center">
        <img src="/img/signup-background.svg" alt="logo" width={60} height={60} />
        <Link href={"/"} className="flex items-center gap-2.5">
          <SkipBack size={20} />
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default Header;