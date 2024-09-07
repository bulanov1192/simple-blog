import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Define the routes that should redirect authenticated users to the main page
  const authRoutes = ["/sign-in", "/sign-up"];

  if (!!token) {
    const session = await prisma.session.findUnique({ where: { token } });

    if (session && session.expiresAt >= new Date()) {
      // If the user is authenticated and trying to access sign-in or sign-up, redirect to the main page
      if (authRoutes.includes(req.nextUrl.pathname)) {
        console.log("Redirecting authenticated user to main page");
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }
  }

  if (!token && !authRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/my", "/settings", "/sign-in", "/sign-up"], // Add your protected and auth routes here
};
