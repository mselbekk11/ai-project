"use client";

import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
// import { Button } from "./ui/button";
import { ShimmerButton } from "./magicui/shimmer-button";
import Link from "next/link";

export function Cta() {
  const [value, setValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref);

  // Check user authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      // Example: Check if a user token exists in localStorage
      const userToken = localStorage.getItem("userToken");
      setIsLoggedIn(!!userToken);
    };

    checkAuthStatus();
  }, []);

  // Determine the link destination based on auth status
  const linkDestination = isLoggedIn ? "/home" : "/sign-up";

  if (isInView && value === 0) {
    setValue(10000);
  }

  return (
    <div
      className="mx-auto w-full px-4 pb-32 lg:px-6 bg-gray-50 relative"
      ref={ref}
    >
      <div className="relative mx-auto max-w-6xl py-12 text-center bg-zinc-800 rounded-md shadow-lg shadow-black/50">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/stars.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "500px",
            opacity: 0.6,
          }}
        ></div>
        <div className="mx-auto max-w-6xl text-center mb-8">
          <h1 className="font-extrabold text-1xl md:text-3xl xl:[line-height:1.125] text-white">
            Virtually Try On Clothes <br />
            Anytime, Anywhere
          </h1>
        </div>
        <div className="flex items-center justify-center gap-4">
          {/* <Button variant="purple">Try on clothes</Button> */}
          <Link href={linkDestination}>
            <ShimmerButton
              className="shadow-2xl cursor-pointer"
              gradientFrom="rgb(92 6 226)"
              gradientTo="rgb(84 84 236)"
            >
              <span className="whitespace-pre-wrap text-center text-sm leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 px-4 font-semibold">
                Try on clothes
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
