import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";

const AppLayout = ({ children }) => {
  const { user } = useUser();

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
            <span className="pl-3">0 tokens available</span>
          </Link>
        </div>
        <div className="bg-gradient-to-b from-slate-800 to-cyan-800 flex-1 overflow-auto">
          list of posts
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
