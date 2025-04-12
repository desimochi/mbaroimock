import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const exam = url.searchParams.get("exam");

    if (!exam) {
      return new Response(JSON.stringify({ message: "Missing 'exam' query parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const examData = await db
      .collection("mock")
      .findOne({ examName: exam }, { projection: { uploadedquestion: 1, limit: 1, _id: 0 } });

    if (!examData) {
      return new Response(JSON.stringify({ message: "Exam not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(examData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching exam details:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch exam details" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
