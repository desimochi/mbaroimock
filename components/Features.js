import Image from "next/image";

export default function Features() {
  return (
    <div className="container mx-auto bg-white mt-8">
      <h2 className="text-black mb-8 text-center text-3xl sm:text-2xl lg:text-5xl font-normal leading-tight">Why MBAROI Mocks?</h2>
      <hr class="border-violet-700 w-1/2 mx-auto mb-12 border-t-2" />
      <div className="flex flex-col md:flex-row md:justify-between gap-6 p-2">
        {/* Card 1 */}
        <div className="bg-white border p-8 border-gray-300 rounded-xl shadow-md mb-8 md:mb-6 w-full sm:w-7/12">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            Detailed and Updated Mocks
          </h3>
          <p className="text-gray-600 mb-4">
          Our mocks are meticulously designed and regularly updated to align with the latest exam patterns, ensuring students are well-prepared for real-time challenges.
          </p>
          <div className="relative w-full flex justify-center">
            <Image
              src="/benifit-mbaroimock.jpg" // Replace with your image path
              alt="Voice Capture"
              height={300}
              width={600}
            />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border p-8 border-gray-300 rounded-xl shadow-md mb-8 md:mb-6 w-full sm:w-5/12">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            Students from Everywhere
          </h3>
          <p className="text-gray-600 mb-4">
          Accessible to students globally, our platform provides a seamless experience, connecting learners from diverse regions to a unified, high-quality mock test environment.
          </p>
          <div className="relative w-full flex justify-center">
            <Image
              src="/global.jpg" // Replace with your image path
              alt="Voice Capture"
              height={300}
              width={400}
            />
          </div>
        </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-6 p-2">
        <div className="bg-white border p-8 border-gray-300 rounded-xl shadow-md mb-8 md:mb-6 w-full sm:w-5/12">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
          Organized Mocks and Results
          </h3>
          <p className="text-gray-600 mb-4">
          Enjoy structured mock tests with clear timelines and swift, precise results, ensuring an efficient and hassle-free preparation process.
          </p>
          <div className="relative w-full flex justify-center">
            <Image
              src="/organised.jpg" // Replace with your image path
              alt="Voice Capture"
              height={300}
              width={400}
            />
          </div>
        </div> 
        <div className="bg-white border border-gray-300 p-8 rounded-xl shadow-md mb-8 md:mb-6 w-full sm:w-7/12">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            Detailed Analysis of Performance
          </h3>
          <p className="text-gray-600 mb-4">
          Gain valuable insights with a comprehensive performance analysis, highlighting your strengths and areas for improvement to enhance your preparation strategy.
          </p>
          <div className="relative w-full flex justify-center">
            <Image
              src="/analysis.jpg" // Replace with your image path
              alt="Voice Capture"
              height={300}
              width={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
