import clientPromise from "@/lib/mongodb";

export async function GET(req) {

  try {
    const client = await clientPromise;
    const db = client.db('sample_mflix');
      const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;
 const users = await db.collection('users').aggregate([
  // Convert users._id to string for joining with response.userId (string)
  {
    $addFields: {
      userIdStr: { $toString: "$_id" }
    }
  },
  // Lookup responses for each user by matching userId string
  {
    $lookup: {
      from: "response",
      localField: "userIdStr",
      foreignField: "userId",
      as: "responses"
    }
  },
  // Unwind responses for joining mock info
  {
    $unwind: {
      path: "$responses",
      preserveNullAndEmptyArrays: true
    }
  },
  // Convert responses.mock (string) to ObjectId for joining mock collection
  {
    $addFields: {
      "responses.mockObjectId": { $toObjectId: "$responses.mock" }
    }
  },
  // Lookup mock details from mock collection for each response.mockObjectId
  {
    $lookup: {
      from: "mock",
      localField: "responses.mockObjectId",
      foreignField: "_id",
      as: "responses.mockDetails"
    }
  },
  // Unwind mockDetails array to get a single mock object per response
  {
    $unwind: {
      path: "$responses.mockDetails",
      preserveNullAndEmptyArrays: true
    }
  },
  // Group back the responses per user with mock details nested
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      email: { $first: "$email" },
      mobile: { $first: "$mobile" },
      created_at: { $first: "$created_at" },
      responses: { $push: "$responses" }
    }
  },
  // Add field: examCount as the number of responses (attempts)
  {
    $addFields: {
      examCount: { $size: "$responses" }
    }
  },
  // Add field: mockNames array — extract exam names from nested responses.mockDetails.examName
  {
    $addFields: {
      mockNames: {
        $filter: {
          input: {
            $map: {
              input: "$responses",
              as: "resp",
              in: "$$resp.mockDetails.examName"
            }
          },
          as: "name",
          cond: { $ne: ["$$name", null] }
        }
      }
    }
  },
  {
    $addFields: {
      mockNames: { $setUnion: "$mockNames" }
    }
  },
  // Sort users by descending _id
  {
    $sort: { _id: -1 }
  },
  // Project only fields you want to send back
  {
    $project: {
      responses: 0 // optionally hide detailed responses
    }
  },
  { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
]).toArray();

  const totalCount = await db.collection("users").countDocuments();
    
    return new Response(JSON.stringify({ users, totalCount, page, limit }), {
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
