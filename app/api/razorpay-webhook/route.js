import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const userId = payment.notes?.userId;
console.log("User ID from payment.notes:", userId, typeof userId);
    console.log("🧾 Webhook Notes:", payment.notes);
    console.log("💰 Payment Captured:", {
      id: payment.id,
      email: payment.email,
      amount: payment.amount,
      userId,
    });

    if (!userId) {
      return NextResponse.json({ success: false, message: 'UserId not found in notes' });
    }

    try {
      const client = await clientPromise;
      const db = client.db("sample_mflix");

      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { hasPaid: true, razorpay_payment_id: payment.id } }
      );

      console.log(`✅ User ${userId} marked as paid`, result);
    } catch (error) {
      console.error('❌ MongoDB update error:', error);
      return NextResponse.json({ success: false, message: 'DB error' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
