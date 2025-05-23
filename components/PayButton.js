"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PayButton() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    // Check if the Razorpay script is already present to avoid multiple loads
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true; // Load script asynchronously
      script.onload = () => {
        console.log("Razorpay checkout.js script loaded successfully.");
      };
      script.onerror = (error) => {
        console.error("Failed to load Razorpay checkout.js script:", error);
        // Display a user-friendly message if the script fails to load
        // (though you confirmed 200 OK, this is good practice)
        alert("Payment system could not load. Please try again later.");
      };
      document.body.appendChild(script);
    }
  }, []);

  const handlePay = async () => {
    console.log("Attempting to initiate payment...");

    // 1. Fetch order details from your API route
    let orderData;
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      // Check if the API response was successful (HTTP 2xx status)
      if (!res.ok) {
        const errorDetails = await res.text(); // Get error response as text
        console.error(`API Error: ${res.status} - ${errorDetails}`);
        alert(`Failed to create order: ${errorDetails}. Please contact support.`);
        return; // Stop execution if API call failed
      }

      orderData = await res.json();
      console.log("Response from /api/create-order:", orderData);

      // Crucial check: Ensure orderData.id (Razorpay order ID) is valid
      if (!orderData.id || !orderData.id.startsWith('order_')) {
        console.error("Invalid or missing order_id from API:", orderData.id);
        alert("Payment initiation failed: Invalid order ID received. Please try again.");
        return;
      }

    } catch (error) {
      console.error("Network or API call error:", error);
      alert("Could not connect to the payment server. Please check your internet connection and try again.");
      return; // Stop execution if fetch failed
    }

    // 2. Check if Razorpay SDK is available
    if (!window.Razorpay) {
      console.error("Razorpay SDK (window.Razorpay) is not available.");
      alert("Payment system is still loading. Please wait a moment and try again.");
      return;
    }

    // 3. Prepare Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your LIVE Key ID
      amount: orderData.amount, // Amount in smallest currency unit (e.g., paisa for INR)
      currency: orderData.currency, // Currency (e.g., "INR")
      name: "DesiMochi",
      description: "Unlock All Exams",
      order_id: orderData.id, // The Razorpay Order ID obtained from your API
      handler: function (response) {
        // This function is called on successful payment
        console.log("Payment Success:", response);
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // You would typically send this response to your server for verification
      },
      prefill: {
        name: session?.user?.name || "User",
        email: session?.user?.email || "email@example.com",
        contact: session?.user?.email ? "" : "9999999999", // Provide a default contact if email is not available
      },
      theme: { color: "#3399cc" },
    };

    // Log the options object before opening to inspect values
    console.log("Razorpay Options being used:", options);
    console.log("Razorpay Key ID being used:", options.key);
    console.log("Order ID being used:", options.order_id);
    console.log("Amount being used:", options.amount);


    // 4. Create and open Razorpay instance
    try {
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        // This function is called if the payment fails
        console.error("Payment failed:", response.error);
        alert("Payment failed: " + response.error.description + " (Code: " + response.error.code + ")");
        // You might want to send this error to your server for logging
      });

      rzp.open(); // Attempt to open the checkout modal
      console.log("Razorpay checkout open() method called.");

    } catch (e) {
      console.error("Error initializing or opening Razorpay checkout:", e);
      alert("An unexpected error occurred with the payment system. Please try again.");
    }
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
