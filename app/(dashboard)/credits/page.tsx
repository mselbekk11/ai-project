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
    <section className="h-full flex flex-col items-center justify-start p-4">
      <Card className="w-full h-full bg-sidebar">
        <div className="mx-auto max-w-6xl px-6 w-full">
          <div className="text-center my-12">
            <h1 className="text-center mx-auto mt-2 max-w-xl text-2xl font-extrabold">
              Buy some Credits
            </h1>
            <p className="mx-auto mt-4 hidden max-w-2xl text-wrap text-md sm:block text-black">
              Pay once,{" "}
              <span className="font-bold text-purple-500">
                no subscriptions or hidden fees
              </span>
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Starter</CardTitle>
                <span className="my-3 block text-2xl font-semibold">$19</span>
              </CardHeader>

              <CardContent className="flex-grow space-y-4">
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

              <CardFooter>
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

            <Card className="relative flex flex-col border border-purple-600">
              <span className="bg-purple-600 absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/40 ring-offset-1 ring-offset-gray-950/5">
                Popular
              </span>

              <CardHeader>
                <CardTitle className="font-medium">Pro</CardTitle>
                <span className="my-3 block text-2xl font-semibold">$29</span>
              </CardHeader>

              <CardContent className="flex-grow space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "2 Model Credits",
                    "40 Clothing Credits",
                    "40 Generation Credits",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check
                        className="size-3"
                        color="oklch(72.3% 0.219 149.579)"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
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
                <CardTitle className="font-medium">Premium</CardTitle>
                <span className="my-3 block text-2xl font-semibold">$49</span>
              </CardHeader>

              <CardContent className="flex-grow space-y-4">
                <hr className="border-dashed" />

                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "3 Model Credits",
                    "60 Clothing Credits",
                    "60 Generation Credits",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check
                        className="size-3"
                        color="oklch(72.3% 0.219 149.579)"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
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
      </Card>
    </section>
  );
}
