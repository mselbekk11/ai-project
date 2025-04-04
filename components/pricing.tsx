import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

interface PricingProps {
  handlePurchase: (plan: string) => Promise<void>;
  isProcessing: boolean;
  processingPlan: string | null;
}

export default function Pricing({
  handlePurchase,
  isProcessing,
  processingPlan,
}: PricingProps) {
  return (
    <section className="py-16 md:py-32 bgpinktwo h-screen flex flex-col items-center justify-start">
      <div className="mx-auto max-w-6xl px-6 w-full">
        <div className="mx-auto max-w-6xl space-y-6 text-center">
          <h1 className="mt-8 text-4xl font-extrabold md:text-5xl xl:text-4xl xl:[line-height:1.125]">
            Select a Package
          </h1>
          <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-md sm:block">
            Pay once, no subscriptions or hidden fees. We offer no trial due to
            high costs, <br /> but we will refund you if you&apos;re
            unsatisfied.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Starter</CardTitle>
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
                variant="outline"
                className="w-full"
                onClick={() => handlePurchase("starter")}
                disabled={isProcessing}
              >
                {isProcessing && processingPlan === "starter" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative">
            <span className="bg-purple-600 absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/40 ring-offset-1 ring-offset-gray-950/5">
              Popular
            </span>

            <div className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Pro</CardTitle>
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

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handlePurchase("pro")}
                  disabled={isProcessing}
                >
                  {isProcessing && processingPlan === "pro" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </div>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Premium</CardTitle>
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
                variant="outline"
                className="w-full"
                onClick={() => handlePurchase("premium")}
                disabled={isProcessing}
              >
                {isProcessing && processingPlan === "premium" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
