import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { signOut } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function TeacherProfile({ params }) {
  // Ensure params are awaited before using them
  const { username } = await params; // Await the params object
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  const session = await getServerSession(authOptions); // Fetch session
  const userId = new ObjectId(username);
  // If not authenticated, redirect to login page
  if (!session) {
    redirect("/login");
  }

  // Check if the user role is "teacher" and the username matches
  if (
    session.user.role !== "teacher" 
  ) {
    redirect("/unauthorized");
  }
  const teacher = await db.collection("users").findOne({ _id: userId });
  const mocks = await db.collection("mock").find({ userId: teacher._id.toString() }).toArray();

  return (
    <>
  <div className="container mx-auto h-screen">
  <div className="flex justify-between items-center py-4 px-8 shadow-sm gap-4">
  <div className=" bg-red-900 rounded mb-8 w-1/4">
  <div className="w-full bg-white border border-gray-200 rounded shadow dark:bg-gray-800 dark:border-gray-700">
  <div className="flex justify-end px-2 pt-8">
  </div>
  <div className="flex flex-col items-center pb-10">
    <Image src ="/avtar,png.webp" alt= "avtar"  height={100} width={100} />
    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
      {teacher.name}
    </h5>
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {teacher.email}
    </span>
    <span className="text-sm text-black dark:text-gray-400">
      Mock Created - {mocks.length}
    </span>
    <div className="flex mt-4 md:mt-6 gap-4">
      <LogoutButton/>
      <Link href='/exam-select'><button className="text-white bg-gray-900 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Mock</button></Link>
    </div>
  </div>
</div>

  </div>
  <div className="rounded mb-8 w-3/4">
  {mocks.length > 0 ? (
        <ul className="list-disc ml-6">
          {mocks.map((mock) => (
            
            <div className="w-full mx-auto bg-white shadow-lg rounded-lg mb-2" key={mock._id}>
            <div className="px-6 py-5">
              <div className="flex items-start">
                {/* Icon */}
                <svg className="fill-current flex-shrink-0 mr-5" width="30" height="30" viewBox="0 0 30 30">
                  <path className="text-red-300" d="m16 14.883 14-7L14.447.106a1 1 0 0 0-.895 0L0 6.883l16 8Z" />
                  <path className="text-red-200" d="M16 14.619v15l13.447-6.724A.998.998 0 0 0 30 22V7.619l-14 7Z" />
                  <path className="text-red-500" d="m16 14.619-16-8V21c0 .379.214.725.553.895L16 29.619v-15Z" />
                </svg>
        
                {/* Card content */}
                <div className="flex-grow truncate">
                  {/* Card header */}
                  <div className="w-full sm:flex justify-between items-center mb-1">
                    {/* Title */}
                    <h2 className="text-xl leading-snug font-bold text-black truncate mb-1 sm:mb-0">
                      {mock.examName}
                    </h2>
                    
                    {/* Like and comment buttons */}
                    <Link href={`/upload-questions/?exam=${mock.examName}`} ><button className="bg-red-700 text-white  hover:bg-red-800 hover:text-white font-semibold py-2 px-4 rounded">
                      Upload Question
                    </button></Link>
                  </div>
        
                  {/* Card body */}
                  <div className="flex items-end justify-between whitespace-normal">
                    {/* Paragraph */}
                    <div className="max-w-md text-gray-900">
                      <p className="mb-2">
                        {new Date(
                          mock.createdAt.$date ? mock.createdAt.$date.$numberLong : mock.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                    {/* More link */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))}
        </ul>
      ) : (
        <p>No mocks associated with this teacher.</p>
      )}
      </div>
  </div>
  </div>
  
 </>
  );
}
