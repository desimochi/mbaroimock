import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UploadQuestionForm from "@/components/UploadQuestionForm"; // Import the client component

export default async function QuestionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  if (
    session.user.role !== "teacher" 
  ) {
    redirect("/unauthorized");
  }

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <UploadQuestionForm />
    </div>
  );
}
