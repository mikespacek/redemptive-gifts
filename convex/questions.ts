import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all questions, sorted by order
export const getAll = query({
  handler: async (ctx) => {
    const questions = await ctx.db.query("questions").collect();
    return questions.sort((a, b) => a.order - b.order);
  },
});

// Add a new question
export const add = mutation({
  args: {
    text: v.string(),
    giftType: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { text, giftType, order } = args;
    const id = await ctx.db.insert("questions", {
      text,
      giftType,
      order,
    });
    return id;
  },
});

// Update a question
export const update = mutation({
  args: {
    id: v.id("questions"),
    text: v.string(),
    giftType: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, text, giftType, order } = args;
    await ctx.db.patch(id, {
      text,
      giftType,
      order,
    });
    return id;
  },
});

// Delete a question
export const remove = mutation({
  args: {
    id: v.id("questions"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);
    return id;
  },
}); 