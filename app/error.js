"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  // Log the error to an error reporting service, for example
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
      <h1 className="text-3xl font-bold mb-4 text-red-700">Oops! Something went wrong.</h1>
      <p className="mb-6 text-red-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 focus:outline-none"
      >
        Try Again
      </button>
    </div>
  );
}
