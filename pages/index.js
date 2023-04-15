import Link from "next/link";

const Home = () => {
  return (
    <div>
      <p>Home</p>
      <div>
        <Link href="/api/auth/login">Login</Link>
      </div>
    </div>
  );
};

export default Home;
