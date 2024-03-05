import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { getServerSession } from "next-auth";
import { auth0ptions } from "@/lib/auth";
import { signOut } from "next-auth/react";
import UserAccountNav from "./userAccountNav";

const Navbar = async () => {
  const session = await getServerSession(auth0ptions);

  return (
    <div className=" bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0 m-10">
      <div className="container flex items-center justify-between">
        <Link href="/"> Sign Out </Link>
        <Link
          className={buttonVariants()}
          href="/sign-in">
          Sign in
        </Link>
        {session?.user ? (
          <UserAccountNav />
        ) : (
          <div>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
