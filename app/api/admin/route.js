import clientPromise from "@/lib/mongodb";

export async function GET() {

  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    
    const users = await db.collection('users').find().sort({ _id: -1 }).toArray();
    
    return new Response(JSON.stringify(users), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  } catch (err) {
    console.error("Error fetching users", err);
    return new Response(
        JSON.stringify({ message: "Failed to fetch mock test details" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        } )
  }
}
