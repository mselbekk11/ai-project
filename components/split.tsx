import { Button } from "./ui/button";

export default function Split() {
  return (
    <div className="bg-zinc-800 mx-auto w-full flex items-center py-12">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-2">
        <div className=" p-4">
          <div className="bg-gray-300 h-[400px] flex items-center justify-center">
            T
          </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <div className="">
            <p className="font-semibold text-indigo-400">
              Award winning support
            </p>

            <h2 className="mt-2 text-4xl font-extrabold md:text-5xl xl:[line-height:1.125] text-white">
              3 easy Steps
            </h2>
            <p className="mt-4 text-white">
              Libero sapiente aliquam quibusdam aspernatur.
            </p>

            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
