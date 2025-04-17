import { query } from "./_generated/server";
import { v } from "convex/values";

// Get a result by ID
export const getById = query({
  args: {
    resultId: v.id("results"),
  },
  handler: async (ctx, args) => {
    const { resultId } = args;
    return await ctx.db.get(resultId);
  },
});

// Get all results for a user
export const getByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    const results = await ctx.db
      .query("results")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    
    return results.sort((a, b) => b.timestamp - a.timestamp);
  },
});

// Get the most recent result for a user
export const getMostRecentByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    const results = await ctx.db
      .query("results")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    
    // Sort by timestamp desc
    results.sort((a, b) => b.timestamp - a.timestamp);
    
    return results.length > 0 ? results[0] : null;
  },
});

// Get all results for admin view
export const getAllForAdmin = query({
  handler: async (ctx) => {
    const results = await ctx.db
      .query("results")
      .collect();
    
    return results.sort((a, b) => b.timestamp - a.timestamp);
  },
});

// Get summary statistics for admin
export const getStatistics = query({
  handler: async (ctx) => {
    const results = await ctx.db.query("results").collect();
    
    // Count dominant gifts
    const dominantGiftCounts: Record<string, number> = {
      prophet: 0,
      servant: 0,
      teacher: 0,
      exhorter: 0,
      giver: 0,
      ruler: 0,
      mercy: 0,
    };
    
    // Count secondary gifts
    const secondaryGiftCounts: Record<string, number> = {
      prophet: 0,
      servant: 0,
      teacher: 0,
      exhorter: 0,
      giver: 0,
      ruler: 0,
      mercy: 0,
    };
    
    // Count total results
    const totalResults = results.length;
    
    // Collect data
    results.forEach((result) => {
      if (dominantGiftCounts[result.dominantGift] !== undefined) {
        dominantGiftCounts[result.dominantGift]++;
      }
      
      if (secondaryGiftCounts[result.secondaryGift] !== undefined) {
        secondaryGiftCounts[result.secondaryGift]++;
      }
    });
    
    return {
      totalResults,
      dominantGiftCounts,
      secondaryGiftCounts,
    };
  },
}); 