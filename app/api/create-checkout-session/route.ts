import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, userId, isOnboarding = false } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Define package details
    let priceId;
    let metadata;

    switch (plan) {
      case "starter":
        priceId = process.env.STRIPE_STARTER_PRICE_ID;
        metadata = {
          userId,
          plan,
          model_credits: "1",
          clothing_credits: "20",
          generation_credits: "20",
          isOnboarding: isOnboarding.toString(),
        };
        break;
      case "pro":
        priceId = process.env.STRIPE_PRO_PRICE_ID;
        metadata = {
          userId,
          plan,
          model_credits: "2",
          clothing_credits: "40",
          generation_credits: "40",
          isOnboarding: isOnboarding.toString(),
        };
        break;
      case "premium":
        priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
        metadata = {
          userId,
          plan,
          model_credits: "3",
          clothing_credits: "60",
          generation_credits: "60",
          isOnboarding: isOnboarding.toString(),
        };
        break;
      default:
        return NextResponse.json(
          { error: "Invalid plan specified" },
          { status: 400 }
        );
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}${
        isOnboarding ? "/onboarding/success" : "/home"
      }${isOnboarding ? "?session_id={CHECKOUT_SESSION_ID}" : ""}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}${
        isOnboarding ? "/onboarding" : "/buy-credits"
      }`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the checkout session" },
      { status: 500 }
    );
  }
}