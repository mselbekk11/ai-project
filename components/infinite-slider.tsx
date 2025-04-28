import Image from "next/image";
import { InfiniteSlider } from "../components/motion-primitives/infinite-slider";

const images = [
  {
    image: "/h-1.png",
  },
  {
    image: "/h-2.png",
  },
  {
    image: "/h-3.png",
  },
  {
    image: "/h-4.png",
  },
  {
    image: "/h-1.png",
  },
  {
    image: "/h-2.png",
  },
  {
    image: "/h-3.png",
  },
  {
    image: "/h-4.png",
  },
  {
    image: "/h-5.png",
  },
  {
    image: "/h-6.png",
  },
  {
    image: "/h-9.png",
  },
  {
    image: "/h-7.png",
  },
  {
    image: "/h-8.png",
  },
];

export function InfiniteSliderHoverSpeed() {
  return (
    <div className="bg-zinc-800 py-4 hidden md:flex w-full overflow-hidden">
      <div className="w-full flex flex-col gap-4 overflow-hidden">
        <div className="relative w-full overflow-hidden max-h-[450px]">
          <InfiniteSlider
            speedOnHover={1}
            gap={2}
            speed={20}
            reverse={true}
            className="overflow-hidden"
          >
            {images.map((item, idx) => (
              <div
                key={idx}
                className="rounded-md bg-white p-1 mx-2 shadow-lg shadow-black/30 flex-shrink-0"
              >
                <Image
                  src={item.image}
                  width={250}
                  height={209}
                  alt="Hero Section Two"
                  className="rounded-md w-full h-auto object-cover"
                />
              </div>
            ))}
          </InfiniteSlider>
        </div>
        <div className="relative w-full overflow-hidden max-h-[450px]">
          <InfiniteSlider
            speedOnHover={1}
            gap={2}
            speed={20}
            reverse={false}
            className="overflow-hidden"
          >
            {images.map((item, idx) => (
              <div
                key={idx}
                className="rounded-md bg-white p-1 mx-2 shadow-lg shadow-black/30 flex-shrink-0 "
              >
                <Image
                  src={item.image}
                  width={250}
                  height={209}
                  alt="Hero Section Two"
                  className="rounded-md w-full h-auto object-cover"
                />
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </div>
  );
}
