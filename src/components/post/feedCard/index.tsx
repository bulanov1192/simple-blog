"use server";

import React, { Suspense } from "react";
import s from "./style.module.scss";
import Link from "next/link";
import LikeButton from "./LikeBtn";
import { toggleLike } from "@/lib/actions";
import { Like, Prisma } from "@prisma/client";
import { getUser } from "@/lib/getUser";
import classNames from "classnames";
import ClientTime from "@/components/ClientTime";

interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  Like: Like[];
  _count: {
    Like: number;
  };
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = async ({ post }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className={s.postCard}>
      <h3 className={s.title}>{post.title}</h3>
      <div className={s.author}>
        <Link href={`/user/${post.author.id}`}>{post.author.name}</Link>
        <div className={s.createdAt}>
          <ClientTime
            serverFormatted={formatDate(post.createdAt)}
            serverDate={post.createdAt.toISOString()}
          />
        </div>
      </div>
      <p className={s.content}>{post.content}</p>
      <div className={s.footer}>
        <LikeButton
          postId={post.id}
          userLiked={!!post.Like.find((like) => post.author.id === like.userId)}
          initialLikeCount={post._count.Like}
        />
      </div>
    </div>
  );
};

export default PostCard;
