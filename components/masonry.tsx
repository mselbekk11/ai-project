import { useState } from "react";
import Image from "next/image";

// Define interface for images
interface MasonryImage {
  id: string;
  src: string;
  alt?: string;
  column: number; // 0-7 (for 8 columns)
  position: number; // 0-2 (for 3 positions in each column)
}

// Predetermined offsets for each column
// These values create a visually appealing staggered effect
const PREDETERMINED_OFFSETS = [0, 45, 15, 60, 30, 15, 45, 0];

export default function Masonry() {
  // State to store offsets for each column - initialized with predetermined values
  const [columnOffsets] = useState<number[]>(PREDETERMINED_OFFSETS);

  // Calculate number of images per column (3 per column as specified)
  const imagesPerColumn = 3;

  // Sample image data - this could come from props, API, or any other source
  // In a real application, you might want to load this from a database or CMS
  const imageData: MasonryImage[] = [
    { id: "1", src: "/mee-eleven.png", alt: "Image 1", column: 0, position: 0 },
    { id: "2", src: "/mee-two.png", alt: "Image 2", column: 0, position: 1 },
    { id: "3", src: "/mee-three.png", alt: "Image 3", column: 0, position: 2 },
    { id: "4", src: "/mee-four.png", alt: "Image 4", column: 1, position: 0 },
    { id: "5", src: "/mee-five.png", alt: "Image 5", column: 1, position: 1 },
    { id: "6", src: "/mee-six.png", alt: "Image 6", column: 1, position: 2 },
    { id: "7", src: "/mee-seven.png", alt: "Image 7", column: 2, position: 0 },
    { id: "8", src: "/mee-eight.png", alt: "Image 8", column: 2, position: 1 },
    { id: "9", src: "/mee-nine.png", alt: "Image 9", column: 2, position: 2 },
    { id: "10", src: "/mee-ten.png", alt: "Image 10", column: 3, position: 0 },
    {
      id: "11",
      src: "/mee-twelve.png",
      alt: "Image 11",
      column: 3,
      position: 1,
    },
    { id: "12", src: "/mee-two.png", alt: "Image 12", column: 3, position: 2 },
    // Add more images as needed for columns 4-7
    {
      id: "13",
      src: "/mee-three.png",
      alt: "Image 13",
      column: 4,
      position: 0,
    },
    { id: "14", src: "/mee-four.png", alt: "Image 14", column: 4, position: 1 },
    {
      id: "15",
      src: "/mee-five.png",
      alt: "Image 15",
      column: 4,
      position: 2,
    },
    { id: "16", src: "/mee-six.png", alt: "Image 16", column: 5, position: 0 },
    {
      id: "17",
      src: "/mee-seven.png",
      alt: "Image 17",
      column: 5,
      position: 1,
    },
    {
      id: "18",
      src: "/mee-eight.png",
      alt: "Image 18",
      column: 5,
      position: 2,
    },
    {
      id: "19",
      src: "/mee-nine.png",
      alt: "Image 19",
      column: 6,
      position: 0,
    },
    { id: "20", src: "/mee-ten.png", alt: "Image 20", column: 6, position: 1 },
    {
      id: "21",
      src: "/mee-eleven.png",
      alt: "Image 21",
      column: 6,
      position: 2,
    },
    {
      id: "22",
      src: "/mee-twelve.png",
      alt: "Image 22",
      column: 7,
      position: 0,
    },
    {
      id: "23",
      src: "/mee-thirteen.png",
      alt: "Image 23",
      column: 7,
      position: 1,
    },
    { id: "24", src: "/mee-four.png", alt: "Image 24", column: 7, position: 2 },
  ];

  // Helper function to get images for a specific column
  const getColumnImages = (columnIndex: number) => {
    return imageData
      .filter((image) => image.column === columnIndex)
      .sort((a, b) => a.position - b.position);
  };

  return (
    <section className="relative w-full bg-zinc-800 overflow-hidden py-8">
      {/* Stars background overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/stars.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
          opacity: 0.6,
        }}
      ></div>

      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent z-10"></div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black to-transparent z-10"></div>

      {/* Masonry grid */}
      <div className="mx-auto px-4 relative z-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
          {/* Generate 8 columns */}
          {Array.from({ length: 8 }).map((_, columnIndex) => {
            const columnImages = getColumnImages(columnIndex);

            return (
              <div
                key={columnIndex}
                className={`flex flex-col gap-4 ${columnIndex >= 6 ? "hidden 2xl:flex" : ""}`}
                style={{
                  marginTop: columnOffsets[columnIndex] || 0,
                }}
              >
                {/* If we have images for this column, display them */}
                {columnImages.length > 0
                  ? columnImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-[3/4] w-full bg-black hover:bg-zinc-900 rounded-md overflow-hidden flex items-center justify-center border border-zinc-700 transition-colors duration-200"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={image.src}
                            alt={image.alt || `Image ${image.id}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 16vw, 12.5vw"
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))
                  : // Fallback if no images are assigned to this column
                    Array.from({ length: imagesPerColumn }).map(
                      (_, imageIndex) => (
                        <div
                          key={`empty-${columnIndex}-${imageIndex}`}
                          className="relative aspect-[3/4] w-full bg-black hover:bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center transition-colors duration-200"
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={`/mee-${
                                (imageIndex % 13) + 1 === 1
                                  ? "eleven"
                                  : (imageIndex % 13) + 1 === 2
                                    ? "two"
                                    : (imageIndex % 13) + 1 === 3
                                      ? "three"
                                      : (imageIndex % 13) + 1 === 4
                                        ? "four"
                                        : (imageIndex % 13) + 1 === 5
                                          ? "five"
                                          : (imageIndex % 13) + 1 === 6
                                            ? "six"
                                            : (imageIndex % 13) + 1 === 7
                                              ? "seven"
                                              : (imageIndex % 13) + 1 === 8
                                                ? "eight"
                                                : (imageIndex % 13) + 1 === 9
                                                  ? "nine"
                                                  : (imageIndex % 13) + 1 === 10
                                                    ? "ten"
                                                    : (imageIndex % 13) + 1 ===
                                                        11
                                                      ? "eleven"
                                                      : (imageIndex % 13) +
                                                            1 ===
                                                          12
                                                        ? "twelve"
                                                        : "thirteen"
                              }.png`}
                              alt={`Placeholder image ${columnIndex}-${imageIndex}`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 16vw, 12.5vw"
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ),
                    )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
