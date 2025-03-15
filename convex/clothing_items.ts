import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createClothingItem = mutation({
  args: {
    user_id: v.string(),
    face_id: v.number(),
    image_url: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.insert("clothing_items", {
      created_at: Date.now(),
      user_id: args.user_id,
      face_id: args.face_id,
      image_url: args.image_url,
      status: "processing",
    });
    
    return item;
  },
});

export const listUserClothingItems = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("clothing_items")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .order("desc")
      .collect();
    return items;
  },
});