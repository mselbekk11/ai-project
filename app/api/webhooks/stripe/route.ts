import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Use the original API version to match the type requirements
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    console.log("Webhook received - Using webhook secret:", webhookSecret.substring(0, 5) + "...");
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") as string;
    console.log("Webhook signature received:", signature ? "✓" : "✗");
    
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
    
    if (event.type === "checkout.session.completed" || 
        event.type === "checkout.session.async_payment_succeeded" || 
        event.type === "payment_intent.succeeded") {
      
      // Extract session data - different for payment_intent events
      let userId: string | undefined;
      let modelCredits = 0;
      let clothingCredits = 0;
      let generationCredits = 0;
      let isOnboarding = false;
      let plan = "unknown";
      let sessionId = "";
      let paymentIntentId: string | undefined;
      let amount = 0;
      let currency = "usd";
      
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Get the metadata from the payment intent
        userId = paymentIntent.metadata?.userId;
        modelCredits = parseInt(paymentIntent.metadata?.model_credits || "0");
        clothingCredits = parseInt(paymentIntent.metadata?.clothing_credits || "0");
        generationCredits = parseInt(paymentIntent.metadata?.generation_credits || "0");
        isOnboarding = paymentIntent.metadata?.isOnboarding === "true";
        plan = paymentIntent.metadata?.plan || "unknown";
        
        // Set payment details
        sessionId = paymentIntent.id;
        paymentIntentId = paymentIntent.id;
        amount = paymentIntent.amount;
        currency = paymentIntent.currency;
        
        console.log("PaymentIntent data:", JSON.stringify(paymentIntent, null, 2));
      } else {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get metadata from session
        userId = session.metadata?.userId;
        modelCredits = parseInt(session.metadata?.model_credits || "0");
        clothingCredits = parseInt(session.metadata?.clothing_credits || "0");
        generationCredits = parseInt(session.metadata?.generation_credits || "0");
        isOnboarding = session.metadata?.isOnboarding === "true";
        plan = session.metadata?.plan || "unknown";
        
        // Set payment details
        sessionId = session.id;
        paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : undefined;
        amount = session.amount_total || 0;
        currency = session.currency || "usd";
        
        console.log("Session data:", JSON.stringify(session, null, 2));
      }
      
      if (!userId) {
        console.error("User ID not found in metadata");
        return NextResponse.json(
          { error: "User ID not found in metadata" },
          { status: 400 }
        );
      }
      
      console.log(`Adding credits: ${modelCredits} model, ${clothingCredits} clothing, ${generationCredits} generation`);
      console.log("isOnboarding:", isOnboarding);
      
      // Initialize Convex client
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      console.log("Convex client initialized with URL:", process.env.NEXT_PUBLIC_CONVEX_URL);
      
      try {
        // If it's onboarding, initialize user credits
        if (isOnboarding) {
          console.log("Initializing user credits (onboarding)");
          const result = await convex.mutation(api.credits.initializeUserCredits, {
            user_id: userId,
            model_credits: modelCredits,
            clothing_credits: clothingCredits,
            generation_credits: generationCredits,
          });
          console.log("Initialize credits result:", result);
        } else {
          console.log("Updating existing user credits");
          // For top-ups, add credits to existing account
          const result = await convex.mutation(api.credits.updateCredits, {
            user_id: userId,
            model_credits: modelCredits,
            clothing_credits: clothingCredits,
            generation_credits: generationCredits,
          });
          console.log("Update credits result:", result);
        }
        
        console.log("Logging transaction");
        // Log the transaction
        const transactionResult = await convex.mutation(api.credits.logCreditTransaction, {
          user_id: userId,
          transaction_type: isOnboarding ? "initial_purchase" : "top_up",
          amount_paid: amount / 100,
          model_credits: modelCredits,
          clothing_credits: clothingCredits,
          generation_credits: generationCredits,
          source: "stripe",
          stripe_session_id: sessionId,
          stripe_payment_intent_id: paymentIntentId,
          metadata: {
            plan,
            currency,
            isOnboarding
          },
        });
        console.log("Transaction log result:", transactionResult);
        
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