"use client";

import { ArrowLeft, StepBackIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 flex items-center gap-2  rounded"
    >
      <ArrowLeft className="h-4 w-4" /> Go Back
    </button>
  );
}
