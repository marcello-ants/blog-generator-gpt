import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

const Home = () => {
  const { user } = useUser();

  return (
    <div>
      <div>
        {!!user ? (
          <div>
            <Image width={50} height={50} alt={user.name} src={user.picture} />
            <div>{user.email}</div>
            <Link href="/api/auth/logout">Logout</Link>
          </div>
        ) : (
          <Link href="/api/auth/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Home;
