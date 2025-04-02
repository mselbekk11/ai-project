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
      // Initialize with default credits (new user or first login)
      initializeUserCredits({
        user_id: userId,
        model_credits: 3,     // Give 3 model credits 
        clothing_credits: 5,  // Give 5 clothing credits
        generation_credits: 10 // Give 10 generation credits
      });
    }
  }, [isLoaded, userId, existingCredits, initializeUserCredits]);
}