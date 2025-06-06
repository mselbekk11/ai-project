import { Card } from "@/components/ui/card";
import Image from "next/image";
import SectionHeading from "./section-heading";
import ArrowOne from "./arrow-one";
import ArrowTwo from "./arrow-two";

export default function Features() {
  return (
    <section className="bg-zinc-800 py-24 md:py-32 dark:bg-transparent relative">
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
          subheading="Try on clothes in"
          heading="3 Easy Steps"
          textColor="text-white"
        />
        <div className="mx-auto my-8 grid grid-cols-1 md:grid-cols-3 max-w-full gap-12 *:text-center md:mt-16 relative">
          <Card className="group/card relative flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500 overflow-hidden h-[350px]">
            <div className="relative h-full w-full bg-zinc-900 rounded-md flex justify-center items-center">
              <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
              <Image
                src="/group.png"
                alt="Step 1"
                width={180}
                height={120}
                className="h-[180px] md:h-[160px] w-auto object-contain relative z-10 mb-8"
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

          {/* Arrow One - between card 1 and 2 */}
          <div className="absolute left-[33%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
            <ArrowOne />
          </div>

          <Card className="group/card relative flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500 overflow-hidden h-[350px]">
            <div className="relative h-full w-full bg-zinc-900 rounded-md flex justify-center items-center">
              <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
              <Image
                src="/Image-two-bg.png"
                alt="Step 2"
                width={300}
                height={300}
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

          {/* Arrow Two - between card 2 and 3 */}
          <div className="absolute left-[68%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
            <ArrowTwo />
          </div>

          <Card className="group/card relative flex flex-col rounded-md bg-transparent shadow-lg shadow-black/80 border border-zinc-500 overflow-hidden h-[350px]">
            <div className="relative h-full w-full bg-zinc-900 rounded-md flex justify-center items-center">
              <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
              <Image
                src="/image-three-bg.png"
                alt="Step 3"
                width={300}
                height={300}
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
