"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
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
  const deleteGeneration = useMutation(api.generations.deleteGeneration);

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

  const handleDelete = async () => {
    if (!selectedGeneration) return;

    console.log("Deleting image: ", selectedGeneration._id);

    try {
      const success = await deleteGeneration({
        generationId: selectedGeneration._id,
      });

      if (success) {
        console.log("Successfully deleted image");
      } else {
        console.error("Failed to delete image");
      }

      setIsSheetOpen(false);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDownload = async () => {
    if (!selectedGeneration) return;

    const imageUrl = selectedGeneration.image_url_generation;
    // Get the model name to use in the filename
    const modelName = getModelName(selectedGeneration.lora_id).replace(
      /[^a-zA-Z0-9]/g,
      "_",
    );
    console.log("Downloading image: ", imageUrl);

    try {
      // Create a suggested filename that's more descriptive
      const baseFilename =
        imageUrl.split("/").pop()?.split("?")[0] || // Try to get clean filename from URL
        `${modelName}-${new Date().toISOString().replace(/[:.]/g, "-")}.jpg`;

      // Explicitly set the download attribute to the filename
      const filename = baseFilename.includes(".")
        ? baseFilename
        : `${baseFilename}.jpg`;

      // Always use the fetch approach to force download behavior
      try {
        // Fetch the image to create a blob object
        const response = await fetch(imageUrl, {
          // Adding cache control to avoid caching issues
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Network response was not ok");

        // Get content type from response if available
        const contentType =
          response.headers.get("content-type") || "image/jpeg";

        // Convert the image to a blob
        const blob = await response.blob();

        // Create a blob with explicit type to ensure download
        const fileBlob = new Blob([blob], { type: contentType });

        // Create a blob URL
        const blobUrl = URL.createObjectURL(fileBlob);

        // Create a new anchor element for each download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        link.style.display = "none";

        // Append to the document
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 100);

        console.log("Download initiated via blob");
        return; // Exit if successful
      } catch (fetchError) {
        console.warn(
          "Fetch failed, trying alternative download method:",
          fetchError,
        );
      }

      // Second approach: using an iframe
      try {
        // Create a temporary iframe
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        // Use the iframe to download
        if (iframe.contentWindow) {
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(`
            <a id="download" download="${filename}" href="${imageUrl}" target="_blank">Download</a>
          `);
          iframe.contentWindow.document.close();

          const downloadLink =
            iframe.contentWindow.document.getElementById("download");
          if (downloadLink) {
            downloadLink.click();

            // Clean up the iframe
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 100);

            console.log("Download initiated via iframe");
            return; // Exit if successful
          }
        }
        document.body.removeChild(iframe);
      } catch (iframeError) {
        console.warn("Iframe method failed, using direct method:", iframeError);
      }

      // Final fallback: direct link
      const directLink = document.createElement("a");
      directLink.href = imageUrl;
      directLink.download = filename;
      directLink.target = "_blank";
      directLink.rel = "noopener noreferrer";
      directLink.style.display = "none";
      document.body.appendChild(directLink);
      directLink.click();

      setTimeout(() => {
        document.body.removeChild(directLink);
      }, 100);

      console.log("Download initiated via direct link");
    } catch (error) {
      console.error("Error downloading image:", error);

      // As a last resort, open in new tab with instructions
      window.open(imageUrl, "_blank");
      alert(
        "Right-click on the image and select 'Save Image As...' to download",
      );
    }
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
