import { Card, CardContent } from "@/components/ui/card";

import imageTwoBg from "@/public/image-two-bg.png";
import imageThreeBg from "@/public/image-three-bg.png";
import imageGroup from "@/public/group.png";
import Image from "next/image";

export default function FeaturesTwo() {
  return (
    <section className="bg-gray-50 py-16 md:py-24 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          {/* <p className="font-semibold text-gray-300">Award winning support</p> */}
          <h3 className="text-center font-semibold text-indigo-400">
            Deploy faster
          </h3>
          <h2 className="text-center mx-auto mt-2 max-w-lg text-4xl font-extrabold">
            3 Easy Steps
          </h2>
          {/* <p className="mt-4 text-white">
            Libero sapiente aliquam quibusdam aspernatur.
          </p> */}
        </div>
        <div className="mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 max-w-full gap-12 *:text-center md:mt-16">
          <Card className="group flex flex-col rounded-md bg-transparent border border-[#EAEBEC]">
            <div className="flex justify-center items-center h-[300px] bg-white rounded-t-md border-b border-[#EAEBEC]">
              <Image
                src={imageGroup}
                alt="Step 1"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow  p-4 bg-white rounded-b-md ">
              {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                1
              </div> */}
              <h3 className="text-sm font-semibold text-gray-900">
                Upload a few images of yourself
              </h3>
              {/* <p className="mt-3 text-sm">
                Extensive customization options, allowing you to tailor every
                aspect to meet your specific needs.
              </p> */}
            </CardContent>
          </Card>

          <Card className="group flex flex-col rounded-md bg-transparent border border-[#EAEBEC]">
            <div className="flex justify-center items-center h-[300px] bg-white rounded-t-md border-b border-[#EAEBEC]">
              <Image
                src={imageTwoBg}
                alt="Step 1"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow  p-4 bg-white rounded-b-md ">
              {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                1
              </div> */}
              <h3 className="text-sm font-semibold text-gray-900">
                Upload a few images of yourself
              </h3>
              {/* <p className="mt-3 text-sm">
                Extensive customization options, allowing you to tailor every
                aspect to meet your specific needs.
              </p> */}
            </CardContent>
          </Card>

          <Card className="group flex flex-col rounded-md bg-transparent border border-[#EAEBEC]">
            <div className="flex justify-center items-center h-[300px] bg-white rounded-t-md border-b border-[#EAEBEC]">
              <Image
                src={imageThreeBg}
                alt="Step 1"
                className="max-h-full w-auto object-contain"
              />
            </div>

            <CardContent className="flex-grow  p-4 bg-white rounded-b-md ">
              {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-800 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                1
              </div> */}
              <h3 className="text-sm font-semibold text-gray-900">
                Upload a few images of yourself
              </h3>
              {/* <p className="mt-3 text-sm">
                Extensive customization options, allowing you to tailor every
                aspect to meet your specific needs.
              </p> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
