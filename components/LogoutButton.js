"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({
      callbackUrl: "/login", // Redirect to this URL after logging out
    });
  };

  return (
    <div className="px-10 w-full">
    <button onClick={handleLogout} className="text-white mt-3 w-full bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-4 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Logout
    </button>
    </div>
  );
}
