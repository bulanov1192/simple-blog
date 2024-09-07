"use server";

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { cookies } from "next/headers";
import { AUTH_CREDS_ERROR_MSG } from "./constants";
import prisma from "@/lib/prisma";
import { StatusCodes } from "@/lib/StatusCodes";
import {
  InternalServerErrorResponse,
  ServerActionResponse,
} from "@/lib/ServerActionResponse";
import { redirect } from "next/navigation";

interface UserRegData {
  email: string;
  password: string;
  name: string;
}

export async function registerUser(data: UserRegData) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    return redirect("/login");
  } catch (error) {
    if (error?.code === "P2002") {
      return ServerActionResponse({
        status: StatusCodes.Conflict,
        message: "User with this email already exists",
        data: null,
      });
    } else {
      console.error("Error registering user: ", { error });
      return InternalServerErrorResponse(error);
    }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    const CredsError = ServerActionResponse({
      status: StatusCodes.Unauthorized,
      message: AUTH_CREDS_ERROR_MSG,
      data: null,
    });

    if (!user) return CredsError;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return CredsError;

    const token = uuidv4();
    const expiresAt = add(new Date(), { hours: 1 });

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    cookies().set("sessionid", token, {
      httpOnly: true,
      expires: expiresAt,
    });

    return ServerActionResponse({
      status: StatusCodes.Ok,
      message: "User logged in successfully",
      data: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error logging in user", error);
    return InternalServerErrorResponse(error);
  }
}

export async function signOut() {
  try {
    const token = cookies().get("sessionid")?.value;

    if (token) {
      await prisma.session.delete({ where: { token } });
      cookies().set("sessionid", "", { expires: new Date(0) });
    }

    return ServerActionResponse({
      status: StatusCodes.Ok,
      message: "User logged out successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error signing out user", error);
    return InternalServerErrorResponse(error);
  }
}
