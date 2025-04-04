import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    console.log("Webhook received");
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") as string;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Event verified:", event.type);
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }
    
    if (event.type === "checkout.session.completed") {
      console.log("Processing checkout.session.completed");
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract user and credit information from metadata
      const userId = session.metadata?.userId;
      console.log("User ID from metadata:", userId);
      
      if (!userId) {
        console.error("User ID not found in session metadata");
        return NextResponse.json(
          { error: "User ID not found in metadata" },
          { status: 400 }
        );
      }
      
      const modelCredits = parseInt(session.metadata?.model_credits || "0");
      const clothingCredits = parseInt(session.metadata?.clothing_credits || "0");
      const generationCredits = parseInt(session.metadata?.generation_credits || "0");
      const isOnboarding = session.metadata?.isOnboarding === "true";
      const plan = session.metadata?.plan || "unknown";
      
      console.log(`Adding credits: ${modelCredits} model, ${clothingCredits} clothing, ${generationCredits} generation`);
      
      // Initialize Convex client
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      console.log("Convex client initialized");
      
      try {
        // If it's onboarding, initialize user credits
        if (isOnboarding) {
          console.log("Initializing user credits (onboarding)");
          await convex.mutation(api.credits.initializeUserCredits, {
            user_id: userId,
            model_credits: modelCredits,
            clothing_credits: clothingCredits,
            generation_credits: generationCredits,
          });
        } else {
          console.log("Updating existing user credits");
          // For top-ups, add credits to existing account
          await convex.mutation(api.credits.updateCredits, {
            user_id: userId,
            model_credits: modelCredits,
            clothing_credits: clothingCredits,
            generation_credits: generationCredits,
          });
        }
        
        console.log("Logging transaction");
        // Log the transaction
        await convex.mutation(api.credits.logCreditTransaction, {
          user_id: userId,
          transaction_type: isOnboarding ? "initial_purchase" : "top_up",
          amount_paid: session.amount_total ? session.amount_total / 100 : 0,
          model_credits: modelCredits,
          clothing_credits: clothingCredits,
          generation_credits: generationCredits,
          source: "stripe",
          stripe_session_id: session.id,
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
          metadata: {
            plan,
            currency: session.currency,
            isOnboarding
          },
        });
        
        console.log("Transaction processed successfully");
      } catch (error) {
        console.error("Error in Convex operations:", error);
        // Don't return an error response here - we still want to acknowledge the webhook
        // Just log the error
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Unhandled webhook error:", error);
    return NextResponse.json(
      { error: "Unhandled webhook error" },
      { status: 500 }
    );
  }
}