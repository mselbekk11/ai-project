"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { ImageUpload } from "@/components/image-upload";
import { useUser } from "@clerk/nextjs";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { Upload, Trash2, Loader2 } from "lucide-react";
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

export default function Home() {
  // const router = useRouter();
  const { user } = useUser();
  const [modelName, setModelName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("Male");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] =
    useState<Id<"headshot_models"> | null>(null);

  const models = useQuery(api.headshot_models.listUserModels, {
    user_id: user?.id ?? "",
  });

  const deleteModel = useMutation(api.headshot_models.deleteHeadshotModel);

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

  const imageUrls = [
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAzDKIkphjb6xpPYIw2ZvA4Ry7ndSkB5eg9KGm",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIApoBJ8IAD2Z7AjUfI91Pk4O0MiaCzJxNlbtLm",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAH2STNt6VQk7cayU4jBhJTP6Rvs2mXG0q95nd",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAZsceIgR4ucyrXYGtDN9MT4Fj0nIeHif218aw",
    },
  ];

  const badImageUrls = [
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIApHSci9vAD2Z7AjUfI91Pk4O0MiaCzJxNlbtL",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIA1aDa67UBSu0Ulsp478qzCKALVMacHmG3yJFb",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIAV1AUqkWwA4x2fJcqlWTnUK5d8Brbt3ODMZip",
    },
    {
      url: "https://7gjsu8414g.ufs.sh/f/hdGLEyqzBbIA5125fhog5Y7Vf4SZFxrpIRKDjTBU3XoatczO",
    },
  ];

  return (
    <div className="flex flex-1 h-full">
      <div className="w-[30%] p-4">
        <Card className="p-6 rounded-md mb-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              {/* <h2 className="text-1xl font-bold text-purple-700 mb-4">
                Train Model
              </h2> */}
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
              disabled={loading || !modelName || images.length === 0}
            >
              {loading ? "Training..." : "Train Model"}
            </Button>
          </form>
        </Card>
        <Card className="rounded-md mb-4  border-2 bg-sidebar">
          <CardHeader>
            <CardTitle className="text-md  font-semibold font-heading text-indigo-700">
              Choose good pictures
            </CardTitle>
            <CardDescription className="text-sm">
              5-10 high quality images, front-facing, 1 person in the frame,
              variety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {imageUrls.map((item, idx) => (
                <div key={idx}>
                  <Image
                    src={item.url}
                    alt={`Image ${idx + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-md mb-4  border-2 bg-sidebar">
          <CardHeader>
            <CardTitle className="text-md  font-semibold font-heading text-indigo-700">
              Examples of bad pictures
            </CardTitle>
            <CardDescription className="text-sm">
              Multiple people, blurry, uncropped, low quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {badImageUrls.map((item, idx) => (
                <div key={idx}>
                  <Image
                    src={item.url}
                    alt={`Image ${idx + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-[70%] pr-4 py-4">
        <Card className="rounded-md ">
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
