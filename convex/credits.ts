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
    const user = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .unique();

    if (!user) {
      throw new Error("User credits not found");
    }

    if (user.model_credits < 1) {
      throw new Error("Insufficient model credits");
    }

    const updatedUserCredits = await ctx.db.patch(user._id, {
      model_credits: user.model_credits - 1,
    });
    
    // Log the transaction
    await ctx.db.insert("credit_transactions", {
      user_id: args.user_id,
      transaction_type: "usage",
      transaction_date: Date.now(),
      model_credits: -1, // Negative to indicate usage
      source: "app_usage",
      stripe_session_id: undefined,
      metadata: { feature: "model_creation" },
    });
    
    return updatedUserCredits;
  },
});

// Specialized function to deduct clothing credits
export const deductClothingCredit = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .unique();

    if (!user) {
      throw new Error("User credits not found");
    }

    if (user.clothing_credits < 1) {
      throw new Error("Insufficient clothing credits");
    }

    const updatedUserCredits = await ctx.db.patch(user._id, {
      clothing_credits: user.clothing_credits - 1,
    });
    
    // Log the transaction
    await ctx.db.insert("credit_transactions", {
      user_id: args.user_id,
      transaction_type: "usage",
      transaction_date: Date.now(),
      clothing_credits: -1,
      source: "app_usage",
      stripe_session_id: undefined,
      metadata: { feature: "clothing_upload" },
    });
    
    return updatedUserCredits;
  },
});

// Specialized function to deduct generation credits
export const deductGenerationCredits = mutation({
  args: { user_id: v.string(), count: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("credits")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .unique();

    if (!user) {
      throw new Error("User credits not found");
    }

    if (user.generation_credits < args.count) {
      throw new Error("Insufficient generation credits");
    }

    const updatedUserCredits = await ctx.db.patch(user._id, {
      generation_credits: user.generation_credits - args.count,
    });
    
    // Log the transaction
    await ctx.db.insert("credit_transactions", {
      user_id: args.user_id,
      transaction_type: "usage",
      transaction_date: Date.now(),
      generation_credits: -args.count,
      source: "app_usage",
      stripe_session_id: undefined,
      metadata: { feature: "image_generation", count: args.count },
    });
    
    return updatedUserCredits;
  },
});

// Function to log credit transactions
export const logCreditTransaction = mutation({
  args: {
    user_id: v.string(),
    transaction_type: v.string(),
    amount_paid: v.optional(v.number()),
    model_credits: v.optional(v.number()),
    clothing_credits: v.optional(v.number()),
    generation_credits: v.optional(v.number()),
    source: v.string(),
    stripe_session_id: v.optional(v.string()),
    stripe_payment_intent_id: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("credit_transactions", {
      user_id: args.user_id,
      transaction_type: args.transaction_type,
      transaction_date: Date.now(),
      amount_paid: args.amount_paid,
      model_credits: args.model_credits,
      clothing_credits: args.clothing_credits,
      generation_credits: args.generation_credits,
      source: args.source,
      stripe_session_id: args.stripe_session_id,
      stripe_payment_intent_id: args.stripe_payment_intent_id,
      metadata: args.metadata,
    });
  },
});

// Add a query to get user transaction history
export const getUserTransactionHistory = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("credit_transactions")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .order("desc")
      .collect();
  },
});

// Test function to directly insert a transaction
export const testInsertTransaction = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("credit_transactions", {
      user_id: args.user_id,
      transaction_type: "test",
      transaction_date: Date.now(),
      amount_paid: 0,
      model_credits: 1,
      clothing_credits: 1,
      generation_credits: 1,
      source: "test",
      stripe_session_id: "test_session",
      metadata: { test: true }
    });
  },
});

// Test function to directly add a transaction record
export const testAddTransaction = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      const id = await ctx.db.insert("credit_transactions", {
        user_id: "test_user_id",
        transaction_type: "test",
        transaction_date: Date.now(),
        amount_paid: 19.99,
        model_credits: 1,
        clothing_credits: 20,
        generation_credits: 20,
        source: "test",
        stripe_session_id: "test_session",
        metadata: { test: true }
      });
      return { success: true, id };
    } catch (error) {
      console.error("Test transaction insert failed:", error);
      return { success: false, error: String(error) };
    }
  },
});