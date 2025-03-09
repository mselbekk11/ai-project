import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
      status: "processing",
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