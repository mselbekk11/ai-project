"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import ImageSheet from "./image-sheet";
import { Doc } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

// import { Card } from "@/components/ui/card";

export default function Gallery() {
  const { user } = useUser();
  // Fetch generations from the database
  const generations = useQuery(api.generations.list) || [];
  // Fetch headshot models to get the model names
  const headshotModels =
    useQuery(api.headshot_models.listUserModels, {
      user_id: user?.id || "", // Use the current user's ID
    }) || [];
  const [selectedGeneration, setSelectedGeneration] =
    useState<Doc<"generations"> | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Log for debugging
  console.log("Headshot models:", headshotModels);
  console.log("Generations:", generations);

  // Create a mapping of lora_id to model name
  const modelNameMap = new Map();
  headshotModels.forEach((model) => {
    if (model.lora_id !== undefined) {
      modelNameMap.set(model.lora_id, model.name);
    }
  });

  // Function to get model name from lora_id
  const getModelName = (loraId: number) => {
    console.log("Looking up model name for lora_id:", loraId);
    const modelName = modelNameMap.get(loraId);
    console.log("Found model name:", modelName);
    return modelName || String(loraId);
  };

  const handleImageClick = (generation: Doc<"generations">) => {
    setSelectedGeneration(generation);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete image: ", selectedGeneration?._id);
    setIsSheetOpen(false);
  };

  const handleDownload = () => {
    console.log("Download image: ", selectedGeneration?.image_url_generation);
    // In a real app, you would implement the download functionality here
  };

  // Function to clean the prompt before displaying
  const cleanPrompt = (prompt: string) => {
    // Remove the lora and faceid parts using regex
    return prompt.replace(/<lora:[^>]+>\s*<faceid:[^>]+>\s*/g, "").trim();
  };

  return (
    <div className="px-4 py-4">
      <div
        className="grid grid-cols-1 gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        }}
      >
        {generations.map((generation) => (
          <div
            key={generation._id}
            className="relative bg-gray-100 rounded-md overflow-hidden cursor-pointer"
            style={{ aspectRatio: "768/1280" }}
            onClick={() => handleImageClick(generation)}
          >
            <Image
              src={generation.image_url_generation}
              alt={generation.prompt}
              fill
              className="object-cover"
            />
            {/* Original clothing image thumbnail */}
            {/* <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={generation.image_url}
                alt="Original item"
                fill
                className="object-cover"
              />
            </div> */}
          </div>
        ))}
      </div>

      {selectedGeneration && (
        <ImageSheet
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
          imageUrl={selectedGeneration.image_url_generation}
          imageUrl2={selectedGeneration.image_url}
          prompt={cleanPrompt(selectedGeneration.prompt)}
          modelName={getModelName(selectedGeneration.lora_id)}
          itemOfClothing={selectedGeneration.clothing_item || "Unknown"}
          createdAt={new Date(selectedGeneration.created_at)}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
