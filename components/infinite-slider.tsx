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
];

export function InfiniteSliderHoverSpeed() {
  return (
    <div className="bg-zinc-900 border-t border-b border-zinc-500 py-4">
      <div className=" flex flex-col gap-4">
        <InfiniteSlider
          speedOnHover={1}
          gap={2}
          speed={20}
          reverse={true}
          className=""
        >
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
        <InfiniteSlider
          speedOnHover={1}
          gap={2}
          speed={20}
          reverse={false}
          className=""
        >
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
