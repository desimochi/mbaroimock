"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function TogglePopoverLogin({ user, data }) {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);
  const displayedName = user?.name ?? data.user?.name ?? "Guest"
  let urll;
  if (data.user?.role === "teacher") {
    urll = `/profiles/teachers/${data.user?.id}`;
  } else {
    urll = `/profiles/students/${data.user?.id}`;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsPopoverVisible(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        onMouseEnter={() => setIsPopoverVisible(true)}
        ref={buttonRef}
        type="button"
        className="px-6 py-2 border-2 border-red-800 rounded-md text-red-800 hover:bg-red-800 hover:text-white transition duration-300"
      >
        {displayedName}
      </button>

      {/* Popover */}
      {isPopoverVisible && (
        <div
          role="tooltip"
          ref={popoverRef}
          onMouseEnter={() => setIsPopoverVisible(true)} // Keep popover visible
          onMouseLeave={() => setIsPopoverVisible(false)} // Close popover when leaving
          className="absolute z-10 inline-block w-64 text-sm text-gray-500 transition-opacity top-12 right-0 duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600"
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Link href={urll}>
                <button
                  type="button"
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-xs px-8 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Profile
                </button>
              </Link>
              <button
                onClick={() => signOut()}
                type="button"
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-xs px-8 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Logout
              </button>
            </div>
            <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
              <a href="#">{displayedName}</a>
            </p>
            <p className="mb-3 text-sm font-normal">
              <a href="#" className="hover:underline">
                {data.user?.email}
              </a>
            </p>
            <p className="mb-4 text-sm">
              MBA Mock Test Participant{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-500 hover:underline"
              >
                mbaroi.in
              </a>
              .
            </p>
          </div>
          {/* Arrow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l transform rotate-45 dark:bg-gray-800 dark:border-gray-600"></div>
        </div>
      )}
    </div>
  );
}
