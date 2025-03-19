"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClothingSelector from "@/components/ClothingSelector";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Gallery from "@/components/Gallery";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedClothingId, setSelectedClothingId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>(
    "fashion editorial, posing like a model, grey background",
  );
  const [loading, setLoading] = useState(false);

  // Fetch user's models from Convex
  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id || "",
  });

  // Fetch clothing items to get the face_id
  const clothingItems = useQuery(api.clothing_items.listUserClothingItems, {
    user_id: user?.id || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");
    setLoading(true);

    // Find the selected model and clothing item
    const selectedModel = models?.find(
      (model) => model._id === selectedModelId,
    );
    const selectedClothing = clothingItems?.find(
      (item) => item._id === selectedClothingId,
    );

    console.log("Selected model:", selectedModel);
    console.log("Selected clothing:", selectedClothing);

    if (!selectedModel?.lora_id || !selectedClothing?.face_id) {
      console.log("Validation failed - missing model or clothing", {
        hasModelLoraId: !!selectedModel?.lora_id,
        hasClothingFaceId: !!selectedClothing?.face_id,
      });
      toast.error("Please select both a model and a clothing item");
      setLoading(false);
      return;
    }

    // Format the IDs correctly
    const loraId = `<lora:${selectedModel.lora_id}:1.0>`;
    const faceId = `<faceid:${selectedClothing.face_id}:1.0>`;
    const garmentType = selectedClothing.class || "clothing"; // Get the garment type from the database
    const formattedGarmentType = garmentType.replace(/_/g, " "); // Format it for the prompt (e.g., "swimming suit")
    const modelGender = selectedModel.gender || "person"; // Use "person" as fallback if gender is not specified
    const fullPrompt = `${loraId} ${faceId} ${modelGender} model flux ${formattedGarmentType} ${prompt}`;

    console.log("Sending request with prompt:", fullPrompt);

    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          super_resolution: true,
          inpaint_faces: true,
          hires_fix: true,
          ar: "1:1",
          w: 768,
          h: 1280,
          face_id: selectedClothing.face_id,
          lora_id: selectedModel.lora_id,
          user_id: user?.id,
          image_url: selectedClothing.image_url,
          gender: selectedModel.gender || "unknown",
          clothing_item_id: selectedClothing._id,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Handle successful response
      } else {
        toast.error(data.error || "Failed to generate try-on image");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate try-on image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 h-full">
      {/* Left column - Form section (30% width) */}
      <div className="w-[30%] border-r p-4">
        <Card className="p-6 rounded-md sticky top-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="modelSelect">Select Model</Label>
              <Select
                value={selectedModelId}
                onValueChange={(value) => {
                  if (value === "create-new") {
                    router.push("/train-model");
                    return;
                  }
                  setSelectedModelId(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models
                    ?.filter(
                      (model) => model.status === "finished" && model.lora_id,
                    )
                    .map((model) => (
                      <SelectItem key={model._id} value={model._id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  <SelectItem value="create-new" className="border-t mt-2 pt-2">
                    + Create new model
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <ClothingSelector
                selectedClothingId={selectedClothingId}
                onClothingSelect={setSelectedClothingId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>

              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                required
              />
              <p className="text-xs text-muted-foreground">
                Please update the prompt above to your choosing
              </p>
            </div>

            <Button
              type="submit"
              disabled={
                loading || !selectedModelId || !selectedClothingId || !prompt
              }
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Getting Changed
                </>
              ) : (
                "Try it on"
              )}
            </Button>
          </form>
        </Card>
      </div>

      {/* Right column - Results (70% width) */}
      <div className="w-[70%]">
        <Gallery />
      </div>
    </div>
  );
}
