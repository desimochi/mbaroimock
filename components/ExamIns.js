"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";

const CMATInstructions = ({handleins, mock}) => {
  const marks = mock ==='cmat'? 4 : `${mock==='mat'? 1 : 3}`
  const negmarks = mock ==='cmat'? 1 : `${mock==='mat'? 0.25 : 1}`
   const duration = mock ==='cmat'? 180 : 120
  return (
    <div className="h-full mb-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <div className="w-full sm:w-3/4 p-6 bg-white shadow-md rounded-lg border border-gray-200 mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Mock Test Instructions</h1>
      <hr class="border-red-700 w-1/2 mx-auto mb-6 border-t-2" />
      <p className="text-gray-600 mb-3">
        Please read the following instructions carefully before attempting the test.
      </p>

      <ol className="list-decimal list-inside space-y-4 text-gray-700">
        <li>
          <span className="font-semibold">Test Duration:</span> The total duration of the mock test is <span className="font-semibold">3 hours ({duration})</span>. Ensure that you have sufficient uninterrupted time to complete the test.
        </li>
        <li>
          <span className="font-semibold">Question Format:</span> The test consists of multiple-choice questions (MCQs). Each question has <span className="font-semibold">four options</span>, and only one is correct.
        </li>
        <li>
          <span className="font-semibold">Marking Scheme:</span>
          <ul className="list-disc list-inside ml-6">
            <li>+{marks} marks will be awarded for each correct answer.</li>
            <li>-{negmarks} mark will be deducted for every incorrect answer.</li>
            <li>No marks will be deducted for unanswered questions.</li>
          </ul>
        </li>
        <li>
          <span className="font-semibold">Technical Requirements:</span> Use a stable internet connection to avoid disruptions. Ensure your device is fully charged and use a modern browser.
        </li>
        <li>
          <span className="font-semibold">Test Environment:</span> Find a quiet place to attempt the test without distractions. Avoid switching tabs or applications during the test.
        </li>
        <li>
          <span className="font-semibold">Time Management:</span> You can navigate between sections and questions freely. Allocate time wisely.
        </li>
        <li>
          <span className="font-semibold">Submit Carefully:</span> Review all your answers before clicking the <span className="font-semibold">Submit</span> button. Once submitted, you cannot change your responses.
        </li>
        <li>
          <span className="font-semibold">Navigation:</span> You can navigate to question using <strong>Previous</strong> or <strong>Next</strong> button and click the circles to react at specific question.
        </li>
        <li>
          <span className="font-semibold">Help and Support:</span> In case of technical issues, contact support at <a href="mailto:info@mock.mbaroi.in" className="text-red-500 underline">info@mock.mbaroi.in</a>.
        </li>
      </ol>

      <div className="mt-6">
        <button onClick={handleins} className="px-6 py-3 w-full bg-red-800 text-white rounded-full font-semibold hover:bg-red-700 transition">
          Start Test
        </button>
      </div>
    </div>
    <div className="w-full sm:w-1/4">
    <Link href={"https://taxila.in/"} target="_blank" rel="noreferrer noopener" className="p-4">
          <Image src={"/taxila-ad2.jpg"} alt="taxila ad" height={200} width={600} className="mb-4" />
    </Link>
    </div>
    </div>
    </div>
  );
};

export default CMATInstructions;
