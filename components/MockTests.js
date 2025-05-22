"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function MockTests() {
  const [mocks, setMocks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMocks = async () => {
      try {
        const response = await fetch("/api/fetchmocks"); // API route for fetching mocks
        if (!response.ok) {
          throw new Error("Failed to fetch mock test details");
        }
        const data = await response.json();
        setMocks(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMocks();
  }, []);
  
  function formatExamName(name) {
    return name
      .replace(/([a-z])([A-Z0-9])/g, '$1 $2') // Insert space between lowercase and uppercase/digit
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2'); // Insert space between consecutive uppercase letters followed by lowercase
  }

  if (loading) {
    return (
      <div aria-label="Loading Questions..." role="status" className="container flex items-center justify-center mx-auto mt-24 sm:mt-32 mb-24  border text-white rounded-lg p-8 md:p-12 shadow-lg">
        <svg className="h-20 w-20 animate-spin stroke-red-800" viewBox="0 0 256 256">
          <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
        </svg>
        <span className="text-3xl font-medium text-black">Loading Mocks...</span>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!mocks || mocks.length === 0) {
    return <p>No mock tests available.</p>;
  }

  return (
    <>
   
    <div className="container mx-auto mt-24 sm:mt-32 mb-24  border text-white rounded-lg p-8 md:p-12 shadow-lg ">
      <h2 className="text-black mb-8 text-center text-3xl sm:text-2xl lg:text-5xl font-normal leading-tight">Available Mocks to Attempt</h2>
      <hr class="border-red-700 w-1/2 mx-auto mb-12 border-t-2" />
      <div className="flex flex-wrap gap-6 items-center justify-center">
      {mocks.map((mock) => {
  const duration = /cmat/i.test(mock.examName) ? 180 : 120;

  return (
    <div
      key={mock._id}
      className="w-full sm:w-1/4 p-4 border border-gray-400 rounded-[12px] text-black overflow-hidden"
    >
      <h5 className="text-lg font-semibold text-center">{formatExamName(mock.examName)}</h5>
      <div className="border-t border-dotted border-gray-400 my-3"></div>
      <p className="text-sm text-gray-300 break-words">{mock.description}</p>
      <div className="flex justify-between">
        <p className="text-sm text-gray-800 break-words mt-2">
          <strong>Questions:</strong> {mock.limit}
        </p>
        <p className="text-sm text-gray-800 break-words mt-2">
          <strong>Duration:</strong> {duration} minutes
        </p>
      </div>
      <Link href={`/exam?mock=${mock._id}`}>
        <button className="w-full bg-red-700 mt-4 p-2 rounded-full text-white">Start Exam</button>
      </Link>
    </div>
  );
})}
      </div>
    </div>
    </>
  );
}
