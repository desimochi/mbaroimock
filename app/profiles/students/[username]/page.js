import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export async function generateMetadata({ params }) {
  const { username } = await params;

  if (!ObjectId.isValid(username)) {
    return {
      title: "Invalid User",
      description: "The user ID provided is invalid.",
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const userId = new ObjectId(username);
    const student = await db.collection("users").findOne({ _id: userId });

    if (!student) {
      return {
        title: "User Not Found",
        description: "No user found with the provided ID.",
      };
    }

    return {
      title: `${student.name}'s Profile - Exam History`,
      description: `View the exam history and performance of ${student.name}. See the number of exams taken and access detailed results.`,
      openGraph: {
        title: `${student.name}'s Profile - Exam History`,
        description: `View the exam history and performance of ${student.name}. See the number of exams taken and access detailed results.`,
        url: `https://mock.mbaroi.in/profile/${username}`,
        images: [
          {
            url: "/default-meta-image.png",
            width: 1200,
            height: 630,
            alt: "Default Meta Image",
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading the user profile.",
    };
  }
}



export default async function StudentProfile({ params }) {
  const { username } = await params;

  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");


    

    // Convert username to ObjectId
    const userId = new ObjectId(username);

    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/login");
    }

    // Fetch the student details
    const student = await db.collection("users").findOne({ _id: userId });
    if (!student) {
      return (
        <div>
          <h1>User not found</h1>
        </div>
      );
    }

    const response = await db.collection("response").find({ userId: student._id.toString() }).toArray();
    const mockIds = response.map((item) => item.mock);
    const mocks = await db.collection("mock").find({ _id: { $in: mockIds.map((id) => new ObjectId(id)) } }).toArray();

    const pageTitle = `${student.name}'s Profile - Exam History`;
    const pageDescription = `View the exam history and performance of ${student.name}. See the number of exams taken and access detailed results.`;
    return (
      <>
      <div className="container mx-auto h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 px-8 shadow-sm gap-4">
          <div className="bg-red-900 rounded mb-8 w-full sm:w-1/4">
            <div className="w-full bg-white border border-gray-200 rounded shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-end px-2 pt-8"></div>
              <div className="flex flex-col items-center pb-10">
                <Image src="/avtar,png.webp" alt="avatar" height={100} width={100} />
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{student.name}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">{student.email}</span>
                <span className="text-sm text-black dark:text-gray-400">Exam Given - {response.length}</span>
                <div className="flex mt-4 md:mt-6 gap-4">
                  <Link href='/update-profile'>
                <button className="text-gray-900 bg-white border border-gray-800 hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Update Profile</button>
              </Link>
                  <Link href="/mocks">
                    <button className="text-white bg-gray-900 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-8 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Give Mock
                    </button>
                  </Link>
                </div>
                <LogoutButton />
              
              </div>
            </div>
           
          </div>

          <div className="rounded mb-8 w-full sm:w-3/4">
            {mocks.length > 0 ? (
              <ul className="list-disc ml-6">
                {mocks.map((mock) => (
                  <div className="w-full sm:mx-auto bg-white border shadow-lg rounded-lg mb-2" key={mock._id}>
                    <div className="px-6 sm:px-6 py-5">
                      <div className="flex items-start">
                        <div className="flex-grow truncate">
                          <div className="w-full sm:flex justify-between items-center mb-1">
                            <h2 className="text-xl leading-snug font-bold text-black truncate mb-1 sm:mb-0">{mock.examName}</h2>
                            <Link href={`/exam-results?exam=${mock._id}`}>
                              <button className="bg-red-800 hover:bg-red-700 rounded-sm text-white px-4 py-2">See Result</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No mocks associated with this student.</p>
            )}
          </div>
        </div>
      </div>
      </>
    );
  } catch (error) {
    console.error("Error in StudentProfile:", error);
    return (
      <div>
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}
