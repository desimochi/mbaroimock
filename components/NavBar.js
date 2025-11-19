"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import TogglePopoverLogin from "./TogglePopoverLogin";
import { useUser } from "@/context/UserContext";
import Image from "next/image";


export default function Navbar() {
  const { data: session } = useSession();
  const { user } = useUser();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-sm py-2 px-8 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo */}
    <div className="flex items-center">
      <div className="text-red-600 text-3xl font-bold font-sans">
      <Image 
  src="/new.jpeg"
  alt="logo"
  width={140}
  height={100}
  priority
/>

      </div>
    </div>

    {/* Hamburger Menu (Visible on Mobile) */}
    <div className="md:hidden">
      <button
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        className="text-black focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    </div>

    {/* Navigation Links */}
    {/* <div
      className={`${
        isMobileMenuOpen ? 'block' : 'hidden'
      } md:flex md:items-center md:space-x-8 bg-gray-100 md:bg-transparent px-6 py-4 md:py-0 md:rounded-none rounded-full`}
    >
      <Link href="#" className="text-gray-600 hover:text-black block md:inline">
        Courses
      </Link>
      <Link href="#" className="text-gray-600 hover:text-black block md:inline">
        Platform
      </Link>
      <Link href="#" className="text-gray-600 hover:text-black block md:inline">
        Enterprise
      </Link>
      <Link href="#" className="text-gray-600 hover:text-black block md:inline">
        Resources
      </Link>
      <Link href="#" className="text-gray-600 hover:text-black block md:inline">
        Contact
      </Link>
    </div> */}

    {/* Sign Up Button */}
    <div className="hidden md:block">
      {session ? (
        <TogglePopoverLogin user={user} data={session} />
      ) : (
        <button
          onClick={() => signIn()}
          className="px-6 py-2 border-2 border-black rounded-full text-black hover:bg-black hover:text-white transition duration-300"
        >
          Sign In
        </button>
      )}
    </div>
  </div>

  {/* Sign Up Button (Visible on Mobile) */}
  <div className="md:hidden mt-4">
    {!session && (
      <button
        onClick={() => signIn()}
        className="w-full px-6 py-2 border-2 border-black rounded-full text-black hover:bg-black hover:text-white transition duration-300"
      >
        Sign up
      </button>
    )}
  </div>
</nav>

  );
}
