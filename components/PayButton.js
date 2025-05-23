"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PayButton() {
     const { data: session, status } = useSession();
     const userId = session?.user?.id
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const handlePay = async () => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userId}),
    });
    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      name: "DesiMochi",
      description: "Unlock All Exams",
      order_id: data.id,
      handler: () => {
        alert("Payment successful. Unlock will happen shortly.");
      },
      prefill: {
        name: session?.user?.name || "user",
        email: session?.user?.email || "email",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return (
    <button
      onClick={handlePay}
      className="bg-red-500 text-sm text-white px-4 py-2 rounded"
    >
      Unlock Exam@ ₹49  
    </button>
  );
}
