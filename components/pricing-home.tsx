import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import SectionHeading from "./section-heading";

export default function PricingHome() {
  return (
    <section className="py-24 bg-zinc-800 flex flex-col items-center relative">
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
          <SectionHeading
            subheading="No Subscriptions"
            heading="Buy some Credits"
            textColor="text-white"
          />
          <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-md sm:block text-white">
            Pay once,{" "}
            <span className="font-bold text-fuchsia-300">no subscriptions or hidden fees</span>.
            We do not offer trials due to high costs, <br /> but we will refund
            you if you&apos;re unsatisfied.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
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
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative flex flex-col">
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
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button variant="outline" className="w-full">
                Get Started
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
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
