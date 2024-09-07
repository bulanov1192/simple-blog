"use server";

import prisma from "@/lib/prisma";
import { InternalServerErrorResponse } from "./ServerActionResponse";
import { getUser } from "./getUser";
import { NOT_AUTHORIZED_ERROR_MSG } from "./constants";

export const toggleLike = async (postId: string) => {
  try {
    const user = await getUser();
    // Check if user is authorized
    if (!user?.id) {
      throw {
        status: 401,
        message: NOT_AUTHORIZED_ERROR_MSG,
      };
    }
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { Like: true },
    });

    if (!post) {
      throw {
        status: 404,
        message: "Post not found",
      };
    }

    const hasLiked = post.Like.some((like) => like.userId === user.id);

    if (hasLiked) {
      await prisma.like.deleteMany({
        where: {
          userId: user.id,
          postId,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId,
        },
      });
    }

    const likeCount = await prisma.like.count({
      where: {
        postId,
      },
    });

    return likeCount;
  } catch (error) {
    console.error("Error toggling like: ", { error });
    return InternalServerErrorResponse(error);
  }
};
