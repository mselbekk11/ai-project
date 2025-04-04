"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { isSignedIn, isLoaded } = useUser();
  const [verifying, setVerifying] = useState(true);
  const clerk = useClerk();

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // If user is not signed in, redirect to sign-in page with this page as redirect
    if (!isSignedIn) {
      const currentUrl = window.location.href;
      // Redirect to sign-in with the success page as the return URL
      clerk.redirectToSignIn({ redirectUrl: currentUrl });
      return;
    }

    // If no session ID is provided, redirect to onboarding
    if (!sessionId) {
      toast.error("Missing payment information");
      router.push("/onboarding");
      return;
    }

    // Verify the payment was successful
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `/api/verify-payment?session_id=${sessionId}`,
        );
        const data = await response.json();

        if (data.success) {
          toast.success(
            "Payment successful! Your credits have been added to your account.",
          );
          // Successfully paid, redirect to dashboard
          router.push("/home");
        } else {
          toast.error("Payment verification failed. Please contact support.");
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Failed to verify payment. Please contact support.");
        router.push("/onboarding");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, router, isSignedIn, isLoaded, clerk]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {verifying ? "Processing your payment..." : "Payment Complete!"}
        </h1>
        <p className="mb-4">
          {!isLoaded
            ? "Loading..."
            : !isSignedIn
              ? "Please sign in to continue..."
              : verifying
                ? "Please wait while we verify your payment..."
                : "Thank you for your purchase. You'll be redirected to the dashboard shortly."}
        </p>
        {(verifying || !isLoaded) && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}
