import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UsersDetails from "@/components/UsersDetails";

export default async function UsersPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/login");
    }
  
    // Only allow teachers to access the page
    if (session.user.role !== "admin") {
      redirect("/");
    }

 return (
    <UsersDetails />
 )
}    