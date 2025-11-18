import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { use } from "react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import RegisterCom from "./RefComp";

export default function TextImageSection() {
  const session = use(getServerSession(authOptions));

  return (
    <>
    <div className="w-full relative h-[140vh] md:h-[60vh] lg:h-[70vh] overflow-hidden mb-12">

      {/* FULL BACKGROUND IMAGE */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg.jpg"   // <-- your background image
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* OVERLAY (optional – you can remove if not needed) */}
      <div className="absolute inset-0 bg-red-700/60 -z-0"></div>

      {/* HERO SECTION CONTENT */}
      <section className="relative flex flex-col md:flex-row justify-between px-6 py-16 max-w-7xl mx-auto items-center">

        {/* LEFT CONTENT */}
        <div className="max-w-3xl z-10 md:w-1/2 text-white">
          <p className="text-red-700 text-sm mb-4 px-4 rounded-full font-medium bg-white inline-block">
            Most Trusted MBA Website
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 leading-snug drop-shadow-lg">
            Ace CAT, XAT, MAT with <br />
            <span className="">MBAR.O.I Mock Test</span>
          </h1>

          <p className="text-white/90 text-lg mb-6 max-w-xl drop-shadow-md">
            Master your MBA entrance with expert-designed mock tests, real-time analytics,
            and performance tracking to boost accuracy, speed, and confidence.
          </p>

          <div className="flex gap-2">
            <Link
              href={"/mocks"}
              className="bg-[#d43232] hover:bg-[#a82828] text-white px-6 py-3 rounded-sm font-medium transition"
            >
              Attempt Mock
            </Link>

            {session?.user?.id ? (
              <Link
                href={`/profiles/students/${session.user.id}`}
                className="bg-white/20 border border-white text-white px-6 py-3 rounded-sm font-medium transition backdrop-blur"
              >
                Go to Profile
              </Link>
            ) : (
              <Link
                href={`/login`}
                className="bg-white/20 border border-white text-white px-6 py-3 rounded-sm font-medium transition backdrop-blur"
              >
                Go to Profile
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT SIDE – FORM ON TOP OF FULL BACKGROUND */}
        <div className="relative w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
         {!session && <RegisterCom/>}
        </div>
      </section>

      {/* TAXILA ADS */}
      
    </div>
    <Link
        href={"https://taxila.in/"}
        target="_blank"
        rel="noreferrer noopener"
        className="p-4 block max-w-7xl mx-auto"
      >
        <Image
          src={"/new-ad-hor.jpg"}
          alt="taxila ad"
          height={200}
          width={1200}
          className="mb-4 hidden sm:block"
        />
        <Image
          src={"/new-ad-image-taxila.jpg"}
          alt="taxila ad"
          height={300}
          width={1200}
          className="mb-4 block sm:hidden"
        />
      </Link>
      </>
  );
}
