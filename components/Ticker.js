"use client";

import { useRouter } from "next/navigation";

export default function BottomTicker2() {
  const router = useRouter();

  const content = (
    <>
      <span className="mx-8">
        🎯 Register for MBAROI  mock series now to ace your CAT.
      </span>
      <span className="mx-8">
        🎯 Register for MBAROI  mock series now to ace your CAT.
      </span>
    </>
  );

  return (
    <div
      onClick={() => router.push("/register")}
      className={`
        fixed top-15 left-0 w-full
        bg-gradient-to-r from-violet-600 to-violet-800
        text-white py-2 cursor-pointer
        overflow-hidden shadow-lg 
        z-[9999]
      `}
    >
      <div className="flex animate-scroll-slow">
        <div className="flex whitespace-nowrap text-sm sm:text-base font-medium tracking-wide">
          {content}
          {content}
        </div>
        <div className="flex whitespace-nowrap text-sm sm:text-base font-medium tracking-wide">
          {content}
          {content}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-slow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-slow {
          animation: scroll-slow 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
