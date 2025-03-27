import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

type ModelStatus = "processing" | "finished";

export const createHeadshotModel = mutation({
  args: {
    name: v.string(),
    model_id: v.string(),
    images: v.array(v.string()),
    user_id: v.string(),
    gender: v.string(),
  },
  handler: async (ctx, args) => {
    const model = await ctx.db.insert("headshot_models", {
      created_at: Date.now(),
      user_id: args.user_id,
      model_id: args.model_id,
      name: args.name,
      images: args.images,
      gender: args.gender,
      status: "processing" satisfies ModelStatus,
    });
    
    return model;
  },
});

export const listUserModels = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const models = await ctx.db
      .query("headshot_models")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .collect();
    return models;
  },
});

export const updateModelStatus = mutation({
  args: {
    modelId: v.string(),
    status: v.union(v.literal("processing"), v.literal("finished")),
    trainedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    loraId: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    console.log("🔄 Updating model status:", args);
    
    // Find and update the model
    const models = await ctx.db
      .query("headshot_models")
      .filter((q) => q.eq(q.field("model_id"), args.modelId))
      .collect();

    console.log("📚 Found models:", models.length);

    if (models.length === 0) {
      console.error("❌ Model not found for ID:", args.modelId);
      throw new Error("Model not found");
    }

    await ctx.db.patch(models[0]._id, {
      status: args.status,
      trained_at: args.trainedAt,
      expires_at: args.expiresAt,
      lora_id: args.loraId
    });
    
    console.log("✅ Successfully updated model:", models[0]._id);
  }
});

export const deleteHeadshotModel = mutation({
  args: {
    modelId: v.id("headshot_models"),
  },
  handler: async (ctx, args) => {
    // Delete the model from the database
    await ctx.db.delete(args.modelId);
    
    return { success: true };
  },
});