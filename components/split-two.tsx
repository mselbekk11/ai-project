import { Button } from "./ui/button";

export default function SplitTwo() {
  return (
    <div className="mx-auto sm:px-0 lg:px-8 bg-zinc-800 w-full py-36">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div className="bg-blue-500">
          <div className="bg-gray-300 h-[400px] flex items-center justify-center">
            T
          </div>
        </div>
        <div className="flex items-center">
          <div className="">
            <p className="font-semibold text-indigo-400">
              Award winning support
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-white">
              3 easy Steps
            </h2>
            <p className="mt-4 text-white mb-4">
              Libero sapiente aliquam quibusdam aspernatur.
            </p>

            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
