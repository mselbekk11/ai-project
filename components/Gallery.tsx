"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

// import { Card } from "@/components/ui/card";

export default function Gallery() {
  // Fetch generations from the database
  const generations = useQuery(api.generations.list) || [];

  return (
    <div className="px-4 py-4">
      <div
        className="grid grid-cols-1 gap-4 auto-rows-fr"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        }}
      >
        {generations.map((generation) => (
          <div
            key={generation._id}
            className="relative aspect-square bg-gray-100 rounded-md overflow-hidden"
          >
            <Image
              src={generation.image_url_generation}
              alt={generation.prompt}
              fill
              className="object-cover"
            />
            {/* Original clothing image thumbnail */}
            <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={generation.image_url}
                alt="Original item"
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
