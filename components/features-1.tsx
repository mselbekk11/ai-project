import { Card, CardContent } from "@/components/ui/card";

import imageTwoBg from "@/public/image-two-bg.png";
import imageThreeBg from "@/public/image-three-bg.png";
import imageGroup from "@/public/group.png";
import Image from "next/image";
import SectionHeading from "./section-heading";

export default function Features() {
  return (
    <section className="bg-zinc-800 py-16 md:py-24 dark:bg-transparent relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/stars.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
          opacity: 0.6,
        }}
      ></div>

      <div className="@container mx-auto max-w-5xl px-6 relative z-10">
        <SectionHeading
          subheading="Try on clothes virtually in"
          heading="3 Easy Steps"
          textColor="text-white"
        />
        <div className="mx-auto my-8 grid grid-cols-1 md:grid-cols-3 max-w-full gap-12 *:text-center md:mt-16">
          <Card className="group flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500">
            <div className="flex justify-center items-center h-[300px] bg-zinc-900 rounded-t-md border-b border-zinc-500">
              <Image
                src={imageGroup}
                alt="Step 1"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow text-white p-4 bg-zinc-800 rounded-b-md">
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 text-sm font-bold mr-2 flex flex-col items-center justify-center">
                  <div>1</div>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Upload a few images of yourself
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="group flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500">
            <div className="flex justify-center items-center h-[300px] bg-zinc-900 rounded-t-md border-b border-zinc-500">
              <Image
                src={imageTwoBg}
                alt="Step 1"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow text-white p-4 bg-zinc-800 rounded-b-md">
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 text-sm font-bold mr-2 flex flex-col items-center justify-center">
                  <div>2</div>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Upload an outfit you like
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="group flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500">
            <div className="flex justify-center items-center h-[300px] bg-zinc-900 rounded-t-md border-b border-zinc-500">
              <Image
                src={imageThreeBg}
                alt="Step 1"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow text-white p-4 bg-zinc-800 rounded-b-md">
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 text-sm font-bold mr-2 flex flex-col items-center justify-center">
                  <div>3</div>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Generate images of yourself
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
