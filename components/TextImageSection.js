"use client"
import { useSession,signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
export default function TextImageSection() {
  const { data: session } = useSession();
    return (
        <>
          <div className="bg-white min-h-fit">
      <div className="max-w-7xl mt-16 sm:mt-24 mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-2xl lg:text-5xl font-normal leading-tight">
            Take <span className="text-red-600 underline">MBAROI Mocks</span>{' '}
            and <br /> score big in MBA exam
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 p-4">
          {!session? <Link href='/register'><button className="bg-red-700 text-white px-6 py-3 w-full rounded-full text-lg">
            Register
          </button></Link> : <Link href={`/profiles/students/${session.user.id}`}><button className="bg-red-700 text-white px-6 py-3 w-full rounded-full text-lg">
            See Profile
          </button></Link> }
          <Link href='/mocks'><button className="border-2 border-red-700 w-full hover:bg-red-700 hover:text-white px-6 py-3 rounded-full text-lg">
            Explore Mocks
          </button></Link>
        </div>

        {/* Learners and Levels */}
        <div className="flex flex-col sm:flex-row justify-around items-center mt-16 gap-8">
          {/* Learners */}
          <div className="w-full sm:w-1/4 p-4">
          <div className="text-center">
            <div className="flex justify-center -space-x-4 mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="/avtar,png.webp"
                  alt="Avatar 1"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="/avtar3.webp"
                  alt="Avatar 2"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="/avtar2.webp"
                  alt="Avatar 3"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="/avtar3.avif"
                  alt="Avatar 4"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">6k+ Enrolled Students</p>
          </div>

          {/* Levels */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { level: 'A1', label: 'Latest Mocks' },
              { level: 'A2', label: 'Updated Syllabus' },
              { level: 'B1', label: 'Solutions' },
              { level: 'B2', label: 'Analysis' },
              { level: 'C1', label: 'Weekly Mocks' },
              { level: 'C2', label: 'Performace Review', isActive: true },
            ].map(({ level, label, isActive }) => (
              <div
                key={level}
                className={`flex items-center justify-center p-4 border rounded-md ${
                  isActive ? 'bg-red-600 text-white' : 'bg-gray-100'
                }`}
              >
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
          </div>
          <div className="w-full sm:w-2/4">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/student.jpg"
              alt="Teacher"
              width={600}
              height={400}
            />
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
              Online
            </div>
          </div>
          </div>
          <div className="w-full sm:w-1/4 p-4">
          <div className="w-full bg-yellow-100 p-6 rounded-lg">
            <h3 className="text-gray-600 text-lg font-medium">
              Give Mock and Analysis of Your Performace
            </h3>
            <p className="mt-2 text-4xl font-bold">342</p>
            <p className="text-sm text-gray-500">Makrs Scored in the Last Attempt Mock</p>
            <div className="flex justify-between mt-4">
              {[
                { day: 'QA', height: 'h-10' },
                { day: 'LR', height: 'h-16' },
                { day: 'GA', height: 'h-14' },
                { day: 'DI', height: 'h-20 bg-red-600' },
                { day: 'RC', height: 'h-12' },
                { day: 'LC', height: 'h-8' },
                { day: 'Inn', height: 'h-12' },
              ].map(({ day, height }) => (
                <div key={day} className="flex flex-col items-center">
                  <div
                    className={`w-6 ${height} bg-red-300 rounded-md`}
                  ></div>
                  <p className="text-sm text-gray-600">{day}</p>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
      </>
    );
  }
  