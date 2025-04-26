"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
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
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedClothingId, setSelectedClothingId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>(
    "fashion editorial, posing like a model, grey background",
  );
  const [loading, setLoading] = useState(false);
  const [numImages, setNumImages] = useState<number>(2);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Fetch user's models from Convex
  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id || "",
  });

  // Fetch clothing items to get the face_id
  const clothingItems = useQuery(api.clothing_items.listUserClothingItems, {
    user_id: user?.id || "",
  });

  // Add mutations for credits
  const checkClothingCredits = useQuery(api.credits.checkCreditSufficiency, {
    user_id: user?.id || "",
    clothingCreditsNeeded: 1,
    modelCreditsNeeded: 0,
    generationCreditsNeeded: 0,
  });

  const checkGenerationCredits = useQuery(api.credits.checkCreditSufficiency, {
    user_id: user?.id || "",
    generationCreditsNeeded: numImages,
    modelCreditsNeeded: 0,
    clothingCreditsNeeded: 0,
  });

  const deductClothingCredit = useMutation(api.credits.deductClothingCredit);
  const deductGenerationCredits = useMutation(
    api.credits.deductGenerationCredits,
  );

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

    // Check if user has enough generation credits
    if (!checkGenerationCredits) {
      toast.error(`You need ${numImages} generation credits`);
      setLoading(false);
      return;
    }

    // Format the IDs correctly
    const loraId = `<lora:${selectedModel.lora_id}:1.0>`;
    const faceId = `<faceid:${selectedClothing.face_id}:1.0>`;
    const garmentType = selectedClothing.class || "clothing";
    const formattedGarmentType = garmentType.replace(/_/g, " ");
    const modelGender = selectedModel.gender || "person";
    const fullPrompt = `${loraId} ${faceId} ${modelGender} model flux ${formattedGarmentType} ${prompt} waist up`;

    console.log("Sending request with prompt:", fullPrompt);

    try {
      // Deduct generation credits based on number of images requested
      await deductGenerationCredits({
        user_id: user?.id || "",
        count: numImages,
      });

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
          num_images: numImages,
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
      if (error instanceof Error && error.message.includes("Insufficient")) {
        toast.error(error.message);
      } else {
        toast.error("Failed to generate try-on image");
      }
    } finally {
      setLoading(false);
    }
  };

  // For clothing upload - add this to your clothing upload handler
  const handleClothingUpload = async (clothingImageUrl: string) => {
    try {
      console.log("Checking credits for clothing upload:", clothingImageUrl);

      // Check if user has enough clothing credits
      if (!checkClothingCredits) {
        toast.error("You don't have enough clothing credits");
        return false;
      }

      // Deduct one clothing credit
      await deductClothingCredit({
        user_id: user?.id || "",
      });

      // Continue with clothing upload...

      return true;
    } catch (error) {
      console.error("Error during clothing upload:", error);
      toast.error("Failed to upload clothing item");
      return false;
    }
  };

  // Mobile notification banner component
  const MobileBanner = () => (
    <Card className=" w-full py-4 text-center p-6 rounded-sm flex flex-col items-center bg-purple-600 shadow-lg shadow-black/40 border-none mb-4">
      <h2 className="text-lg font-semibold mb-2 text-white">
        Mobile Experience Limited
      </h2>
      <p className="text-white text-md">
        To try on clothes and use all features, please visit Trizzy on desktop.
      </p>
    </Card>
  );

  return (
    <div className="flex flex-1 h-full flex-col md:flex-row">
      {/* Left column - Form section (hidden on mobile, visible on desktop) */}
      {!isMobile && (
        <div className="w-full md:w-[350px] p-4">
          <Card className="p-4 rounded-sm sticky" style={{ top: "4rem" }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="modelSelect" className="">
                  Select Model
                </Label>
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
                    <SelectItem
                      value="create-new"
                      className="border-t mt-2 pt-2"
                    >
                      + Create new model
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <ClothingSelector
                  selectedClothingId={selectedClothingId}
                  onClothingSelect={setSelectedClothingId}
                  onClothingUpload={handleClothingUpload}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">
                  Give me {numImages} {numImages === 1 ? "image" : "images"}
                </Label>
                <Slider
                  value={[numImages]}
                  onValueChange={(value) => setNumImages(value[0])}
                  min={1}
                  max={4}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>

                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full rounded-sm border border-input bg-background px-3 py-2 min-h-[100px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Please update the prompt above to your choosing
                </p>
              </div>

              <Button
                className="w-full"
                type="submit"
                disabled={
                  loading ||
                  !selectedModelId ||
                  !selectedClothingId ||
                  !prompt ||
                  numImages < 1
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
      )}

      {/* Right column - Results (full width on mobile) */}
      <div className="flex-1 h-full py-4 px-4 md:pr-4 md:pl-0 flex flex-col">
        {/* Mobile banner only shown on mobile devices */}
        {isMobile && <MobileBanner />}
        <Card className="w-full h-full rounded-sm bg-sidebar">
          <Gallery />
        </Card>
      </div>
    </div>
  );
}
