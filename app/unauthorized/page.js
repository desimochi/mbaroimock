import Link from "next/link";

export default function Page(){
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
        <div className="max-w-md">
          
          <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
          <p className="text-gray-700 mb-6">
            You don’t have permission to view this page. Please login or contact the administrator if you think this is a mistake.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
}