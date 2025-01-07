"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await response.json();
      setSuccess(data.message);
      setFormData({ name: "", password: "" });
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Update Profile
        </h1>
        <form onSubmit={handleSubmit} className="mt-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-800">
              Update Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your new name"
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-800">
             Update Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 text-white bg-red-800 rounded-full hover:bg-red-600 focus:outline-none focus:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
