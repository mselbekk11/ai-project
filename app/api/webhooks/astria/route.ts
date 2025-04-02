import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

// Initialize Convex HTTP client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { tune } = payload;

    // Verify webhook authenticity (you should implement this)
    // const isValid = verifyWebhookSignature(req);
    // if (!isValid) throw new Error("Invalid webhook signature");

    // Update model status in Convex
    await convex.mutation(api.headshot_models.updateModelStatus, {
      modelId: tune.id.toString(), // Convert to string if needed
      status: "finished",
      trainedAt: tune.trained_at,
      expiresAt: tune.expires_at
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}