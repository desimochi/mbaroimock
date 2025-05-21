"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const searchParams = useSearchParams();
  const mock = searchParams.get("mock");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard?mock=${mock}`);
        if (!response.ok) {
          console.error("Failed to fetch leaderboard:", response.statusText);
          return;
        }
        const data = await response.json();
        setLeaderboard(data.data || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mock) fetchLeaderboard();
  }, [mock]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Leaderboard</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
            <th className="border border-gray-300 px-4 py-2 text-left">User ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Marks Received</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((item) => (
            <tr key={item._id} className="even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{item.rank}</td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.marksreceieved}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {leaderboard.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No data available for this mock.</p>
      )}
    </div>
  );
}
