import Image from "next/image";
import { InfiniteSlider } from "./motion-primitives/infinite-slider";
import { CSSProperties } from "react";

const images = [
  {
    image: "/steps-three-a.png",
  },
  {
    image: "/steps-three-a.png",
  },
  {
    image: "/steps-three-a.png",
  },
  {
    image: "/steps-three-a.png",
  },
  {
    image: "/steps-three-a.png",
  },
  {
    image: "/steps-three-a.png",
  },
  {
    image: "/steps-three-a.png",
  },
  {
    image: "/steps-three-a.png",
  },
];

// Small screens: 2 columns, Medium: 4 columns, Large: 5 columns, XL: 7 columns
export default function InfiniteSliderMasonry() {
  return (
    <div className="relative bg-zinc-800 py-12 overflow-hidden">
      {/* Top gradient - black to transparent */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10"></div>

      {/* Mobile: 2 columns */}
      <div className="flex w-full sm:hidden">
        <Column reverse={true} speed={5} className="w-1/2" />
        <Column reverse={false} speed={7} className="w-1/2" />
      </div>

      {/* Small screens: 3 columns */}
      <div className="hidden sm:flex md:hidden w-full">
        <Column reverse={true} speed={5} className="w-1/3" />
        <Column reverse={false} speed={7} className="w-1/3" />
        <Column reverse={true} speed={6} className="w-1/3" />
      </div>

      {/* Medium screens: 4 columns */}
      <div className="hidden md:flex lg:hidden w-full">
        <Column reverse={true} speed={5} className="w-1/4" />
        <Column reverse={false} speed={7} className="w-1/4" />
        <Column reverse={true} speed={6} className="w-1/4" />
        <Column reverse={false} speed={8} className="w-1/4" />
      </div>

      {/* Large screens: 5 columns */}
      <div className="hidden lg:flex xl:hidden w-full">
        <Column reverse={true} speed={5} className="w-1/5" />
        <Column reverse={false} speed={7} className="w-1/5" />
        <Column reverse={true} speed={6} className="w-1/5" />
        <Column reverse={false} speed={8} className="w-1/5" />
        <Column reverse={true} speed={6} className="w-1/5" />
      </div>

      {/* XL screens: 7 columns */}
      <div className="hidden xl:flex w-full">
        <Column
          reverse={true}
          speed={5}
          className="w-1/7"
          style={{ width: "14.28%" }}
        />
        <Column
          reverse={false}
          speed={7}
          className="w-1/7"
          style={{ width: "14.28%" }}
        />
        <Column
          reverse={true}
          speed={6}
          className="w-1/7"
          style={{ width: "14.28%" }}
        />
        <Column
          reverse={false}
          speed={8}
          className="w-1/7"
          style={{ width: "14.28%" }}
        />
        <Column
          reverse={true}
          speed={5}
          className="w-1/7"
          style={{ width: "14.28%" }}
        />
        <Column
          reverse={false}
          speed={7}
          className="w-1/7"
          style={{ width: "14.28%" }}
        />
        <Column
          reverse={true}
          speed={6}
          className="w-1/7"
          style={{ width: "14.28%" }}
        />
      </div>

      {/* Bottom gradient - transparent to black */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10"></div>
    </div>
  );
}

// Helper component for each column
type ColumnProps = {
  reverse: boolean;
  speed: number;
  className: string;
  style?: CSSProperties;
};

function Column({ reverse, speed, className, style }: ColumnProps) {
  return (
    <div className={`px-0.5 ${className}`} style={style}>
      <InfiniteSlider
        speedOnHover={1}
        gap={8}
        speed={speed}
        reverse={reverse}
        direction="vertical"
        className="h-[500px]"
      >
        {images.map((item, idx) => (
          <div
            key={idx}
            className="rounded-md bg-white p-1 my-2 shadow-lg shadow-black/30"
          >
            <Image
              src={item.image}
              width={180}
              height={195}
              alt="Masonry Image"
              className="rounded-md w-full h-auto"
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
