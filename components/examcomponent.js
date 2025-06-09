"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import CMATInstructions from "./ExamIns";
import Link from "next/link";

export default function ExamComponent() {
  const searchParams =useSearchParams()
  const mockId = searchParams.get('mock');
  const [questions, setQuestions] = useState([]);
  const router = useRouter();
  const [mock, setMock] = useState();
  const [mockName, setMockName] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submission, setSubmission] = useState(false)
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [instructions, setinstructions] = useState(true)
  const [loading, setLoading] = useState(true);
  const [subloading, setSubLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 1 minute in seconds
  const [isTimerExpired, setIsTimerExpired] = useState(false); // Track if timer has expired

  const handleins =() =>{
    setinstructions(false)
  }
  const loadProgress = () => {
    const savedProgress = JSON.parse(localStorage.getItem("examProgress"));
    if (savedProgress) {
      setAnswers(savedProgress.answers || {});
      setMarkedForReview(savedProgress.markedForReview || []);
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex || 0);
      setTimeLeft(savedProgress.timeLeft || 180 * 60);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const hasSavedProgress = loadProgress();

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/mine?mock=${mockId}`);
        if (!response.ok) {
          console.error(`Error fetching questions: ${response.statusText}`);
          return;
        }
        const data = await response.json();
        setQuestions(data.questions);
        setMock(data.mockId);
        setTimeLeft(data.duration*60 || 180*60)
        setMockName(data.mock)

        if (!hasSavedProgress) {
          setCurrentQuestionIndex(0);
          setAnswers({});
          setMarkedForReview([]);
          setTimeLeft(data.duration*60); // Reset timer to initial value
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [mockId]);

  useEffect(() => {
    let timer;
  
    if (!instructions) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimerExpired(true); // Set timer expired flag
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(timer); // Cleanup timer on unmount or when `instructions` changes
  }, [instructions]);

  const handleSubmit = async () => {
    setSubLoading(true)
    if (!mock || questions.length === 0) {
      alert("No questions to submit.");
      return;
    }
  
    // Ensure all questions are included in the answers, even if unanswered
    const finalAnswers = {};
    questions.forEach((question) => {
      finalAnswers[question.questionId] = answers[question.questionId] || ""; // Default to an empty string
    });
  
    try {
      const payload = { mock, answers: finalAnswers };
      console.log("Submitting payload:", payload);
  
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        alert(`Error submitting answers: ${errorData.message || "Unknown error"}`);
        return;
      }
  
      localStorage.removeItem("examProgress");
      setCurrentQuestionIndex(0);
      setAnswers({});
      setMarkedForReview([]);
      setTimeLeft(180 * 60);
      setSubLoading(false) // Reset timer after submission
      setSubmission(true)
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("An unexpected error occurred while submitting answers.");
    }
  };
  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  if(instructions){
      return <CMATInstructions handleins={handleins} mock={mockName}/>
  }
  
  if (loading) return <div className="flex items-center justify-center h-80">
  <div aria-label="Loading Questions..." role="status" className="flex items-center space-x-2">
    <svg className="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
      <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
    </svg>
    <span className="text-3xl font-medium text-black">Loading Questions...</span>
  </div>
</div>



  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-8 px-8 sm:px-36">
      {/* Timer */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="text-lg font-semibold text-red-600">
          Time Left: {formatTime(timeLeft)}
        </div>
        
        <div className="flex flex-wrap justify-between">
        <span className="flex items-center mx-4">
  <div className="w-3 h-3 rounded-full bg-red-700"></div>
  <p className="ml-2">Active</p>
</span>  
        <span className="flex items-center mx-4">
  <div className="w-3 h-3 rounded-full bg-green-500"></div>
  <p className="ml-2">Answered</p>
</span>
<span className="flex items-center mx-4">
  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
  <p className="ml-2">Mark for Review</p>
</span>
<span className="flex items-center mx-4">
  <div className="w-3 h-3 rounded-full bg-gray-800"></div>
  <p className="ml-2">Unanswered</p>
</span>   
        </div> 
      </div>

      {/* Questions Section */}
      <div className="flex flex-col sm:flex-row gap-8 h-full">
      
        <div className="w-full sm:w-8/12">
        <div className="border-2 pt-8 pb-8 px-6 rounded">
          {currentQuestion && (
            <div className="mb-4">
            {currentQuestion.para &&<p className="mb-2"><span className="font-bold">Paragraph - </span>{currentQuestion.para}</p>}
              <h2 className="text-lg font-bold mb-2">
                {currentQuestionIndex + 1}. {currentQuestion.questionText}
              </h2>
              {currentQuestion.image &&   <img src={currentQuestion.image} alt="Fetched from backend" className="w-64 h-auto" />}
              <div className="mt-4">
              {currentQuestion.type.toLowerCase() !=="tita" && (
  Object.entries(currentQuestion.options).map(([key, value]) => (
    <div key={key} className="mb-2">
      <label>
        <input
          type="radio"
          name={`question-${currentQuestion.questionId}`}
          value={key}
          checked={answers[currentQuestion.questionId] === key}
          onChange={() =>
            setAnswers({ ...answers, [currentQuestion.questionId]: key })
          }
          disabled={isTimerExpired}
        />
        <span className="ml-2">{value}</span>
      </label>
    </div>
  ))
)}
                {currentQuestion.type.toLowerCase() === 'tita' && (
  <textarea
    name={`question-${currentQuestion.questionId}`}
    className="w-full mt-2 border border-gray-300 rounded px-3 py-2"
    rows={4}
    value={answers[currentQuestion.questionId] || ""}
    onChange={(e) =>
      setAnswers({
        ...answers,
        [currentQuestion.questionId]: e.target.value,
      })
    }
    disabled={isTimerExpired}
  />
)}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0 || isTimerExpired} // Disable if timer expired
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-white border border-gray-800 text-black rounded"
              onClick={() => {
                const updatedAnswers = { ...answers };
                delete updatedAnswers[currentQuestion.questionId]; // Remove the answer for the current question
                setAnswers(updatedAnswers); // Update the state with the modified answers
              }}
            >
              Clear Response
            </button>
            <button
              className={`px-4 py-2 ${
                markedForReview.includes(currentQuestion?.questionId)
                  ? "bg-purple-500"
                  : "bg-red-500"
              } text-white rounded`}
              onClick={() =>
                setMarkedForReview((prevMarkedForReview) =>
                  prevMarkedForReview.includes(currentQuestion.questionId)
                    ? prevMarkedForReview.filter((id) => id !== currentQuestion.questionId)
                    : [...prevMarkedForReview, currentQuestion.questionId]
                )
              }
              disabled={isTimerExpired} // Disable if timer expired
            >
              {markedForReview.includes(currentQuestion?.questionId)
                ? "Unmark for Review"
                : "Mark for Review"}
            </button>
            {currentQuestionIndex === questions.length - 1 ? <button
              className="px-4 py-2 bg-red-800 text-white rounded"
              onClick={handleSubmit}
    // Disable if timer expired
            >
             {subloading? "Submitting..." : "Submit Exam"} 
            </button> : <button
              className="px-4 py-2 bg-blue-800 text-white rounded"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            // Disable if timer expired
            >
              Next 
            </button>}
          </div>
        </div>
        </div>
       
        <div className="flex flex-wrap gap-2 mb-4 w-full sm:w-4/12 flex-wrap border p-8 bg-gray-100 rounded-xl">
        
  {questions.map((_, index) => {
    let circleColor = "bg-gray-800";
    if (index === currentQuestionIndex) circleColor = "bg-red-700";
    else if (answers[questions[index].questionId]) circleColor = "bg-green-500";
    else if (markedForReview.includes(questions[index].questionId)) circleColor = "bg-purple-500";

    return (
      <div
        key={index}
        className={`w-5 h-6 p-1 sm:w-10 sm:h-8 rounded-full flex items-center text-white justify-center ${circleColor} cursor-pointer`}
        onClick={() => setCurrentQuestionIndex(index)}
        style={{ flex: "0 0 calc(12% - 0.4rem)" }} // Ensures 5 circles fit in one row
      >
        {index + 1}
      </div>
    );
  })}
</div>
      </div>

      {/* Popup for Timer Expiry */}
      {isTimerExpired && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Time's Up!</h2>
            <p className="mb-4">Submit your answers now.</p>
            <button
              className="px-6 py-3 bg-green-500 text-white text-lg rounded"
              onClick={handleSubmit}
            >
              Submit Answers
            </button>
          </div>
        </div>
      )}
      {submission && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white w-80 p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">Mock Test Submitted</h2>
            <p className="mb-4 text-sm">Check Your Result Now</p>
            <Link
              className="px-6 py-3 mt-4 bg-green-500 text-white text-lg rounded w-full"
              href={`/exam-results?exam=${mockId}`}
            >
              See Result
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
