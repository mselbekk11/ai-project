"use client";

import { useState } from "react";
import Pricing from "@/components/pricing";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function OnboardingPage() {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handlePurchase = async (plan: string) => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    setIsProcessing(true);
    setProcessingPlan(plan);

    try {
      // Call your API to create a checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          userId: user.id,
          isOnboarding: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process payment. Please try again.");
      setIsProcessing(false);
      setProcessingPlan(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Pricing
        handlePurchase={handlePurchase}
        isProcessing={isProcessing}
        processingPlan={processingPlan}
      />
    </div>
  );
}
