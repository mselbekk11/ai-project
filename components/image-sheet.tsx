"use client";
import Image from "next/image";
import { format } from "date-fns";
import { Download, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ImageSheetProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
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
}: ImageSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className=" overflow-y-auto">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-xl">{modelName}</SheetTitle>
          <div
            className="w-full relative rounded-md overflow-hidden"
            style={{ aspectRatio: "768/1280" }}
          >
            <Image
              src={imageUrl || "/placeholder.svg"}
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
              <div className="text-sm font-semibold">Item of Clothing</div>
              <div className="text-sm">{itemOfClothing}</div>
            </div>
          </div>

          <SheetFooter className="flex-col items-center">
            <Button
              variant="destructive"
              onClick={onDelete}
              className="w-full "
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Image
            </Button>
            <Button variant="outline" onClick={onDownload} className="w-full ">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
