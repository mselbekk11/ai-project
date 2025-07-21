"use client";
import Image from "next/image";
import { format } from "date-fns";
import { Download, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getProxiedImageUrl } from "@/utils/image-proxy";

interface ImageSheetProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageUrl2: string;
  prompt: string;
  modelName: string;
  itemOfClothing: string;
  createdAt: Date;
  onDelete: () => void;
  onDownload: () => void;
}

export default function ImageSheet({
  isOpen,
  onClose,
  imageUrl,
  prompt,
  modelName,
  itemOfClothing,
  createdAt,
  onDelete,
  onDownload,
  imageUrl2,
}: ImageSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="p-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 pb-24">
          <SheetHeader className="space-y-4">
            <SheetTitle className="text-xl">{modelName}</SheetTitle>
            <div
              className="w-full relative rounded-md overflow-hidden"
              style={{ aspectRatio: "768/1280" }}
            >
              <Image
                src={imageUrl ? getProxiedImageUrl(imageUrl) : "/placeholder.svg"}
                alt={prompt}
                fill
                className="object-cover"
              />
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold">Prompt</div>
                <div className="text-sm">{prompt}</div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm font-semibold">Model Name</div>
                  <div className="text-sm">{modelName}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Created</div>
                  <div className="text-sm">
                    {format(createdAt, "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Item of Clothing</div>
                {/* <div className="text-sm">{itemOfClothing}</div> */}
                <div className="flex">
                  <Image
                    src={imageUrl2 ? getProxiedImageUrl(imageUrl2) : "/placeholder.svg"}
                    alt={itemOfClothing}
                    className="rounded-md"
                    width={60}
                    height={60}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <div className="flex-col items-center space-y-2">
            <Button variant="outline" onClick={onDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="destructive" onClick={onDelete} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Image
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
