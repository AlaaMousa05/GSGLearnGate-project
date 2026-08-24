"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarLink } from "@/types/user";
import { SignOut, List } from "@phosphor-icons/react/dist/ssr";
import { logoutUser } from "@/controllers/actions/logoutUserAction";

interface IProps {
  links: SidebarLink[];
}

export default function SideBar({ links }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <>
      <button
        className={`md:hidden p-3 text-secondary fixed top-4 left-4 z-50 ${
          isOpen ? "hidden" : "block"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <List size={32} />
      </button>
      <aside
        className={`bg-vital border-r border-black/5 w-64 h-screen p-4 flex flex-col fixed top-0 left-0 transform transition-transform duration-300 z-40 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:sticky md:top-0 md:translate-x-0`}
      >
        <div className="flex justify-center items-center gap-2 mb-8 pt-4">
          <Image src="/img/gsgLogo.png" width={50} height={50} alt="gsgLogo" />
          <h1 className="text-gray-600 font-semibold text-lg">
            Gaza <span className="font-normal">Sky</span> Geeks
          </h1>
          <button
            className="md:hidden text-secondary"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1">
          <ul>
            {links.map(({ href, label, icon }) => {
              const isActive = pathname === href;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center p-1 rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-2 w-full p-3 rounded-lg ${
                        isActive
                          ? "bg-primary text-white font-medium"
                          : "text-gray-500 font-bold hover:bg-primary/20 hover:text-gray-800"
                      }`}
                    >
                      <div>{icon}</div>
                      <div className="text-[15px]">{label}</div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-red-50">
            <SignOut size={24} className="text-red-500" />
            <button
              onClick={handleLogout}
              className="text-red-500 font-bold text-[14px]"
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
