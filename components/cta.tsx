"use client";

import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

export function Cta() {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  if (isInView && value === 0) {
    setValue(10000);
  }

  return (
    <div
      className="mx-auto w-full px-4 py-24 lg:px-6 bg-zinc-800 relative"
      ref={ref}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/stars.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
          opacity: 0.6,
        }}
      ></div>
      <div className="relative mx-auto max-w-2xl py-12 text-center bg-white">
        <div className="relative">
          <div className="mx-auto max-w-6xl space-y-2 text-center mb-12">
            <h1 className="text-4xl font-extrabold md:text-5xl xl:text-4xl xl:[line-height:1.125]">
              Frequently questions
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button>Try on clothes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
