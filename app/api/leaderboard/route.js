import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const mock = url.searchParams.get("mock");

    if (!mock) {
      return new Response(
        JSON.stringify({ message: "Invalid request: 'mock' query parameter is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    // Fetch rankings for the specified mock
    const ranking = await db.collection("ranking").find({ mock }).toArray();

    // Get the user IDs from the ranking data
    const userIds = ranking.map((item) => item.userId);

    // Fetch user details for these user IDs
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
      .toArray();

    // Map user IDs to names
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.name || "Unknown";
      return acc;
    }, {});

    // Sort rankings by marks and assign ranks
    let currentRank = 1;
    const rankedData = ranking
      .sort((a, b) => b.marksreceieved - a.marksreceieved)
      .map((item, index) => {
        const name = userMap[item.userId] || "Unknown";
        if (
          index > 0 &&
          item.marksreceieved === ranking[index - 1].marksreceieved
        ) {
          return { ...item, rank: currentRank, name };
        } else {
          currentRank = index + 1;
          return { ...item, rank: currentRank, name };
        }
      });

    return new Response(
      JSON.stringify({ message: "Success", data: rankedData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
