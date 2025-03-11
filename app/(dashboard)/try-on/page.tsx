"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const ASTRIA_BASEURL = "https://api.astria.ai";

interface Model {
  _id: string;
  name: string;
  model_id: string;
}

export default function TryOn() {
  const { user } = useUser();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [clothingImage, setClothingImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [inferenceId, setInferenceId] = useState<string>("");
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch user's models from Convex
  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id || "",
  });

  const checkInferenceStatus = async (id: string) => {
    try {
      const response = await fetch(`${ASTRIA_BASEURL}/inference/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ASTRIA_API_KEY}`,
        },
      });

      if (!response.ok) throw new Error("Failed to check status");

      const data = await response.json();

      if (data.status === "completed") {
        setResult(data.image_url);
        if (pollInterval) clearInterval(pollInterval);
        setLoading(false);
        toast.success("Try-on image generated successfully!");
      } else if (data.status === "failed") {
        if (pollInterval) clearInterval(pollInterval);
        setLoading(false);
        toast.error("Generation failed");
      }
    } catch (error) {
      console.error("Status check error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/try-on", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_id: selectedModel,
          clothing_url: clothingImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate try-on image");
      }

      const data = await response.json();

      if (data.inference_id) {
        setInferenceId(data.inference_id);
        // Start polling for results
        const interval = setInterval(
          () => checkInferenceStatus(data.inference_id),
          5000,
        );
        setPollInterval(interval);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate try-on image");
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
            <Label htmlFor="model">Select Model</Label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Select a model</option>
              {models?.map((model) => (
                <option key={model._id} value={model.model_id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Upload Clothing Image</Label>
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setClothingImage(res[0].url);
                  toast.success("Clothing image uploaded!");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload error: ${error.message}`);
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
                label: "Drop clothing image",
                allowedContent: "Supported formats: JPG, PNG, WEBP",
              }}
            />
          </div>

          {clothingImage && (
            <div className="space-y-2">
              <Label>Selected Clothing</Label>
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

          {result && (
            <div className="space-y-2">
              <Label>Result</Label>
              <div className="relative w-full h-96">
                <Image
                  src={result}
                  alt="Try-on Result"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !selectedModel || !clothingImage}
          >
            {loading ? "Generating..." : "Generate Try-on"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
