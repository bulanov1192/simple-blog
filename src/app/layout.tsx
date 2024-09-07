"use server";

import React from "react";
import "../styles/global.scss";
import { Header } from "@/components";
import s from "./index.module.scss";
import { getUser } from "@/lib/getUser";
import Providers from "@/lib/Providers";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
  });

  return (
    <html lang="en">
      <head>
        <title>Simple blog</title>
      </head>
      <body>
        <Providers>
          <HydrationBoundary>
            <Header />
            <main className={s.MainLayout}>{children}</main>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
