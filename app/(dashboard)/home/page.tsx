"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
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

const ASTRIA_BASEURL = "https://api.astria.ai";

interface Model {
  _id: string;
  name: string;
  model_id: string;
}

export default function Home() {
  const { user } = useUser();
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedClothingId, setSelectedClothingId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [inferenceId, setInferenceId] = useState<string>("");
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch user's models and clothing items from Convex
  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id || "",
  });

  const clothingItems = useQuery(api.clothing_items.listUserClothingItems, {
    user_id: user?.id || "",
  });

  // Debug logging
  useEffect(() => {
    if (clothingItems) {
      console.log("Clothing items:", clothingItems);
      console.log(
        "Filtered items:",
        clothingItems.filter((item) => item.status === "finished"),
      );
    }
  }, [clothingItems]);

  const checkInferenceStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/try-on/status/${id}`);

      if (!response.ok) {
        throw new Error("Failed to check inference status");
      }

      const data = await response.json();
      if (data.status === "completed" && data.image_url) {
        setResults([data.image_url]);
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
      } else if (data.status === "failed") {
        toast.error("Generation failed");
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
      }
    } catch (error) {
      console.error("Error checking inference status:", error);
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
      toast.error("Failed to check generation status");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    // Find the selected model and clothing item
    const selectedModel = models?.find(
      (model) => model._id === selectedModelId,
    );
    const selectedClothing = clothingItems?.find(
      (item) => item._id === selectedClothingId,
    );

    if (!selectedModel?.lora_id || !selectedClothing?.face_id) {
      toast.error("Please select both a model and a clothing item");
      setLoading(false);
      return;
    }

    // Format the IDs correctly
    const loraId = `<lora:${selectedModel.lora_id}:1.0>`;
    const faceId = `<faceid:${selectedClothing.face_id}:1.0>`;
    const fullPrompt = `${loraId} ${faceId} model flux shirt ${prompt}`;

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
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setResults(data.image_urls);
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

  useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [pollInterval]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="modelSelect">Select Model</Label>
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
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
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clothingSelect">Select Clothing</Label>
            <Select
              value={selectedClothingId}
              onValueChange={setSelectedClothingId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a clothing item" />
              </SelectTrigger>
              <SelectContent>
                {clothingItems?.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    Face ID: {item.face_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="man wearing this shirt with jeans, fashion editorial plain pink background"
              className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
              required
            />
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {results.map((url, index) => (
                <div key={index} className="relative aspect-[3/4]">
                  <Image
                    src={url}
                    alt={`Try-on Result ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            disabled={
              loading || !selectedModelId || !selectedClothingId || !prompt
            }
          >
            {loading ? "Generating..." : "Generate Try-on"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
