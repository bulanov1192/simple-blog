"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export const getUser = async (): Promise<User> => {
  try {
    let user = null;
    const sessionToken = cookies().get("sessionid")?.value;

    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });

      if (session && session.user) {
        user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
        };
      }
    }

    return user ? { ...user } : null; // Ensure user is a plain object
  } catch (e: any) {
    console.error("Error getting user", e);
    return null;
  }
};
