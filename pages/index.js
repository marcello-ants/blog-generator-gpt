import Image from "next/image";
import Link from "next/link";
import HeroImage from "../public/hero.webp";
import { Logo } from "../components";

const Home = () => {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center overflow-hidden">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="relative max-w-screen-sm bg-slate-900/90 text-white text-center rounded-md px-10 py-5 z-10 backdrop-blur-sm">
        <Logo />
        <p>
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link href="/post/new" className="btn mt-5">
          Begin
        </Link>
      </div>
    </div>
  );
};

export default Home;
