import Image from "next/image";
import { InfiniteSlider } from "../components/motion-primitives/infinite-slider";

const images = [
  {
    image: "/h-1.png",
  },
  {
    image: "/h-1.png",
  },
  {
    image: "/h-1.png",
  },
  {
    image: "/h-1.png",
  },
  {
    image: "/h-1.png",
  },
  {
    image: "/h-1.png",
  },
  {
    image: "/h-1.png",
  },
  {
    image: "/h-1.png",
  },
];

export function InfiniteSliderHoverSpeed() {
  return (
    <div className="bgpink py-24">
      <div className="px-8">
        <InfiniteSlider speedOnHover={1} gap={24} speed={30}>
          {images.map((item, idx) => (
            <div
              key={idx}
              className="rounded-md bg-white p-2 my-6 mx-2 shadow-lg shadow-black/30"
            >
              <Image
                src={item.image}
                width={400}
                height={550}
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
