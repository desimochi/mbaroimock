"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PayButton() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePay = async () => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();

    if (!window.Razorpay) {
      alert("Razorpay SDK not loadedd.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      name: "DesiMochi",
      description: "Unlock All Exams",
      order_id: data.id,
      handler: function (response) {
        console.log("Payment Success:", response);
        alert("Payment successful.");
      },
      prefill: {
        name: session?.user?.name || "User",
        email: session?.user?.email || "email@example.com",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert("Payment failed: " + response.error.description);
    });

    rzp.open();
  };

  return (
    <button
      onClick={handlePay}
      className="bg-red-500 text-sm text-white px-4 py-2 rounded"
    >
      Unlock Exam @ ₹49
    </button>
  );
}
