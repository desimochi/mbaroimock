import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://mbaroifront.vercel.app"
  ];

  const origin = req.headers.get("origin");
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "https://mbaroifront.vercel.app", 
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle CORS preflight (OPTIONS request)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const users = await db.collection("users").aggregate([
      { $addFields: { userIdStr: { $toString: "$_id" } } },
      {
        $lookup: {
          from: "response",
          localField: "userIdStr",
          foreignField: "userId",
          as: "responses",
        },
      },
      { $unwind: { path: "$responses", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          "responses.mockObjectId": { $toObjectId: "$responses.mock" },
        },
      },
      {
        $lookup: {
          from: "mock",
          localField: "responses.mockObjectId",
          foreignField: "_id",
          as: "responses.mockDetails",
        },
      },
      { $unwind: { path: "$responses.mockDetails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          mobile: { $first: "$mobile" },
          created_at: { $first: "$created_at" },
          responses: { $push: "$responses" },
        },
      },
      { $addFields: { examCount: { $size: "$responses" } } },
      {
        $addFields: {
          mockNames: {
            $filter: {
              input: {
                $map: {
                  input: "$responses",
                  as: "resp",
                  in: "$$resp.mockDetails.examName",
                },
              },
              as: "name",
              cond: { $ne: ["$$name", null] },
            },
          },
        },
      },
      { $addFields: { mockNames: { $setUnion: "$mockNames" } } },
      { $sort: { _id: -1 } },
      { $project: { responses: 0 } },
      { $skip: skip },
      { $limit: limit },
    ]).toArray();

    const totalCount = await db.collection("users").countDocuments();

    return new Response(
      JSON.stringify({ users, totalCount, page, limit }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error fetching users", err);
    return new Response(
      JSON.stringify({ message: "Failed to fetch mock test details" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
