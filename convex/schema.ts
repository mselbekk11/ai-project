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
    name: v.string(),
    images: v.array(v.string()),
    eta: v.optional(v.number()),
    trained_at: v.optional(v.number()),
    expires_at: v.optional(v.number()),
    status: v.optional(v.union(v.literal("finished"), v.literal("processing"))),
  }),
});
