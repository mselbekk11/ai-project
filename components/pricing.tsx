import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { ShimmerButton } from "./magicui/shimmer-button";

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
    <section className="py-12 md:py-24 bg-zinc-800 flex flex-col items-center relative min-h-screen">
      <div className="mx-auto max-w-6xl px-6 w-full">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/stars.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "500px",
            opacity: 0.6,
          }}
        ></div>
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mt-8 text-2xl font-extrabold md:text-4xl xl:[line-height:1.125] text-white">
            Buy some Credits
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-wrap text-xs md:text-base sm:block text-white">
            Pay once,{" "}
            <span className="font-bold text-fuchsia-300">
              no subscriptions or hidden fees
            </span>
            . We do not offer trials due to high costs, <br className="hidden md:block" /> but we will
            refund you if you&apos;re unsatisfied.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          <Card className="flex flex-col bg-zinc-900 z-10 border border-zinc-500">
            <CardHeader>
              <CardTitle className="font-medium text-white">Starter</CardTitle>
              <span className="my-3 block text-2xl font-semibold text-white">
                $19
              </span>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
              <hr className="border-dashed border-zinc-500" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "1 Model Credit",
                  "20 Clothing Credits",
                  "20 Generation Credits",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-white"
                  >
                    <Check
                      className="size-3"
                      color="oklch(55.2% 0.016 285.938)"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
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

          <Card className="relative flex flex-col bg-zinc-900 z-10 border border-purple-600">
            <span className="bg-purple-600 absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/40 ring-offset-1 ring-offset-gray-950/5">
              Popular
            </span>

            <CardHeader>
              <CardTitle className="font-medium text-white">Pro</CardTitle>
              <span className="my-3 block text-2xl font-semibold text-white">
                $29
              </span>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
              <hr className="border-dashed border-zinc-500" />
              <ul className="list-outside space-y-3 text-sm">
                {[
                  "2 Model Credits",
                  "40 Clothing Credits",
                  "40 Generation Credits",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-white"
                  >
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
              <ShimmerButton
                className="shadow-2xl w-full"
                gradientFrom="rgb(92 6 226)"
                gradientTo="rgb(84 84 236)"
                onClick={() => handlePurchase("pro")}
                disabled={isProcessing}
              >
                {isProcessing && processingPlan === "pro" ? (
                  <span className="flex items-center justify-center whitespace-pre-wrap text-center text-sm leading-none tracking-tight text-white font-semibold">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="whitespace-pre-wrap text-center text-sm leading-none tracking-tight text-white font-semibold">
                    Get Started
                  </span>
                )}
              </ShimmerButton>
            </CardFooter>
          </Card>

          <Card className="flex flex-col bg-zinc-900 z-10 border border-zinc-500">
            <CardHeader>
              <CardTitle className="font-medium text-white">Premium</CardTitle>
              <span className="my-3 block text-2xl font-semibold text-white">
                $49
              </span>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
              <hr className="border-dashed border-zinc-500" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "3 Model Credits",
                  "60 Clothing Credits",
                  "60 Generation Credits",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-white"
                  >
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
