import { Card, CardContent } from "@/components/ui/card";

import imageTwoBg from "@/public/image-two-bg.png";
import imageThreeBg from "@/public/image-three-bg.png";
import imageGroup from "@/public/group.png";
import Image from "next/image";

export default function Features() {
  return (
    <section className="bg-zinc-800 py-16 md:py-24 dark:bg-transparent border-t-8 border-white">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="font-semibold text-gray-300">Award winning support</p>
          <h2 className="mt-2 text-4xl font-extrabold md:text-5xl xl:text-4xl xl:[line-height:1.125] text-white">
            3 easy Steps
          </h2>
          {/* <p className="mt-4 text-white">
            Libero sapiente aliquam quibusdam aspernatur.
          </p> */}
        </div>
        <div className="mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 max-w-full gap-12 *:text-center md:mt-16">
          <Card className="group flex flex-col rounded-md bg-transparent border-none">
            <div className="flex justify-center items-center h-[300px] bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-900 rounded-md border-2 border-white">
              <Image
                src={imageGroup}
                alt="Step 1"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow text-white p-2">
              <h3 className="mt-6 font-semibold">
                Upload a few images of yourself
              </h3>
              {/* <p className="mt-3 text-sm">
                Extensive customization options, allowing you to tailor every
                aspect to meet your specific needs.
              </p> */}
            </CardContent>
          </Card>

          <Card className="group flex flex-col rounded-md bg-transparent border-none">
            <div className="flex justify-center items-center h-[300px] bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-900 rounded-md border-2 border-white">
              <Image
                src={imageTwoBg}
                alt="Step 2"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow text-white p-2">
              <h3 className="mt-6 font-semibold">Upload an outfit you like</h3>
              {/* <p className="mt-3 text-sm">
                From design elements to functionality, you have complete control
                to create a unique.
              </p> */}
            </CardContent>
          </Card>

          <Card className="group flex flex-col rounded-md bg-transparent border-none">
            <div className="flex justify-center items-center h-[300px] bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-900 rounded-md border-2 border-white">
              <Image
                src={imageThreeBg}
                alt="Step 3"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow text-white p-2">
              <h3 className="mt-6 font-semibold">
                Generate images of you wearing it
              </h3>
              {/* <p className="mt-3 text-sm">
                From design elements to functionality, you have complete control
                to create a unique.
              </p> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
