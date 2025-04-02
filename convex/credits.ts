import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get a user's credits
export const getUserCredits = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const { user_id } = args;
    
    // Find credits for this user
    const credits = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", user_id))
      .first();
    
    if (!credits) {
      return {
        model_credits: 0,
        clothing_credits: 0,
        generation_credits: 0
      };
    }
    
    return credits;
  },
});

// Initialize a new user's credits (called when a user is created)
export const initializeUserCredits = mutation({
  args: { 
    user_id: v.string(),
    model_credits: v.optional(v.number()),
    clothing_credits: v.optional(v.number()),
    generation_credits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user_id, model_credits = 3, clothing_credits = 5, generation_credits = 10 } = args;
    
    // Check if credits already exist for this user
    const existingCredits = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", user_id))
      .first();
    
    if (existingCredits) {
      return existingCredits._id;
    }
    
    // Create new credits record
    const creditsId = await ctx.db.insert("credits", {
      user_id,
      model_credits,
      clothing_credits,
      generation_credits,
      // createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return creditsId;
  },
});

// Update a user's credits (add or subtract)
export const updateCredits = mutation({
  args: { 
    user_id: v.string(),
    model_credits: v.optional(v.number()),
    clothing_credits: v.optional(v.number()),
    generation_credits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user_id, model_credits = 0, clothing_credits = 0, generation_credits = 0 } = args;
    
    // Find the user's credits
    const credits = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", user_id))
      .first();
    
    if (!credits) {
      // If no credits record exists, create one
      return await ctx.db.insert("credits", {
        user_id,
        model_credits: Math.max(0, model_credits),
        clothing_credits: Math.max(0, clothing_credits),
        generation_credits: Math.max(0, generation_credits),
        // createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    
    // Update existing credits
    return await ctx.db.patch(credits._id, {
      model_credits: Math.max(0, credits.model_credits + model_credits),
      clothing_credits: Math.max(0, credits.clothing_credits + clothing_credits),
      generation_credits: Math.max(0, credits.generation_credits + generation_credits),
      updatedAt: Date.now(),
    });
  },
});

// Check if user has sufficient credits for an operation
export const checkCreditSufficiency = query({
  args: { 
    user_id: v.string(),
    modelCreditsNeeded: v.optional(v.number()),
    clothingCreditsNeeded: v.optional(v.number()),
    generationCreditsNeeded: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { 
      user_id, 
      modelCreditsNeeded = 0, 
      clothingCreditsNeeded = 0, 
      generationCreditsNeeded = 0 
    } = args;
    
    const credits = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", user_id))
      .first();
    
    if (!credits) return false;
    
    return (
      credits.model_credits >= modelCreditsNeeded &&
      credits.clothing_credits >= clothingCreditsNeeded &&
      credits.generation_credits >= generationCreditsNeeded
    );
  },
});

// Specialized function to deduct model credits
export const deductModelCredit = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const { user_id } = args;
    
    const credits = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", user_id))
      .first();
    
    if (!credits || credits.model_credits < 1) {
      throw new Error("Insufficient model credits");
    }
    
    await ctx.db.patch(credits._id, {
      model_credits: credits.model_credits - 1,
      updatedAt: Date.now(),
    });
    
    return true;
  },
});

// Specialized function to deduct clothing credits
export const deductClothingCredit = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const { user_id } = args;
    
    const credits = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", user_id))
      .first();
    
    if (!credits || credits.clothing_credits < 1) {
      throw new Error("Insufficient clothing credits");
    }
    
    await ctx.db.patch(credits._id, {
      clothing_credits: credits.clothing_credits - 1,
      updatedAt: Date.now(),
    });
    
    return true;
  },
});

// Specialized function to deduct generation credits
export const deductGenerationCredits = mutation({
  args: { 
    user_id: v.string(),
    count: v.number(), 
  },
  handler: async (ctx, args) => {
    const { user_id, count } = args;
    
    const credits = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", user_id))
      .first();
    
    if (!credits || credits.generation_credits < count) {
      throw new Error(`Insufficient generation credits. Need ${count} credits.`);
    }
    
    await ctx.db.patch(credits._id, {
      generation_credits: credits.generation_credits - count,
      updatedAt: Date.now(),
    });
    
    return true;
  },
});