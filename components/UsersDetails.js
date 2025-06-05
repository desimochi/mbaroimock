"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 20;

export default function UsersDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") || "1");

  const { data, error, isLoading } = useSWR(`/api/admin?page=${page}&limit=${PAGE_SIZE}`, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const { users, totalCount, limit } = data;
  const totalPages = Math.ceil(totalCount / limit);

  const goToPage = (newPage) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div className='container mx-auto p-4'>
      <div  className="flex justify-between my-3 items-center">
        <p>Total Registered Student - {totalCount}</p>
        <div className="mt-4 flex justify-center gap-4 items-center">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
         Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      </div>
      <table className='table-auto w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            <th className="border px-4 py-2 text-left">No.</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">No. Exam Given</th>
            <th className="border px-4 py-2 text-left">Exam Attempted</th>
            <th className="border px-4 py-2 text-left">Mobile</th>
            <th className="border px-4 py-2 text-left">Registration Time</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{(page - 1) * PAGE_SIZE + index + 1}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.mockNames.length > 0 ? user.examCount : "0"}</td>
              <td className="border px-4 py-2">
                {user.mockNames.length > 0 ? (
                  <ul>
                    {user.mockNames.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-sm text-gray-600 font-semibold'>No exam given</p>
                )}
              </td>
              <td className="border px-4 py-2">{user.mobile}</td>
              <td className="border px-4 py-2">
                {new Date(user.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}
