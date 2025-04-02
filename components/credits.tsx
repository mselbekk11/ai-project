"use client";

import { Box, Images, Shirt } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function Credits() {
  const { user } = useUser();
  const userId = user?.id || "";

  const credits = useQuery(api.credits.getUserCredits, { user_id: userId });

  if (!credits) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading credits...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center mr-2">
        <Box size={18} className="mr-1" color="#af40e2" />
        <p className="text-md font-semibold">{credits.model_credits}</p>
      </div>
      <div className="flex items-center mr-2">
        <Shirt size={18} className="mr-1" color="#af40e2" />
        <p className="text-md font-semibold">{credits.clothing_credits}</p>
      </div>
      <div className="flex items-center">
        <Images size={18} className="mr-1" color="#af40e2" />
        <p className="text-md font-semibold">{credits.generation_credits}</p>
      </div>
    </div>
  );
}
