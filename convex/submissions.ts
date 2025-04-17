import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Define types for better type safety
type Answer = {
  questionId: string;
  giftType: string;
  score: number;
};

type Scores = {
  prophet: number;
  servant: number;
  teacher: number;
  exhorter: number;
  giver: number;
  ruler: number;
  mercy: number;
};

// Start a new test submission
export const startSubmission = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    const id = await ctx.db.insert("submissions", {
      userId,
      answers: [],
      timestamp: Date.now(),
      completed: false,
    });
    return id;
  },
});

// Save a user's answer
export const saveAnswer = mutation({
  args: {
    submissionId: v.id("submissions"),
    questionId: v.string(),
    giftType: v.string(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const { submissionId, questionId, giftType, score } = args;
    
    // Get current submission
    const submission = await ctx.db.get(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }
    
    // Check if answer already exists for this question
    const answerIndex = submission.answers.findIndex(
      (a: Answer) => a.questionId === questionId
    );
    
    let updatedAnswers;
    if (answerIndex >= 0) {
      // Update existing answer
      updatedAnswers = [...submission.answers];
      updatedAnswers[answerIndex] = { questionId, giftType, score };
    } else {
      // Add new answer
      updatedAnswers = [...submission.answers, { questionId, giftType, score }];
    }
    
    await ctx.db.patch(submissionId, {
      answers: updatedAnswers,
    });
    
    return submissionId;
  },
});

// Complete a submission and calculate results
export const completeSubmission = mutation({
  args: {
    submissionId: v.id("submissions"),
  },
  handler: async (ctx, args) => {
    const { submissionId } = args;
    
    // Get the submission
    const submission = await ctx.db.get(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }
    
    // Calculate scores for each gift type
    const scores: Scores = {
      prophet: 0,
      servant: 0,
      teacher: 0,
      exhorter: 0,
      giver: 0,
      ruler: 0,
      mercy: 0,
    };
    
    // Count questions for each gift type to calculate averages
    const counts: Scores = {
      prophet: 0,
      servant: 0,
      teacher: 0,
      exhorter: 0,
      giver: 0,
      ruler: 0,
      mercy: 0,
    };
    
    // Calculate totals
    submission.answers.forEach((answer: Answer) => {
      const giftType = answer.giftType as keyof Scores;
      scores[giftType] += answer.score;
      counts[giftType]++;
    });
    
    // Calculate averages
    Object.keys(scores).forEach((gift) => {
      const giftKey = gift as keyof Scores;
      const count = counts[giftKey];
      scores[giftKey] = count > 0 ? Math.round((scores[giftKey] / count) * 100) / 100 : 0;
    });
    
    // Find dominant and secondary gifts
    let dominantGift = "";
    let dominantScore = -1;
    let secondaryGift = "";
    let secondaryScore = -1;
    
    Object.entries(scores).forEach(([gift, score]) => {
      if (score > dominantScore) {
        secondaryGift = dominantGift;
        secondaryScore = dominantScore;
        dominantGift = gift;
        dominantScore = score;
      } else if (score > secondaryScore) {
        secondaryGift = gift;
        secondaryScore = score;
      }
    });
    
    // Mark submission as completed
    await ctx.db.patch(submissionId, {
      completed: true,
    });
    
    // Store results
    const resultId = await ctx.db.insert("results", {
      submissionId: submissionId.toString(),
      userId: submission.userId,
      scores,
      dominantGift,
      secondaryGift,
      timestamp: Date.now(),
    });
    
    return { resultId, scores, dominantGift, secondaryGift };
  },
});

// Get a submission by ID
export const getById = query({
  args: {
    submissionId: v.id("submissions"),
  },
  handler: async (ctx, args) => {
    const { submissionId } = args;
    return await ctx.db.get(submissionId);
  },
});

// Get all submissions for a user
export const getByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    return await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
}); 