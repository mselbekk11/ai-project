"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload"; // We'll create this component next

export default function Home() {
  const [modelName, setModelName] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submission started"); // Debug log

    try {
      const formData = new FormData();
      formData.append("modelName", modelName);
      images.forEach((image) => {
        formData.append("images", image);
      });

      console.log("Sending request to API..."); // Debug log
      const response = await fetch("/api/train-model", {
        method: "POST",
        body: formData,
      });

      console.log("Response received:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to train model");
      }

      const data = await response.json();
      console.log("Success:", data); // Debug log
      alert("Model training started successfully!"); // Temporary success message
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to train model"); // Temporary error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="modelName">Model Name</Label>
            <Input
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter your model name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Training Images</Label>
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={20} // Adjust based on Astria's requirements
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !modelName || images.length === 0}
          >
            {loading ? "Training..." : "Train Model"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
