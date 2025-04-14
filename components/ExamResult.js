"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import OverView from "./OverView";
import TopicWise from "./TopicWise";
import GraphResult from "./GraphResult";
export default function ExamResultComponent() {
  const searchParams = useSearchParams();
  const exam = searchParams.get("exam");
  const [result, setResult] = useState([]); // Initialize as an empty array
  const [ranking, setRanking] = useState()

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/exam-result?exam=${exam}`);
        if (!response.ok) {
          console.error(`Error fetching results: ${response.statusText}`);
          return;
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Debug log
        setResult(data.data || []);
        setRanking(data.ranking || '')
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    if (exam) fetchResult();
  }, [exam]);


  // Calculate counts for donut chart

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl mt-2 bg-red-50 text-red-800 py-2 rounded font-semibold text-center">Exam Performance Overview</h1>
      <hr className="border-t-2 border-red-800" />
      {/* Donut Chart */}
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-5/12">
            <OverView data={result} rank= {ranking} mockexam={exam}/>
            </div>
            <div className="w-full sm:w-7/12">
            <TopicWise data={result}/>
            </div>
            
        </div>
        
        <GraphResult data={result}/>
      
      {Array.isArray(result) && result.length > 0 ? (
        <div className="overflow-x-auto">
          <h3 className="text-xl bg-red-50 py-2 text-red-800 rounded-sm mb-6 mt-8 font-semibold text-center shadow-md">Solution of Questions</h3>
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm rounded-sm">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Question</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Your Answer</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Correct Answer</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Result</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Solution</th>
              </tr>
            </thead>
            <tbody>
  {result.map((item, index) => (
    <tr
      key={`${item.questionIds || 'key'}-${index}`} // Ensure unique key
      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
    >
      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
      <td className="border border-gray-300 px-4 py-2">{item.questionText}</td>
      <td className="border border-gray-300 px-4 py-2">{item.userAnswer}</td>
      <td className="border border-gray-300 px-4 py-2">{item.correctAnswer}</td>
      <td
        className={`border border-gray-300 px-4 py-2 ${
          item.correct ? "text-green-600" : "text-red-600"
        }`}
      >
        {item.correct === '' || item.correct === undefined
          ? "No Answer"
          : item.correct
          ? "Correct"
          : "Wrong"}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {item.solution}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
