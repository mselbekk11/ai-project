import { useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import LogoFive from "./logoFive";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

export default function NavigationTwo({}: {
  companyName: string;
  logo: React.ReactNode;
  links: { label: string; href: string }[];
}) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "100px start"],
  });

  scrollYProgress.on("change", (latest) => {
    setHasScrolled(latest > 0);
  });

  return (
    <div className="fixed top-8 z-50 w-full">
      <div className="mx-auto w-full max-w-screen-lg px-4">
        <div
          className={cn(
            `flex w-full items-center justify-between rounded-xl border transition-all duration-200 ease-out`,
            hasScrolled
              ? "border-neutral-200 bg-white/80 px-2 backdrop-blur-sm"
              : "border-transparent bg-transparent px-2 backdrop-blur-0",
          )}
        >
          <div className="flex w-full items-center justify-between p-2">
            <div className="flex w-auto justify-between">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  {/* <LogoThree /> */}
                  <LogoFive />
                </div>
                <span className="font-extrabold text-1xl text-slate-800">
                  Trizzyyy
                </span>
              </Link>
            </div>

            <div className="flex gap-x-6 sm:gap-x-12">
              {/* {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm/6 font-normal text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  {link.label}
                </a>
              ))} */}
              <div className="hidden lg:flex lg:items-center lg:gap-3">
                <SignedOut>
                  <SignInButton>
                    <Button size="sm">Sign in</Button>
                  </SignInButton>

                  <SignUpButton>
                    <Button size="sm" variant="outline" className="">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <SignOutButton>
                    <Button variant="outline" size="sm">
                      Sign out
                    </Button>
                  </SignOutButton>

                  <Link href="/home">
                    <Button variant="default" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
