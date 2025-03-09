"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing";

interface ImageUploadProps {
  onChange: (urls: string[]) => void;
  maxImages?: number;
  value: string[];
}

export function ImageUpload({
  onChange,
  maxImages = 20,
  value = [],
}: ImageUploadProps) {
  const [urls, setUrls] = useState<string[]>(value);

  const removeImage = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res) {
            const newUrls = [...urls, ...res.map((r) => r.url)];
            setUrls(newUrls);
            onChange(newUrls);
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          alert("Upload failed: " + error.message);
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${urls.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}`}
      />

      <p className="text-sm text-gray-500 mt-2">
        {urls.length}/{maxImages} images uploaded
      </p>

      {urls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {urls.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
