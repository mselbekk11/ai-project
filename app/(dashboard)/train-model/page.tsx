"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { Upload, Trash2, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import InfoFive from "@/components/info-five";
import GoodPictures from "@/components/good-pictures";
import BadPictures from "@/components/bad-pictures";

export default function Home() {
  const { user } = useUser();
  const [modelName, setModelName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("Male");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] =
    useState<Id<"headshot_models"> | null>(null);

  // Track data loading state
  const [isDataLoading, setIsDataLoading] = useState(true);

  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id ?? "",
  });

  const deleteModel = useMutation(api.headshot_models.deleteHeadshotModel);

  // Update loading state when models data is available
  useEffect(() => {
    if (models !== undefined) {
      setIsDataLoading(false);
    }
  }, [models]);

  // Helper function to convert UploadThing URL to ufsUrl format if needed
  const convertToUfsUrl = (url: string): string => {
    if (url.includes("ufs.sh")) return url; // Already in ufsUrl format

    // Extract the file key from the URL (last part after the slash)
    const fileKey = url.split("/").pop();
    if (!fileKey) return url; // Return original if we can't parse

    // Convert to the format seen in the logs
    return `https://7gjsu8414g.ufs.sh/f/${fileKey}`;
  };

  const handleDeleteClick = (modelId: Id<"headshot_models">) => {
    setModelToDelete(modelId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!modelToDelete) return;

    try {
      await deleteModel({ modelId: modelToDelete });
      toast.success("Model deleted successfully");
    } catch (error) {
      console.error("Error deleting model:", error);
      toast.error("Failed to delete model");
    } finally {
      setDeleteDialogOpen(false);
      setModelToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submission started"); // Debug log

    try {
      // We may still need to convert URLs for your API endpoint
      const formattedImageUrls = images.map((url) => {
        // Only convert if not already in the correct format
        return url.includes("ufs.sh") ? url : convertToUfsUrl(url);
      });

      const formData = {
        modelName,
        gender,
        user_id: user?.id || "",
        imageUrls: formattedImageUrls,
        webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL,
      };

      console.log("Sending request to API...");
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
      setGender("Male");
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
      <div className="w-[30%] p-4">
        <Card className="p-4 rounded-sm mb-4">
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

                  // Simple URL extraction, matching your working project approach
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
                className="ut-label:text-md border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-sm ut-label:text-xs ut-allowed-content:text-xs"
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
                        className="w-full object-cover rounded-sm"
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
              className="w-full"
              type="submit"
              disabled={loading || !modelName || images.length === 0}
            >
              {loading ? "Training..." : "Train Model"}
            </Button>
          </form>
        </Card>
        <GoodPictures />
        <BadPictures />
      </div>
      <div className="w-[70%] h-full pr-4 py-4">
        {isDataLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-[#7B29FB]" />
          </div>
        ) : models && models.length > 0 ? (
          <Card className="rounded-sm ">
            <div className="bg-sidebar rounded-md">
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
                    <TableHead className="h-12 px-4 text-sm font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-b ">
                  {models.map((model) => (
                    <TableRow key={model._id} className="border-b hover">
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
                      <TableCell className="py-0 h-12 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(model._id)}
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="rounded-sm h-full bg-sidebar flex items-start justify-center">
            <InfoFive />
          </Card>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this model? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
