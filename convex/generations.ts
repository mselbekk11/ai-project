import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    created_at: v.float64(),
    face_id: v.float64(),
    lora_id: v.float64(),
    user_id: v.string(),
    image_url_generation: v.string(),
    image_url: v.string(),
    gender: v.string(),
    prompt: v.string(),
    clothing_item: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("generations", args);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const generations = await ctx.db
      .query("generations")
      .order("desc")
      .take(100);
    return generations;
  },
});