"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/utils/uploadthing";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function ClothingUpload() {
  const [clothingImage, setClothingImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [garmentId, setGarmentId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleGarmentUpload = async (imageUrl: string) => {
    setLoading(true);
    setError("");

    try {
      console.log("Starting garment upload for URL:", imageUrl);

      const response = await fetch("/api/garment-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clothing_url: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload garment");
      }

      setGarmentId(data.garment_id);
      toast.success("Garment uploaded and training started!");

      if (!data.is_trained) {
        toast.info(`Training in progress. Estimated time: ${data.eta} minutes`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload garment";
      console.error("Error during garment upload:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Upload Clothing Image</Label>
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setClothingImage(res[0].url);
                  handleGarmentUpload(res[0].url);
                  toast.success("Image uploaded successfully!");
                }
              }}
              onUploadError={(error: Error) => {
                const errorMessage = `Upload error: ${error.message}`;
                setError(errorMessage);
                toast.error(errorMessage);
              }}
              className="ut-label:text-md ut-allowed-content:text-sm border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-lg"
              appearance={{
                container: { padding: "1rem" },
                button: {
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  fontSize: "0.875rem",
                },
              }}
              content={{
                uploadIcon: () => <Upload />,
                label: loading ? "Processing..." : "Drop clothing image",
                allowedContent: "Supported formats: JPG, PNG, WEBP",
              }}
            />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
              <p className="text-red-600 dark:text-red-200">{error}</p>
            </div>
          )}

          {clothingImage && (
            <div className="space-y-2">
              <Label>Uploaded Garment</Label>
              <div className="relative w-40 h-40">
                <Image
                  src={clothingImage}
                  alt="Clothing"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          {garmentId && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <p>Garment ID: {garmentId}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Save this ID for use in try-on generation
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
