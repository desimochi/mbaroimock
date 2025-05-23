
 import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb'; // Your MongoDB connection helper

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser for raw bytes
  },
};
// Validate ObjectId string safely
function isValidObjectId(id) {
  if (!id || typeof id !== 'string') return false;
  if (!ObjectId.isValid(id)) return false;
  return String(new ObjectId(id)) === id;
}
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || `upload_${Date.now()}.xlsx`;

    // 1. Read the raw file bytes from request
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Upload file to Vercel Blob Storage (optional)
    const blob = await put(filename, buffer, { access: 'public' });

    // 3. Parse Excel file from buffer using XLSX
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // 4. Insert parsed data into MongoDB
    const client = await clientPromise;
    const db = client.db('sample_mflix'); // change your DB name here
    const questionsCollection = db.collection('matquestions');
    const optionsCollection = db.collection('matoptions');

    let insertedCount = 0;

    for (const row of data) {
       const mockId = isValidObjectId(row.mockId) ? new ObjectId(row.mockId) : null;
      const questionDoc = {
        question: row.question,
        para: row.para || '',
        topic: row.topic,
        subject: row.subject,
        level: row.level,
        type: row.type,
        mockId: new ObjectId("6830775c3f7c3e113b92ea6c"),
        solution:row.solution,
        createdAt: new Date(),
      };

      const result = await questionsCollection.insertOne(questionDoc);

      const optionsDoc = {
        questionId: result.insertedId,
        a: row.a,
        b: row.b,
        c: row.c,
        d: row.d,
        answer: row.answer ? row.answer.trim().toUpperCase() : '',
      };

      await optionsCollection.insertOne(optionsDoc);
      insertedCount++;
    }

    return NextResponse.json({
      message: `✅ Upload complete, inserted ${insertedCount} records.`,
      blobUrl: blob.publicUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
