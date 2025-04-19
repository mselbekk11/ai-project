import Image from "next/image";
import { InfiniteSlider } from "./motion-primitives/infinite-slider";

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
];

export function InfiniteSliderHoverSpeedTwo() {
  return (
    <div className="bg-zinc-800 py-4 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/stars.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
          opacity: 0.6,
        }}
      ></div>
      <div className="p-4 flex flex-col gap-4 bg-zinc-900 border border-zinc-500 max-w-7xl mx-auto rounded-md relative z-10">
        <InfiniteSlider speedOnHover={1} gap={2} speed={20} reverse={true}>
          {images.map((item, idx) => (
            <div
              key={idx}
              className="rounded-md bg-white p-1 mx-2 shadow-lg shadow-black/30"
            >
              <Image
                src={item.image}
                width={300}
                height={450}
                alt="Hero Section Two"
                className="rounded-md"
              />
            </div>
          ))}
        </InfiniteSlider>
        <InfiniteSlider speedOnHover={1} gap={2} speed={20} reverse={false}>
          {images.map((item, idx) => (
            <div
              key={idx}
              className="rounded-md bg-white p-1 mx-2 shadow-lg shadow-black/30"
            >
              <Image
                src={item.image}
                width={300}
                height={450}
                alt="Hero Section Two"
                className="rounded-md"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}
