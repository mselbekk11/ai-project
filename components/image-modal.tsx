"use client";
import Image from "next/image";
import { format } from "date-fns";
import { Download, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
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

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  prompt,
  modelName,
  itemOfClothing,
  createdAt,
  onDelete,
  onDownload,
}: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-black border-zinc-800 text-white p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0 flex justify-between items-start">
          <DialogTitle className="text-white text-base font-normal">
            {prompt}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={prompt}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div>
              <div className="text-zinc-400 text-sm">Prompt</div>
              <div className="text-white">{prompt}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-zinc-400 text-sm">Model Name</div>
                <div className="text-white">{modelName}</div>
              </div>
              <div>
                <div className="text-zinc-400 text-sm">Created</div>
                <div className="text-white">
                  {format(createdAt, "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>

            <div>
              <div className="text-zinc-400 text-sm">Item of Clothing</div>
              <div className="text-white">{itemOfClothing}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="destructive"
              onClick={onDelete}
              className="bg-red-900 hover:bg-red-800 text-white border-none"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Image
            </Button>
            <Button
              variant="outline"
              onClick={onDownload}
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
