import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { name, password } = body;

    if (!name && !password) {
      return new Response(JSON.stringify({ error: "Nothing to update" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const updates = {};
    if (name) updates.name = name;
    if (password) updates.password = await hash(password, 10);

    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: updates }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "No updates were applied" }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
