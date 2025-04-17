import { Card } from "@/components/ui/card";
import imageTwoBg from "@/public/image-two-bg.png";
import imageThreeBg from "@/public/image-three-bg.png";
import imageGroup from "@/public/group.png";
import Image from "next/image";
import SectionHeading from "./section-heading";

export default function Features() {
  return (
    <section className="bg-zinc-800 py-32 dark:bg-transparent relative">
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
          <Card className="group/card relative flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500 overflow-hidden h-[350px]">
            <div className="relative h-full w-full bg-zinc-900 rounded-md flex justify-center items-center">
              <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
              <Image
                src={imageGroup}
                alt="Step 1"
                className="max-h-[60%] w-auto object-contain relative z-10 mb-8"
              />
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(189deg, transparent 40%, rgba(0,0,0,0.95) 100%)",
                }}
              ></div>
              <div className="absolute bottom-0 left-0 p-4 text-left z-20">
                <h3 className="font-bold text-xl text-gray-50">Step 1</h3>
                <p className="font-normal text-sm text-gray-50 my-2">
                  Upload a few images of yourself
                </p>
              </div>
            </div>
          </Card>

          <Card className="group/card relative flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500 overflow-hidden h-[350px]">
            <div className="relative h-full w-full bg-zinc-900 rounded-md flex justify-center items-center">
              <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
              <Image
                src={imageTwoBg}
                alt="Step 2"
                className="max-h-[100%] w-auto object-contain relative z-10"
              />
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(189deg, transparent 40%, rgba(0,0,0,0.95) 100%)",
                }}
              ></div>
              <div className="absolute bottom-0 left-0 p-4 text-left z-20">
                <h3 className="font-bold text-xl text-gray-50">Step 2</h3>
                <p className="font-normal text-sm text-gray-50 my-2">
                  Upload an outfit you like
                </p>
              </div>
            </div>
          </Card>

          <Card className="group/card relative flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500 overflow-hidden h-[350px]">
            <div className="relative h-full w-full bg-zinc-900 rounded-md flex justify-center items-center">
              <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
              <Image
                src={imageThreeBg}
                alt="Step 3"
                className="max-h-[100%] w-auto object-contain relative z-10"
              />
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(189deg, transparent 40%, rgba(0,0,0,0.95) 100%)",
                }}
              ></div>
              <div className="absolute bottom-0 left-0 p-4 text-left z-20">
                <h3 className="font-bold text-xl text-gray-50">Step 3</h3>
                <p className="font-normal text-sm text-gray-50 my-2">
                  Generate images of yourself
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
