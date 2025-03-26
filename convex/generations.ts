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

// Query to list generations (preserves any existing query)
export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("generations"),
    _creationTime: v.number(),
    created_at: v.float64(),
    face_id: v.float64(),
    lora_id: v.float64(),
    user_id: v.string(),
    image_url_generation: v.string(),
    image_url: v.string(),
    gender: v.string(),
    prompt: v.string(),
    clothing_item: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("generations")
      .order("desc")
      .collect();
  },
});

// Get generations by clothing item class
export const listByClothingClass = query({
  args: {
    clothingClass: v.string(),
  },
  returns: v.array(v.object({
    _id: v.id("generations"),
    _creationTime: v.number(),
    created_at: v.float64(),
    face_id: v.float64(),
    lora_id: v.float64(),
    user_id: v.string(),
    image_url_generation: v.string(),
    image_url: v.string(),
    gender: v.string(),
    prompt: v.string(),
    clothing_item: v.optional(v.string()),
  })),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generations")
      .filter((q) => q.eq(q.field("clothing_item"), args.clothingClass))
      .order("desc")
      .collect();
  },
});

// Mutation to delete a generation
export const deleteGeneration = mutation({
  args: {
    generationId: v.id("generations"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { generationId } = args;
    
    // Check if the generation exists
    const generation = await ctx.db.get(generationId);
    if (!generation) {
      return false;
    }
    
    // Delete the generation
    await ctx.db.delete(generationId);
    
    return true;
  },
});