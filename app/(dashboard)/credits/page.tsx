"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
// import Credits from "@/components/Credits";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

export default function BuyCredits() {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleBuyCredits = async (plan: string) => {
    setIsProcessing(true);
    setProcessingPlan(plan);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          userId: user?.id,
          isOnboarding: false,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe checkout
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create checkout session");
    } finally {
      setIsProcessing(false);
      setProcessingPlan(null);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Buy Credits</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your current credits</h2>
        {/* <Credits /> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-medium">Starter Package</CardTitle>
            <span className="my-3 block text-2xl font-semibold">$19</span>
          </CardHeader>

          <CardContent className="space-y-4">
            <hr className="border-dashed" />
            <ul className="list-outside space-y-3 text-sm">
              {[
                "1 Model Credit",
                "20 Clothing Credits",
                "20 Generation Credits",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="size-3" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto">
            <Button
              className="w-full"
              onClick={() => handleBuyCredits("starter")}
              disabled={isProcessing}
            >
              {processingPlan === "starter" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-purple-500">
          <div className="absolute -top-3 right-5 bg-purple-500 text-white px-3 py-1 text-xs rounded-full">
            Best Value
          </div>
          <CardHeader>
            <CardTitle className="font-medium">Pro Package</CardTitle>
            <span className="my-3 block text-2xl font-semibold">$29</span>
          </CardHeader>

          <CardContent className="space-y-4">
            <hr className="border-dashed" />
            <ul className="list-outside space-y-3 text-sm">
              {[
                "2 Model Credits",
                "40 Clothing Credits",
                "40 Generation Credits",
                "Priority Support",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="size-3" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto">
            <Button
              className="w-full"
              onClick={() => handleBuyCredits("pro")}
              disabled={isProcessing}
            >
              {processingPlan === "pro" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-medium">Premium Package</CardTitle>
            <span className="my-3 block text-2xl font-semibold">$49</span>
          </CardHeader>

          <CardContent className="space-y-4">
            <hr className="border-dashed" />
            <ul className="list-outside space-y-3 text-sm">
              {[
                "3 Model Credits",
                "60 Clothing Credits",
                "60 Generation Credits",
                "Priority Support",
                "Early Access to New Features",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="size-3" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto">
            <Button
              className="w-full"
              onClick={() => handleBuyCredits("premium")}
              disabled={isProcessing}
            >
              {processingPlan === "premium" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
