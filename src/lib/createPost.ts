"use server";

import prisma from "@/lib/prisma";
import { InternalServerErrorResponse } from "./ServerActionResponse";
import { getUser } from "./getUser";
import { revalidateTag } from "next/cache";

export default async function createPost(payload: {
  title?: string;
  content: string;
}) {
  const user = await getUser();
  // Check if user is authorized
  if (!user.id) {
    throw new Error("User is not authorized");
  }

  try {
    const { title, content } = payload;

    // Create a new post in Prisma
    const newPost = await prisma.post.create({
      data: {
        title: title || null,
        content,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        author: true,
      },
    });

    // Prepare the response object
    const response = {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
    };

    revalidateTag("posts");

    return response;
  } catch (error) {
    console.error("Error creating new post: ", { error });
    return InternalServerErrorResponse(error);
  }
}
