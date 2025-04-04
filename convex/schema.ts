import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  headshot_models: defineTable({
    created_at: v.number(), // Convex uses unix timestamps
    user_id: v.string(),
    model_id: v.string(),
    lora_id: v.optional(v.number()),
    name: v.string(),
    images: v.array(v.string()),
    gender: v.optional(v.string()),
    eta: v.optional(v.number()),
    trained_at: v.optional(v.number()),
    expires_at: v.optional(v.number()),
    status: v.optional(v.union(v.literal("finished"), v.literal("processing"))),
  }),
  clothing_items: defineTable({
    created_at: v.number(),
    user_id: v.string(),
    face_id: v.number(), // Changed to number since Astria sends numeric IDs
    image_url: v.string(),
    class: v.optional(v.string()),
    eta: v.optional(v.number()),
    status: v.optional(v.union(v.literal("finished"), v.literal("processing"))),
  }),
  generations: defineTable({
    created_at: v.float64(),
    face_id: v.float64(),
    lora_id: v.float64(),
    user_id: v.string(),
    image_url_generation: v.string(),
    image_url: v.string(),
    gender: v.string(),
    prompt: v.string(),
    clothing_item: v.optional(v.string()),
  }).index("by_user", ["user_id"])
    .index("by_created", ["created_at"]),
  credits: defineTable({
    user_id: v.string(),
    model_credits: v.number(),
    clothing_credits: v.number(),
    generation_credits: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user_id", ["user_id"]),
  credit_transactions: defineTable({
    user_id: v.string(),
    transaction_type: v.string(),
    transaction_date: v.number(),
    amount_paid: v.optional(v.number()),
    model_credits: v.optional(v.number()),
    clothing_credits: v.optional(v.number()),
    generation_credits: v.optional(v.number()),
    source: v.string(),
    stripe_session_id: v.optional(v.string()),
    stripe_payment_intent_id: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_user_id", ["user_id"]),
});
