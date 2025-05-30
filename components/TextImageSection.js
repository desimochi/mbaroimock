

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { use } from "react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
export default function TextImageSection() {
  const session  = use(getServerSession(authOptions))
  console.log(session)
    return (
        <div className="max-w-7xl mx-auto">
           <section className="relative flex items-center justify-between px-6 py-2 ">
      {/* Left Content */}
      <div className="max-w-xl z-10">
        <p className="text-red-700 text-sm mb-4 relativew-fit px-4 rounded-full">
          <span className="inline-block font-medium">Most Trusted MBA Website</span>
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
          Ace CAT, XAT, MAT with  <br />
          <span className="text-gray-900">MBAR.O.I Mock Test</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Master your MBA entrance with expert-designed mock tests, real-time analytics, and performance tracking to boost accuracy, speed, and confidence
        </p>
        <div className="flex gap-2">
        <Link href={"/mocks"} className="bg-[#d43232] hover:bg-[#a82828] text-white px-6 py-3 rounded-sm font-medium transition">
          Attempt Mock
        </Link>
        <Link href={`/profiles/students/${session.user.id}`} className="bg-red-50 border border-red-700 text-red-700 px-6 py-3 rounded-sm font-medium transition">
          Go to Profile
        </Link>
        </div>
      </div>

      {/* Right Content */}
      <div className="relative hidden md:block">
        <div className="relative z-10">
          <Image
            src="/hero-image-girl.png" // use exported girl image
            alt="Hero Student"
            width={700}
            height={700}
            className="rounded-xl object-cover z-10"
          />
        </div>

      </div>
    </section>
      </div>
    );
  }
  