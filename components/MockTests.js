'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const MockTests = () => {
  const { data: session } = useSession();
  const [mocks, setMocks] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMocks = async () => {
      try {
        const response = await fetch("/api/fetchmocks");
        if (!response.ok) throw new Error("Failed to fetch mock test details");
        const data = await response.json();

        // Group mocks
        const segregated = data.reduce((acc, item) => {
          const match = item.examName.match(/^(CAT|MAT|CMAT)/i);
          const key = match ? match[1].toUpperCase() : "Other";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        // Ordered categories
        const order = ["CAT", "MAT", "CMAT"];
        const ordered = {};

        order.forEach(key => {
          if (segregated[key]) ordered[key] = segregated[key];
        });

        Object.keys(segregated).forEach(key => {
          if (!order.includes(key)) ordered[key] = segregated[key];
        });

        setMocks(ordered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMocks();
  }, []);

  const getDuration = (examName) => (/cmat/i.test(examName) ? 180 : 120);

  // ROW COMPONENT
  const ScrollableRow = ({ title, mocksData }) => {
    const scrollRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const checkScroll = () => {
      const el = scrollRef.current;
      if (!el) return;

      setShowLeft(el.scrollLeft > 0);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const scroll = (direction) => {
      scrollRef.current?.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    };

    useEffect(() => {
      checkScroll();
    }, [mocksData]);

    return (
      <div className="mb-10 max-w-7xl mx-auto">

        <h2 className="text-2xl font-extrabold text-zinc-950 mb-4 px-12">{title} Mock Exam Series</h2>

        <div className="relative group">

          {/* LEFT CLICK BUTTON ONLY */}
          {showLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-0 bottom-0 z-10 w-12 
              bg-gradient-to-r from-white/80 to-transparent
              flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-8 h-8 text-black" />
            </button>
          )}

          {/* SCROLL AREA */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-3 px-12 pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mocksData.map((mock) => {
              const duration = getDuration(mock.examName);

              return (
                <div key={mock._id} className="group flex-none w-80 relative border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">

  {/* TOP-LEFT MBAROI LABEL */}
 

  {/* NO TRANSFORMS, NO SCALE */}
  <div className="
    bg-gradient-to-br from-gray-50 to-gray-40
    rounded-lg overflow-hidden
    transition-colors duration-300
    hover:bg-white
  ">

    {/* HEADER WITH ICON + NAME */}
    <div className="h-40 bg-white flex flex-col items-center justify-center relative border-b">
       <div className="absolute top-2 left-2 border border-gray-300 text-red-800 text-[10px] font-bold px-2 py-[2px] rounded">
    <span className="text-[#5a037c]">MBA</span>R.O.I
  </div>
      {/* ICON (Use your mock.icon or replace with BookOpen) */}
      <div className="w-14 h-14 flex items-center justify-center bg-violet-100 rounded-full shadow-inner mb-2">
        <BookOpen className="w-7 h-7 text-violet-700" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 px-4 text-center">
        {mock.examName}
      </h3>
    </div>

    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-800 text-sm mb-3">
        <Clock className="w-4 h-4" />
        <span>{duration} mins</span>
        <span className="mx-2">•</span>
        <span>{mock.limit} Questions</span>
      </div>

      {mock.description && (
        <p className="text-gray-700 text-xs mb-3 line-clamp-2">
          {mock.description}
        </p>
      )}

      <div className="space-y-1 mb-3">
        <p className="text-xs text-gray-800">✔ Updated Syllabus</p>
        <p className="text-xs text-gray-800">✔ Exam Pattern</p>
        <p className="text-xs text-gray-800">✔ Unlimited Attempts</p>
      </div>

      {session ? (
        <Link href={`/exam?mock=${mock._id}`}>
          <button className="w-full bg-violet-700 text-white py-2 rounded-full font-semibold">
            Start Test
          </button>
        </Link>
      ) : (
        <Link href="/login">
          <button className="w-full bg-violet-700 text-white py-2 rounded-full font-semibold">
            Login to Attempt
          </button>
        </Link>
      )}
    </div>

  </div>
</div>

              );
            })}
          </div>

          {/* RIGHT CLICK BUTTON ONLY */}
          {showRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 bottom-0 z-10 w-12 
              bg-gradient-to-l from-white/80 to-transparent 
              flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-8 h-8 text-black" />
            </button>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen  py-12 ">

      <div className="mb-8 px-12 text-center">
        <h1 className="text-4xl font-extrabold text-zinc-950 mb-2">MBA Mock Exam Series</h1>
        <p className="text-gray-600 text-lg">Practice with comprehensive mock exams</p>
      </div>

      {Object.entries(mocks).map(([examType, mocksInGroup]) =>
        <ScrollableRow key={examType} title={examType} mocksData={mocksInGroup} />
      )}

    </div>
  );
};

export default MockTests;
