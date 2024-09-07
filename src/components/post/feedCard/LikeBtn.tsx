"use client";

import React, { useEffect } from "react";
import s from "./style.module.scss";
import { useState } from "react";
import { toggleLike } from "@/lib/actions";
import { FiThumbsUp } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

type LikeButtonProps = {
  postId: string;
  initialLikeCount: number;
  userLiked: boolean;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  userLiked = false,
  initialLikeCount,
}) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(userLiked);
  const [error, setError] = useState<string | null>(null);

  const handleLikeToggle = async () => {
    let isLiked = liked;
    setError(null);
    try {
      setLiked((prev) => {
        isLiked = !prev;
        return isLiked;
      });
      setLikeCount((prev) => prev + (!isLiked ? -1 : 1));

      const newLikeCount = await toggleLike(postId);
      if (typeof newLikeCount !== "number") {
        throw newLikeCount;
      }
      setLikeCount(newLikeCount);
    } catch (err) {
      setError(err?.message || "Failed to update like status");
      console.log(err?.message, { err });
      setLiked((prev) => !prev);
      setLikeCount((prev) => {
        let res = prev - (!isLiked ? -1 : 1);
        return res >= 0 ? res : 0;
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <button className={s.likeButton} onClick={handleLikeToggle}>
        {liked ? <FiThumbsUp fill="currentColor" /> : <FiThumbsUp />}
        <span>{likeCount}</span>
        <Toaster />
      </button>
    </>
  );
};

export default LikeButton;
