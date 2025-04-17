import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Questions table - stores all the questions for the test
  questions: defineTable({
    text: v.string(),
    giftType: v.string(), // one of: "prophet", "servant", "teacher", "exhorter", "giver", "ruler", "mercy"
    order: v.number(), // to control the order of questions
  }),

  // User submissions table - stores user responses
  submissions: defineTable({
    userId: v.string(), // anonymous or temporary ID
    answers: v.array(
      v.object({
        questionId: v.string(),
        giftType: v.string(),
        score: v.number(), // 1-5 scale
      })
    ),
    timestamp: v.number(), // Unix timestamp
    completed: v.boolean(), // Whether the test was completed
  }),

  // Results table - stores calculated results
  results: defineTable({
    submissionId: v.string(), // References submissions table
    userId: v.string(),
    scores: v.object({
      prophet: v.number(),
      servant: v.number(),
      teacher: v.number(),
      exhorter: v.number(),
      giver: v.number(),
      ruler: v.number(),
      mercy: v.number(),
    }),
    dominantGift: v.string(),
    secondaryGift: v.string(),
    timestamp: v.number(),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
  }),

  // Admin credentials table
  adminUsers: defineTable({
    username: v.string(),
    passwordHash: v.string(), // Hashed password for security
  }),
});