import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function useInitializeUser() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;
  
  const initializeUserCredits = useMutation(api.credits.initializeUserCredits);
  const existingCredits = useQuery(
    api.credits.getUserCredits,
    userId ? { user_id: userId } : "skip"
  );
  
  useEffect(() => {
    // Only run if user is loaded and we have a userId
    if (isLoaded && userId && existingCredits === undefined) {
      // Initialize with zero credits - user will get credits after payment
      initializeUserCredits({
        user_id: userId,
        model_credits: 0,
        clothing_credits: 0,
        generation_credits: 0
      });
    }
  }, [isLoaded, userId, existingCredits, initializeUserCredits]);
}