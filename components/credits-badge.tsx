"use client";

import { CuboidIcon as CubeIcon, ShirtIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function CreditsBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const userId = user?.id || "";

  const credits = useQuery(api.credits.getUserCredits, { user_id: userId });

  // Calculate total credits
  const totalCredits = credits
    ? credits.model_credits +
      credits.clothing_credits +
      credits.generation_credits
    : 0;

  if (!credits) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading credits...</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-border/40 bg-background/50 px-3"
              >
                <SparklesIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{totalCredits}</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Your credits
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-64 p-0" align="end">
          <div className="flex flex-col space-y-1 p-3">
            <h4 className="text-sm font-medium">Your Credits</h4>
            <p className="text-xs text-muted-foreground">
              Available credits for your account
            </p>
          </div>
          <div className="border-t p-3">
            <div className="grid gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CubeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Model Credits</span>
                </div>
                <Badge variant="secondary" className="font-normal">
                  {credits.model_credits}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShirtIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Clothing Credits</span>
                </div>
                <Badge variant="secondary" className="font-normal">
                  {credits.clothing_credits}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Generation Credits</span>
                </div>
                <Badge variant="secondary" className="font-normal">
                  {credits.generation_credits}
                </Badge>
              </div>
            </div>
          </div>
          <div className="border-t p-3">
            <Link href="/credits">
              <Button size="sm" className="w-full">
                Buy More Credits
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
