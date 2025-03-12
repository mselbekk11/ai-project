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
  const [loraId, setLoraId] = useState<string>("");
  const [faceId, setFaceId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [inferenceId, setInferenceId] = useState<string>("");
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch user's models from Convex
  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id || "",
  });

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
            <Label htmlFor="loraId">Lora ID</Label>
            <input
              id="loraId"
              value={loraId}
              onChange={(e) => setLoraId(e.target.value)}
              placeholder="<lora:2228921:1.0>"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faceId">Face ID</Label>
            <input
              id="faceId"
              value={faceId}
              onChange={(e) => setFaceId(e.target.value)}
              placeholder="<faceid:2228794:1.0>"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
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
            disabled={loading || !loraId || !faceId || !prompt}
          >
            {loading ? "Generating..." : "Generate Try-on"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
