import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

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

// Make this query accessible from the client
export const list = query({
  args: {},
  handler: async (ctx): Promise<Doc<"generations">[]> => {
    const generations = await ctx.db
      .query("generations")
      .order("desc")
      .take(100);
    return generations;
  },
});

// Get generations by clothing item class
export const listByClothingClass = query({
  args: {
    clothingClass: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"generations">[]> => {
    const generations = await ctx.db
      .query("generations")
      .filter((q) => q.eq(q.field("clothing_item"), args.clothingClass))
      .order("desc")
      .take(100);
    return generations;
  },
});