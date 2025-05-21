import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized: Please log in" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { mock, answers } = await req.json();

    if (!mock || !answers || typeof answers !== "object") {
      return new Response(
        JSON.stringify({ message: "Invalid request: Missing or invalid data." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = session.user.id; // Get user ID from session
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const results = [];
    let marksreceieved = 0
    // Check if a response already exists for this userId and mock
    const existingResponse = await db.collection("response").findOne({ userId, mock });
    const existingResult = await db.collection("results").findOne({ userId, mock });
    const existingRanking = await db.collection("ranking").findOne({userId, mock})

    // Fetch mock data
    const mockData = await db.collection('mock').findOne({ _id: new ObjectId(mock) });
    if (!mockData) {
      return new Response(
        JSON.stringify({ message: "Mock data not found." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const mockName = mockData.examName.toLowerCase();

    // Determine collection names and marks based on mockName
    let collection;
    let options;
    let marks;
    let negativemarks;
    if (mockName.includes("xat")) {
      collection = 'xatquestions';
      options = 'xatoptions';
      marks = 1;
      negativemarks = 0.25;
    } else if (mockName.includes("cat")) {
      collection = "catquestions";
      options = "catoptions";
      marks = 3;
      negativemarks = 1;
    } else if (mockName.includes("cmat")) {
      collection = "cmatquestions";
      options = "cmatoptions";
      marks = 4;
      negativemarks = 1;
    } else if (mockName.includes("mat")) {
      collection = "matquestions";
      options = "matoptions";
      marks = 1;
      negativemarks = 0.25;
    } else if (mockName.includes("gmat")) {
      collection = "gmatquestions";
      options = "gmatoptions";
      marks = 1;
      negativemarks = 0;
    } else {
      return new Response(
        JSON.stringify({ message: "Invalid mock name." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get all question IDs from the answers
    const questionIdsArray = Object.keys(answers).map((id) => new ObjectId(id));

    // Fetch all questions in a single query
    const questionsArray = await db
      .collection(collection)
      .find({ _id: { $in: questionIdsArray } })
      .toArray();

    // Create a map of questions for quick access
    const questionMap = {};
    questionsArray.forEach((question) => {
      questionMap[question._id.toString()] = question;
    });

    // Fetch all correct options in a single query
    const optionsArray = await db
      .collection(options)
      .find({ questionId: { $in: questionIdsArray } })
      .toArray();

    // Create a map of correct options for quick access
    const optionMap = {};
    optionsArray.forEach((option) => {
      optionMap[option.questionId.toString()] = option;
    });

    // Process each answer
    for (const questionIdStr in answers) {
      const userAnswer = answers[questionIdStr];
      const questionId = questionIdStr;
    
      const question = questionMap[questionId];
      const correctOption = optionMap[questionId]; // might be undefined for TITA
    
      if (question) {
        let isCorrect = false;
        let markAwarded = 0;
        const isTita = question.type === "tita";
    
        if (userAnswer === '') {
          // Unanswered question
          isCorrect = '';
          markAwarded = 0;
        } else if (isTita) {
          // --- TITA Answer Checking ---
          const correctAnswer = question.solution?.toString().trim().toLowerCase(); // store this in DB
          const submittedAnswer = userAnswer?.toString().trim().toLowerCase();
    
          if (correctAnswer === submittedAnswer) {
            isCorrect = true;
            markAwarded = marks;
            marksreceieved += marks;
          } else {
            isCorrect = false;
            markAwarded = negativemarks;
            marksreceieved -= negativemarks;
          }
        } else if (correctOption && correctOption.answer === userAnswer) {
          // --- MCQ Correct ---
          isCorrect = true;
          markAwarded = marks;
          marksreceieved += marks;
        } else {
          // --- MCQ Incorrect ---
          isCorrect = false;
          markAwarded = negativemarks;
          marksreceieved -= negativemarks;
        }
    
        results.push({
          questionId: questionIdStr,
          questionText: question.question,
          subject: question.subject,
          topics: question.topic,
          solution: question.solution,
          userAnswer,
          correctAnswer: isTita ? question.answer : correctOption?.answer,
          correct: isCorrect,
          mark: markAwarded,
        });
      } else {
        results.push({
          questionId: questionIdStr,
          message: "Question or correct answer not found.",
        });
      }
    }
    

    const resultDoc = {
      userId,
      mock,
      results,
      submittedAt: new Date(),
    };

    // Update or insert the results
    if (existingResult) {
      const updateResults = await db.collection("results").updateOne(
        { userId, mock },
        {
          $set: {
            results,
            submittedAt: new Date(),
          },
        }
      );

      if (updateResults.modifiedCount > 0) {
        console.log("Results updated successfully.");
      } else {
        console.error("Failed to update results. Check the query or document structure.");
      }
    } else {
      const insertResult = await db.collection("results").insertOne(resultDoc);
      console.log("Result submitted successfully with ID:", insertResult.insertedId);
    }
    const RankingDoc = {
      userId,
      mock,
      marksreceieved
    }
    if (existingRanking) {
      const updateRanking = await db.collection("ranking").updateOne(
        { userId, mock },
        {
          $set: {
            marksreceieved,
            submittedAt: new Date(),
          },
        }
      );

      if (updateRanking.modifiedCount > 0) {
        console.log("Results updated successfully.");
      } else {
        console.error("Failed to update results. Check the query or document structure.");
      }
    } else {
      const insertRanking = await db.collection("ranking").insertOne(RankingDoc);
      console.log("Result submitted successfully with ID:", insertRanking.insertedId);
    }



    // Update or insert the response
    if (existingResponse) {
      const updateResult = await db.collection("response").updateOne(
        { userId, mock },
        { $set: { answers, submittedAt: new Date() } }
      );

      if (updateResult.modifiedCount > 0) {
        return new Response(
          JSON.stringify({ message: "Answers updated successfully!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Failed to update the answers." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      const responseDoc = {
        userId,
        mock,
        answers,
        submittedAt: new Date(),
      };

      const insertResult = await db.collection("response").insertOne(responseDoc);

      if (insertResult.acknowledged) {
        return new Response(
          JSON.stringify({ message: "Answers submitted successfully!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Failed to save the answers." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  } catch (error) {
    console.error("Error in submit-answers API:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
