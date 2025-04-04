import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Extract user and credit information from metadata
      const userId = session.metadata?.userId;
      const modelCredits = parseInt(session.metadata?.model_credits || "0");
      const clothingCredits = parseInt(session.metadata?.clothing_credits || "0");
      const generationCredits = parseInt(session.metadata?.generation_credits || "0");
      const isOnboarding = session.metadata?.isOnboarding === "true";
      
      if (!userId) {
        throw new Error("User ID not found in session metadata");
      }
      
      // Initialize Convex client
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      
      // If it's onboarding, initialize user credits
      if (isOnboarding) {
        await convex.mutation(api.credits.initializeUserCredits, {
          user_id: userId,
          model_credits: modelCredits,
          clothing_credits: clothingCredits,
          generation_credits: generationCredits,
        });
      } else {
        // For top-ups, add credits to existing account
        await convex.mutation(api.credits.updateCredits, {
          user_id: userId,
          model_credits: modelCredits,
          clothing_credits: clothingCredits,
          generation_credits: generationCredits,
        });
      }
      
      console.log(`Credits added for user ${userId}`);
      
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Error processing successful payment:", error);
      return NextResponse.json(
        { error: "Error processing payment" },
        { status: 500 }
      );
    }
  }
  
  return NextResponse.json({ received: true });
}