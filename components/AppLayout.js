import { useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import PostsContext from "../context/postsContext";
import Logo from "./Logo";

const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  postCreated,
}) => {
  const { user } = useUser();

  const { setPostsFromSSR, posts, getPosts, noMorePosts } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-3">
          <Logo />
          <Link href="/post/new" className="btn">
            New post
          </Link>
          <Link href="/token-topup" className="block mt-3 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-3">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="bg-gradient-to-b from-slate-800 to-cyan-800 flex-1 overflow-auto px-4">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`border block text-ellipsis whitespace-nowrap rounded-sm px-2 py-1 my-1 overflow-hidden cursor-pointer ${
                postId === post._id
                  ? "bg-white/20 border-white"
                  : "bg-white/10 border-white/0"
              }`}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4"
              onClick={() => {
                getPosts({ lastPostDate: posts[posts.length - 1].created });
              }}
            >
              Load more posts
            </div>
          )}
        </div>
        <div className="bg-cyan-800 h-20 flex items-center gap-2 border-t border-t-black/50 px-3">
          {!!user ? (
            <>
              <div className="min-w-[50px] ">
                <Image
                  width={50}
                  height={50}
                  alt={user.name}
                  src={user.picture}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link href="/api/auth/logout" className="text-sm">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
