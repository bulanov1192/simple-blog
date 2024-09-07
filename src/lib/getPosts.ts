import prisma from "@/lib/prisma";
import { getUser } from "./getUser";

async function getPosts() {
  const user = await getUser();
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        Like: {
          where: {
            userId: user?.id,
          },
        },
        _count: {
          select: {
            Like: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error retrieving posts:", error);
    throw error;
  }
}

export default getPosts;
