"use client";

import React from "react";
import s from "./style.module.scss";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { StatusCodes } from "@/lib/StatusCodes";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/lib/getUser";
import Loader from "../loader";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(),
  });

  const onSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    const res = await signOut();
    if (res.status === StatusCodes.Ok) {
      queryClient.invalidateQueries({ queryKey: ["getUser"], exact: true });
      return router.push("/sign-in");
    }
  };

  return (
    <header className={s.Header}>
      <Link href="/">
        <b>SimpleBlog</b>
      </Link>
      <div className={s.User}>
        {user?.id ? (
          <>
            <span>{user?.name}</span>
            <a href="" onClick={(e) => onSignOut(e)}>
              Sign Out
            </a>
          </>
        ) : (
          <>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <Link href="/sign-in">Sign in</Link>
                <Link href="/sign-up">Sign up</Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}
