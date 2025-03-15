"use client";

// import { Card } from "@/components/ui/card";

export default function ImageGallery() {
  // Create a larger array for demonstration (you can adjust this number or make it dynamic)
  const galleryItems = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="px-4 py-4">
      <div
        className="grid grid-cols-1 gap-4 auto-rows-fr"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        }}
      >
        {galleryItems.map((item) => (
          <div
            key={item}
            className="relative aspect-square bg-gray-200 rounded-md"
          >
            {/* This is the circle in the bottom left */}
            <div className="absolute bottom-3 left-3 w-8 h-8 bg-gray-400 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
