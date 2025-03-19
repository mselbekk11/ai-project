"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { ImageUpload } from "@/components/image-upload";
import { useUser } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { Upload } from "lucide-react";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function Home() {
  // const router = useRouter();
  const { user } = useUser();
  const [modelName, setModelName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("Male");

  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id ?? "",
  });

  if (!models) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submission started"); // Debug log

    try {
      const formData = {
        modelName,
        gender,
        user_id: user?.id || "",
        imageUrls: images,
        webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL,
      };

      console.log("Sending request to API..."); // Debug log
      const response = await fetch("/api/train-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response received:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to train model");
      }

      const data = await response.json();
      console.log("Success:", data);

      // Add toast notification
      toast.success("Model training started successfully");

      // Clear the form
      setModelName("");
      setGender("male");
      setImages([]);

      // Redirect to home
      // router.push("/home");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to train model",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 h-full">
      <div className="w-[30%] border-r p-4">
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
                    toast.dismiss(); // Dismiss any loading toasts
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
                  toast.dismiss(); // Dismiss any loading toasts
                  toast.success(`Successfully uploaded ${res.length} images`);
                }}
                onUploadError={(error: Error) => {
                  console.error("❌ Upload error:", error);
                  toast.dismiss(); // Dismiss any loading toasts
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
                  const toastId = `upload-${fileName}-${Date.now()}`;
                  toast.loading(`Uploading ${fileName}...`, {
                    id: toastId,
                    duration: 0, // Toast will stay until dismissed
                  });
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
              disabled={loading || !modelName || images.length === 0}
            >
              {loading ? "Training..." : "Train Model"}
            </Button>
          </form>
        </Card>
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Choose good pictures</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="w-[70%]">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="h-12 px-4 text-sm  font-semibold">
                Name
              </TableHead>
              <TableHead className="h-12 px-4 text-sm font-semibold">
                Status
              </TableHead>
              <TableHead className="h-12 px-4 text-sm font-semibold">
                Type
              </TableHead>
              {/* <TableHead className="h-12 px-4 text-sm font-semibold">
                Lora ID
              </TableHead> */}
              <TableHead className="h-12 px-4 text-sm font-semibold">
                Images
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-b ">
            {models.map((model) => (
              <TableRow key={model._id} className="border-b  hover">
                <TableCell className="py-0 h-12 px-4 text-sm">
                  {model.name}
                </TableCell>
                <TableCell className="py-0 h-12 px-4">
                  <Badge
                    className={`${model.status !== "processing" ? "bg-green-500 hover:bg-green-600" : ""}`}
                  >
                    {model.status === "processing" ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        processing
                      </>
                    ) : (
                      (model.status ?? "processing")
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="py-0 h-12 px-4 text-sm">
                  {model.gender ?? "unknown"}
                </TableCell>
                {/* <TableCell className="py-0 h-12 px-4 text-sm">
                  {model.lora_id ? `${model.lora_id}` : "N/A"}
                </TableCell> */}
                <TableCell className="py-0 h-12 px-4">
                  <div className="flex items-center">
                    {model.images.slice(0, 3).map((image, index) => (
                      <Avatar
                        key={index}
                        className={`w-6 h-6 border  ${index > 0 ? "-ml-2" : ""}`}
                      >
                        <AvatarImage src={image} alt="Sample image" />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                    ))}
                    {model.images.length > 3 && (
                      <Avatar className="w-6 h-6 -ml-2 ">
                        <AvatarFallback className="text-xs">
                          +{model.images.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
