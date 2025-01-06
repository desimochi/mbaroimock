import Image from "next/image";

export default function Features() {
  return (
    <div className="container mx-auto bg-white mt-8">
      <h2 className="text-black mb-8 text-center text-3xl sm:text-2xl lg:text-5xl font-normal leading-tight">Why MBAROI Mocks?</h2>
      <hr class="border-red-700 w-1/2 mx-auto mb-12 border-t-2" />
      <div className="flex flex-col md:flex-row md:justify-between gap-6 p-2">
        {/* Card 1 */}
        <div className="bg-white border p-8 border-gray-300 rounded-xl shadow-md mb-8 md:mb-6 w-full sm:w-7/12">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            Detailed and Updated Mocks
          </h3>
          <p className="text-gray-600 mb-4">
            Start recording with a simple voice command. No need to fumble for
            your phone - perfect for lectures, meetings, or brainstorming
            sessions.
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
            Stundents from Everywhere
          </h3>
          <p className="text-gray-600 mb-4">
            Start recording with a simple voice command. No need to fumble for
            your phone - perfect for lectures, meetings, or brainstorming
            sessions.
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
            Organised Mocks and Results
          </h3>
          <p className="text-gray-600 mb-4">
            Start recording with a simple voice command. No need to fumble for
            your phone - perfect for lectures, meetings, or brainstorming
            sessions.
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
            Start recording with a simple voice command. No need to fumble for
            your phone - perfect for lectures, meetings, or brainstorming
            sessions.
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
