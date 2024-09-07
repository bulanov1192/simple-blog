import getPosts from "@/lib/getPosts";
import s from "./index.module.scss";
import NewPostForm from "@/components/post/create";
import PostFeedCard from "@/components/post/feedCard";
import { getUser } from "@/lib/getUser";

export default async function Home() {
  const posts = await getPosts();
  const user = await getUser();

  return (
    <div className={s.MainFeedWrapper}>
      {user?.id && <NewPostForm />}
      {posts.map((post) => (
        <PostFeedCard key={post.id} post={post} />
      ))}
    </div>
  );
}
