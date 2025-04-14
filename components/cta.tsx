"use client";
import { ArrowRightIcon } from "lucide-react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";

export function Cta() {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  if (isInView && value === 0) {
    setValue(10000);
  }

  return (
    <div className="mx-auto w-full bg-gray-50 px-4 py-24 lg:px-6" ref={ref}>
      <div className="relative mx-auto max-w-2xl py-12 text-center bg-white">
        <div className="relative">
          {/* <h2 className="mb-4 text-3xl text-zinc-900 dark:text-white">
            Join the community
          </h2>
          <p className="mb-6 text-zinc-500 dark:text-zinc-400">
            More than +
            <AnimatedNumber
              value={value}
              springOptions={{ bounce: 0, duration: 2000 }}
            />{" "}
            designers sharing their work.
          </p> */}
          <div className="mx-auto max-w-6xl space-y-2 text-center mb-12">
            <p className="font-semibold text-indigo-400">
              Award winning support
            </p>
            <h1 className="text-4xl font-extrabold md:text-5xl xl:text-4xl xl:[line-height:1.125]">
              Frequently questions
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-1.5 text-sm text-white transition-colors duration-300 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Join now
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1 rounded-md bg-transparent px-2.5 py-1.5 text-sm text-zinc-900 transition-colors duration-300 hover:bg-zinc-200 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Learn more <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
