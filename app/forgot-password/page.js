"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const[loading, setLoadig] = useState(false)
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadig(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError(null);
        setLoadig(false)
      } else {
        setError(data.error);
        setMessage(null);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally{
      setLoadig(false)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-1/3 p-6 border rounded-lg shadow-md">
        <h1 className="text-xl font-semibold">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          {loading? "Sending Link..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
