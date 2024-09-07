"use client";

import React, { useEffect, useState } from "react";
import s from "./style.module.scss";
import Button from "@/components/button";
import { useMutation } from "@tanstack/react-query";
import createPost from "@/lib/createPost";
import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_TITLE_LENGTH,
} from "@/lib/constants";

const PostForm: React.FC = () => {
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: ["submitPost", postTitle, postContent],
    mutationFn: async () => {
      createPost({ title: postTitle, content: postContent });
    },
    onError: (error) => {
      console.log(error);
      setServerError(
        "An error occurred while submitting the post: " + error.message
      );
    },
    onSuccess: (data, variables, context) => {
      setPostTitle("");
      setPostContent("");
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(e.target.value);
  };

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const validateFields = (): boolean => {
    setTitleError(null);
    setContentError(null);
    setServerError(null);
    if (postTitle.trim().length > MAX_POST_TITLE_LENGTH) {
      setTitleError(`Title cannot exceed ${MAX_POST_TITLE_LENGTH} characters`);
      return false;
    }

    if (!postContent.trim()) {
      setContentError("Post content cannot be empty");
      return false;
    }

    if (postContent.trim().length > MAX_POST_CONTENT_LENGTH) {
      setContentError(
        `Post content cannot exceed ${MAX_POST_CONTENT_LENGTH} characters`
      );
      return false;
    }

    return true;
  };

  const handlePostSubmit = async () => {
    const isValid = validateFields();
    if (!isValid) return;
    mutation.mutate();
  };

  return (
    <form action={handlePostSubmit} className={s.postForm}>
      <input
        className={s.titleInput}
        placeholder="Enter post title (optional)"
        value={postTitle}
        onChange={handleTitleChange}
        max={MAX_POST_TITLE_LENGTH}
      />
      <textarea
        className={s.postInput}
        placeholder="What's on your mind?"
        value={postContent}
        onChange={handlePostChange}
      />
      <p className={s.charCount}>
        {postContent.length}/{MAX_POST_CONTENT_LENGTH}
      </p>
      <div className={s.errors}>
        {titleError && <p className="errorText errorTextSm">{titleError}</p>}

        {contentError && (
          <p className="errorText errorTextSm">{contentError}</p>
        )}
        {serverError && <p className="errorText errorTextSm">{serverError}</p>}
      </div>
      <div className={s.actions}>
        <Button
          type="submit"
          disabled={mutation.isPending || postContent.trim().length === 0}
          title={
            postContent.trim().length === 0
              ? "Post cannot be empty"
              : "Submit post"
          }
        >
          Post
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
