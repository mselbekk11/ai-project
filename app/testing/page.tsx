"use client";

import { OnboardingLayout } from "@/components/onboarding-layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
// import { ImageUpload } from "@/components/image-upload";
import { useUser } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { Upload } from "lucide-react";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TestingPage() {
  const { user } = useUser();
  const [modelName, setModelName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("Male");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleSubmit() {
    console.log("test");
  }

  return (
    <OnboardingLayout>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Welcome to Trizzy!</h2>
          <h3 className="text-md text-gray-500">
            Please upload 5-10 images of yourself to get started.
          </h3>
          <h3 className="text-md text-gray-500">
            Once your model is trained, you can start to try on clothes
          </h3>
        </div>
        <Card className="p-6 rounded-md mb-4">
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
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Training Images</Label>
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (!res) {
                    console.error("No response from upload");
                    toast.error("Upload failed - no response");
                    return;
                  }
                  console.log("🎯 Upload complete!", res);
                  const newUrls = res.map((file) => file.url);
                  console.log("📦 Received URLs:", newUrls);
                  setImages((prev) => {
                    const updated = [...prev, ...newUrls];
                    console.log("✅ Updated images:", updated);
                    return updated;
                  });

                  // Only show success notification
                  if (res.length > 0) {
                    toast.success(`Successfully uploaded ${res.length} images`);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("❌ Upload error:", error);

                  if (error.message.includes("Headers Timeout")) {
                    toast.error(
                      "Upload timed out. Please try again with a smaller file or better connection.",
                    );
                  } else {
                    toast.error(`Upload failed: ${error.message}`);
                  }
                }}
                onUploadBegin={(fileName) => {
                  console.log("🚀 Upload beginning for:", fileName);
                  // Don't show any toast for upload start
                }}
                config={{
                  mode: "auto",
                  appendOnPaste: true,
                }}
                className="ut-label:text-md border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-md ut-label:text-xs ut-allowed-content:text-xs"
                appearance={{
                  container: {
                    padding: "1rem",
                  },
                  button: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    fontSize: "0.775rem",
                    fontWeight: "600",
                  },
                  label: {
                    color: "inherit",
                  },
                }}
                content={{
                  uploadIcon: () => <Upload />,
                  label: "Drop your training images",
                  allowedContent: "Supported formats: JPG, PNG, WEBP",
                }}
              />
              <p className="text-xs">Max 20 images | 4MB</p>
            </div>

            {images.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Upload ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== index))
                        }
                        className="absolute top-2 right-2 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !modelName || images.length === 0}
            >
              {loading ? "Training..." : "Train Model"}
            </Button>
          </form>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
