import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// This endpoint is the callback mechanism that completes the asynchronous model training workflow. It's how Astria notifies your app when a
//  model training job finishes.

// Key Purpose:

  // - Receives notifications from Astria when training completes
  // - Updates database from "processing" → "finished"
  // - Provides the LoRA ID needed for generation
  // - Public endpoint (no authentication required)

export async function POST(req: Request) {
  console.log("🎯 Webhook received from Astria");
  
  try {
    const payload = await req.json();
    console.log("📦 Webhook payload:", JSON.stringify(payload, null, 2));
    
    // Webhook Processing
    const { tune } = payload;
    console.log("🎨 Model ID:", tune.id);

    // Use the tune.id as the Lora ID
    const loraId = tune.id;
    console.log("📝 Using tune ID as Lora ID:", loraId);

    // Update model status in Convex with Lora ID
    await convex.mutation(api.headshot_models.updateModelStatus, {
      modelId: tune.id.toString(),
      status: "finished",
      trainedAt: new Date(tune.trained_at).getTime(),
      expiresAt: tune.expires_at ? new Date(tune.expires_at).getTime() : undefined,
      loraId: loraId
    });

    console.log("✅ Successfully updated model status in Convex");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
} 