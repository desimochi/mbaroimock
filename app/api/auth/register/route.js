import clientPromise from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  const { email, password, name, mobile } = await req.json();
  const role = "student";
  const created_at = new Date();
  const updatedAt = new Date();

  if (!email || !password || password.trim().length < 6) {
    return new Response(JSON.stringify({ message: "Invalid input." }), {
      status: 422,
    });
  }

  const client = await clientPromise;
  const db = client.db("sample_mflix");
  const usersCollection = db.collection("users");

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists." }), {
      status: 422,
    });
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Insert the new user
  await usersCollection.insertOne({
    email,
    password: hashedPassword,
    name,
    mobile,
    role,
    created_at,
    updatedAt,
  });

  return new Response(JSON.stringify({ message: "User created successfully!", email, password }), {
    status: 201,
  });
}
