import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/utils/uploadthing";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { cn } from "@/lib/utils";

interface ClothingSelectorProps {
  selectedClothingId: string;
  onClothingSelect: (id: string) => void;
}

export default function ClothingSelector({
  selectedClothingId,
  onClothingSelect,
}: ClothingSelectorProps) {
  const { user } = useUser();
  const createClothingItem = useMutation(api.clothing_items.createClothingItem);
  const clothingItems = useQuery(api.clothing_items.listUserClothingItems, {
    user_id: user?.id ?? "",
  });

  const [loading, setLoading] = useState(false);
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

      // Save to database
      if (user) {
        const result = await createClothingItem({
          user_id: user.id,
          face_id: data.garment_id,
          image_url: imageUrl,
        });

        // Automatically select the newly created item
        onClothingSelect(result);
      }

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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Upload New Clothing or Select Existing</Label>
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
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
            label: loading
              ? "Processing..."
              : "Drop clothing image or click to browse",
            allowedContent: "Supported formats: JPG, PNG, WEBP",
          }}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
          <p className="text-red-600 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Display clothing items in a grid */}
      {clothingItems && clothingItems.length > 0 && (
        <Card>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {clothingItems.map((item) => (
              <div
                key={item._id}
                className={cn(
                  "relative w-full aspect-square cursor-pointer rounded-lg overflow-hidden border-2",
                  selectedClothingId === item._id
                    ? "border-primary"
                    : "border-transparent hover:border-primary/50",
                )}
                onClick={() => onClothingSelect(item._id)}
              >
                <Image
                  src={item.image_url}
                  alt="Clothing"
                  fill
                  className="object-cover"
                />
                {selectedClothingId === item._id && (
                  <div className="absolute inset-0 bg-primary/20" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
