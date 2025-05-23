import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  const body = await req.json();
  const { userId } = body;
console.log(userId)
  const options = {
    amount: 4900, // ₹49 in paise
    currency: "INR",
    receipt: "receipt_order_" + Date.now(),
    notes: {
      userId, // pass userId for webhook to receive it
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
