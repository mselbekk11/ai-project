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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClothingSelectorProps {
  selectedClothingId: string;
  onClothingSelect: (id: string) => void;
}

const GARMENT_TYPES = [
  { value: "clothing", label: "Generic Clothing" },
  { value: "shirt", label: "Shirt" },
  { value: "pants", label: "Pants" },
  { value: "coat", label: "Coat" },
  { value: "swimming_suit", label: "Swimming Suit" },
] as const;

type GarmentType = (typeof GARMENT_TYPES)[number]["value"];

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
  const [pendingUpload, setPendingUpload] = useState<{
    url: string;
    type: GarmentType | null;
  } | null>(null);

  const handleGarmentUpload = async (imageUrl: string) => {
    // Instead of immediately training, store the URL and show the type selector
    setPendingUpload({ url: imageUrl, type: null });
    toast.success(
      "Image uploaded! Please select the garment type to begin training.",
    );
  };

  const handleTrainGarment = async () => {
    if (!pendingUpload || !pendingUpload.type) {
      toast.error("Please select a garment type first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Starting garment training for:", {
        url: pendingUpload.url,
        type: pendingUpload.type,
      });

      const response = await fetch("/api/garment-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clothing_url: pendingUpload.url,
          garment_type: pendingUpload.type,
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
          image_url: pendingUpload.url,
          class: pendingUpload.type,
        });

        // Automatically select the newly created item
        onClothingSelect(result);
      }

      toast.success("Garment uploaded and training started!");

      if (!data.is_trained) {
        toast.info(`Training in progress. Estimated time: ${data.eta} minutes`);
      }

      // Clear the pending upload
      setPendingUpload(null);
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
      {!pendingUpload ? (
        <div className="space-y-2">
          <Label>Upload New Clothing or Select Existing</Label>
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                handleGarmentUpload(res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              const errorMessage = `Upload error: ${error.message}`;
              setError(errorMessage);
              toast.error(errorMessage);
            }}
            className="ut-label:text-md border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-md ut-label:text-xs ut-allowed-content:text-xs"
            appearance={{
              container: { padding: "1rem" },
              button: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                fontSize: "0.775rem",
                fontWeight: "600",
              },
            }}
            content={{
              // button: "Choose File",
              uploadIcon: () => <Upload />,
              label: loading
                ? "Processing..."
                : "Drop image or click to browse",
              allowedContent: "Supported formats: JPG, PNG, WEBP",
            }}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="aspect-square relative w-full max-w-[300px] mx-auto rounded-lg overflow-hidden">
              <Image
                src={pendingUpload.url}
                alt="Uploaded garment"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Garment Type</Label>
                <Select
                  value={pendingUpload.type ?? undefined}
                  onValueChange={(value: GarmentType) =>
                    setPendingUpload({ ...pendingUpload, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of garment" />
                  </SelectTrigger>
                  <SelectContent>
                    {GARMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleTrainGarment}
                  disabled={!pendingUpload.type || loading}
                  className="flex-1"
                >
                  {loading ? "Training..." : "Start Training"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPendingUpload(null)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
