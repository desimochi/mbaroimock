"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PayButton from "./PayButton";
import { useSession } from "next-auth/react";

export default function MockTests({ user }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [mocks, setMocks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const fetchMocks = async () => {
      try {
        const response = await fetch("/api/fetchmocks");
        if (!response.ok) throw new Error("Failed to fetch mock test details");
        const data = await response.json();
        setMocks(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    const fetchPaid = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/paid?userID=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch payment status");
        const data = await response.json();
        setPaid(data?.hasPaid || false);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (session) fetchPaid();
    fetchMocks().finally(() => setLoading(false));
  }, [session, userId]);

  function formatExamName(name) {
    return name
      .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  }

  if (loading) {
    return (
      <div aria-label="Loading" className="container flex items-center justify-center mx-auto mt-24 sm:mt-32 mb-24 border text-white rounded-lg p-8 md:p-12 shadow-lg">
        <svg className="h-20 w-20 animate-spin stroke-red-800" viewBox="0 0 256 256">
          <circle cx="128" cy="128" r="96" strokeWidth="16" stroke="currentColor" fill="none" />
        </svg>
        <span className="ml-4 text-3xl font-medium text-black">Loading Mocks...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  }

  const freeMocks = mocks.filter(mock => mock.isFree);
  const paidMocks = mocks.filter(mock => !mock.isFree);

  return (
    <>
      {/* Free Mocks Section */}
      <div className="container mx-auto mt-24 sm:mt-32 mb-24 border text-white rounded-lg p-8 md:p-12 shadow-lg">
        <h2 className="text-black mb-8 text-center text-3xl sm:text-2xl lg:text-5xl font-normal">Free Mocks</h2>
        <hr className="border-red-700 w-1/2 mx-auto mb-12 border-t-2" />
        <div className="flex flex-wrap gap-6 items-center justify-center">
          {freeMocks.length === 0 ? (
            <p className="text-black">No free mocks available.</p>
          ) : (
            freeMocks.map(mock => {
              const duration = /cmat/i.test(mock.examName) ? 180 : 120;
              return (
                <div key={mock._id} className="w-full sm:w-1/4 p-4 border border-gray-400 rounded-[12px] text-black overflow-hidden">
                  <h5 className="text-lg font-semibold text-center">{formatExamName(mock.examName)}</h5>
                  <div className="border-t border-dotted border-gray-400 my-3"></div>
                  <p className="text-sm text-gray-700">{mock.description}</p>
                  <div className="flex justify-between">
                    <p className="text-sm mt-2"><strong>Questions:</strong> {mock.limit}</p>
                    <p className="text-sm mt-2"><strong>Duration:</strong> {duration} mins</p>
                  </div>
                  <Link href={`/exam?mock=${mock._id}`}>
                    <button className="w-full bg-red-700 mt-4 p-2 rounded-full text-white">Start Exam</button>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Paid Mocks Section */}
      <div className="container mx-auto mt-16 mb-24 border text-white rounded-lg p-8 md:p-12 shadow-lg">
        <h2 className="text-black mb-8 text-center text-3xl sm:text-2xl lg:text-5xl font-normal">Paid Mocks</h2>
        <hr className="border-red-700 w-1/2 mx-auto mb-12 border-t-2" />
        <div className="flex flex-wrap gap-6 items-center justify-center">
          {paidMocks.length === 0 ? (
            <p className="text-black">No paid mocks available.</p>
          ) : (
            paidMocks.map(mock => {
              const duration = /cmat/i.test(mock.examName) ? 180 : 120;
              return (
                <div key={mock._id} className="w-full sm:w-1/4 p-4 border border-gray-400 rounded-[12px] text-black overflow-hidden">
                  <h5 className="text-lg font-semibold text-center">{formatExamName(mock.examName)}</h5>
                  <div className="border-t border-dotted border-gray-400 my-3"></div>
                  <p className="text-sm text-gray-700">{mock.description}</p>
                  <div className="flex justify-between">
                    <p className="text-sm mt-2"><strong>Questions:</strong> {mock.limit}</p>
                    <p className="text-sm mt-2"><strong>Duration:</strong> {duration} mins</p>
                  </div>
                  <div className="flex flex-col md:flex-col sm:flex-row justify-between">
                    <p className="text-sm mt-2">✔️ Updated Mocks As Per Syllabus</p>
                    <p className="text-sm mt-2">✔️ As per Updated Exam Pattern</p>
                  </div>
                  <div className="flex flex-col md:flex-col sm:flex-row justify-between">
                    <p className="text-sm mt-2">✔️ By Top MBA Entrance Exam Instructors </p>
                    <p className="text-sm mt-2">✔️ Unlimited Access and Reattempts</p>
                  </div>
                  {paid && 
                    <Link href={`/exam?mock=${mock._id}`}>
                      <button className="w-full bg-red-700 mt-4 p-2 rounded-full text-white">Start Exam</button>
                    </Link>}
                </div>
              );
            })
          )}
        </div>
        {session? !paid && (
          <div className="max-w-xl mx-auto mt-8">
            <PayButton userId={userId} />
          </div>
        ) : <Link href={"/login"}>Unlock @49</Link>}
      </div>
    </>
  );
}
