"use client";
import { InfiniteSlider } from "./motion-primitives/infinite-slider";
import Image from "next/image";

interface BackgroundCarouselProps {
  images: string[];
  speed: number;
  reverse?: boolean;
  className?: string;
}

export function BackgroundCarousel({
  images,
  speed,
  reverse = false,
  className,
}: BackgroundCarouselProps) {
  return (
    <div className={`w-full h-full opacity-5 ${className || ""}`}>
      <InfiniteSlider
        speed={speed}
        gap={4}
        reverse={reverse}
        className="w-full h-full"
      >
        {images.map((image, idx) => (
          <div key={idx} className="relative h-[200px] w-[250px] mr-1">
            <Image
              src={image}
              alt="Background fashion image"
              fill
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
