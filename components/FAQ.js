"use client"
import { useState } from 'react';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    { question: "What is included in the MBA mock tests provided by the platform?", answer: "Our MBA mock tests include a variety of sections such as Quantitative Aptitude, Verbal Ability, Logical Reasoning, and Data Interpretation, designed to simulate the actual MBA entrance exams. They also feature detailed solutions and performance analytics to help you understand your strengths and weaknesses." },
    { question: "How can I access the mock tests after purchasing them?", answer: "Once you purchase a mock test package, it will be available in your account dashboard under the 'My Tests' section. You can access the tests anytime during the subscription period." },
    { question: "Are the mock tests updated to match the latest MBA entrance exam patterns?", answer: "Yes, our mock tests are regularly updated to align with the latest exam patterns and syllabus of popular MBA entrance exams like CAT, XAT, SNAP, and NMAT, ensuring you are well-prepared." },
    {
      question: "Can I get a detailed analysis of my performance in the mock tests?",
      answer: "Absolutely! After completing a mock test, you will receive a detailed performance analysis that includes section-wise scores, time management insights, and suggestions for improvement.",
    },
  ];

  return (
    <div className="flex flex-col items-center p-6">
    {/* Header Section */}
    <div className="text-center mb-8">
      <h3 className="text-5xl font-normal mb-2 leading-[1.15]">Frequently Asked<br/> Questions.</h3>
      <p className="text-gray-600 max-w-lg mx-auto">
        If you're new to Genie or looking to supercharge your current stack, this section will help you
        learn more about the platform and its features.
      </p>
    </div>

    {/* FAQ Items */}
    <div className="w-full max-w-6xl space-y-4">
      {faqItems.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg shadow-sm transition-all"
        >
          {/* Question */}
          <button
            onClick={() => toggle(index)}
            className="w-full text-left px-4 py-4 flex justify-between items-center text-lg font-medium"
          >
            <span>{item.question}</span>
            <span className="text-gray-500 text-2xl">
              {activeIndex === index ? '−' : '+'}
            </span>
          </button>

          {/* Answer */}
          {activeIndex === index && (
            <div className="px-4 py-3 bg-gray-50 text-gray-600">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );
}
