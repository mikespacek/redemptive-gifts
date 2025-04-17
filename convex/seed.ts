import { mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Sample questions for each gift type
const sampleQuestions = [
  // Prophet questions
  { text: "I tend to see things as black and white, right or wrong.", giftType: "prophet", order: 1 },
  { text: "I easily identify problems in situations or systems.", giftType: "prophet", order: 8 },
  { text: "I value truth above comfort in relationships.", giftType: "prophet", order: 15 },
  { text: "I am deeply concerned with moral integrity.", giftType: "prophet", order: 22 },
  { text: "I readily perceive when something is out of alignment with God's principles.", giftType: "prophet", order: 29 },
  { text: "I can be outspoken when I see something that needs to be corrected.", giftType: "prophet", order: 36 },
  { text: "I easily see the root cause of issues rather than just symptoms.", giftType: "prophet", order: 43 },
  { text: "I am passionate about justice and righteousness.", giftType: "prophet", order: 50 },
  { text: "I care deeply about the moral state of society.", giftType: "prophet", order: 57 },
  { text: "I have a strong sense of right and wrong.", giftType: "prophet", order: 64 },

  // Servant questions
  { text: "I notice practical needs before others do.", giftType: "servant", order: 2 },
  { text: "I enjoy working behind the scenes to support others.", giftType: "servant", order: 9 },
  { text: "I find fulfillment in completing practical tasks for others.", giftType: "servant", order: 16 },
  { text: "I am quick to offer help without being asked.", giftType: "servant", order: 23 },
  { text: "I prefer to show my love through actions rather than words.", giftType: "servant", order: 30 },
  { text: "I gain energy from meeting other people's needs.", giftType: "servant", order: 37 },
  { text: "I prefer to give practically rather than financially.", giftType: "servant", order: 44 },
  { text: "I easily anticipate what others might need.", giftType: "servant", order: 51 },
  { text: "I feel uncomfortable being served by others.", giftType: "servant", order: 58 },
  { text: "I often take care of details that others overlook.", giftType: "servant", order: 65 },

  // Teacher questions
  { text: "I enjoy studying and researching topics thoroughly.", giftType: "teacher", order: 3 },
  { text: "I present information in a systematic, logical way.", giftType: "teacher", order: 10 },
  { text: "I value accuracy and precision in communication.", giftType: "teacher", order: 17 },
  { text: "I ask many questions to understand a subject fully.", giftType: "teacher", order: 24 },
  { text: "I enjoy validating facts and correcting misinformation.", giftType: "teacher", order: 31 },
  { text: "I prefer depth over breadth in learning.", giftType: "teacher", order: 38 },
  { text: "I am more analytical than emotional in my approach.", giftType: "teacher", order: 45 },
  { text: "I naturally organize information into systems or frameworks.", giftType: "teacher", order: 52 },
  { text: "I value history and foundations when learning new concepts.", giftType: "teacher", order: 59 },
  { text: "I prefer detailed explanations to simplified summaries.", giftType: "teacher", order: 66 },

  // Exhorter questions
  { text: "I enjoy encouraging others to reach their potential.", giftType: "exhorter", order: 4 },
  { text: "I naturally see the positive in difficult situations.", giftType: "exhorter", order: 11 },
  { text: "I tend to be the cheerleader in groups.", giftType: "exhorter", order: 18 },
  { text: "I make friends easily and value relationships highly.", giftType: "exhorter", order: 25 },
  { text: "I focus on practical application more than theory.", giftType: "exhorter", order: 32 },
  { text: "I enjoy connecting people with similar interests or needs.", giftType: "exhorter", order: 39 },
  { text: "I am energized by finding solutions to problems.", giftType: "exhorter", order: 46 },
  { text: "I easily switch conversations from superficial to meaningful topics.", giftType: "exhorter", order: 53 },
  { text: "I naturally see people's potential and growth opportunities.", giftType: "exhorter", order: 60 },
  { text: "I enjoy helping others apply truth to their specific situations.", giftType: "exhorter", order: 67 },

  // Giver questions
  { text: "I am good at recognizing the value in things or opportunities.", giftType: "giver", order: 5 },
  { text: "I enjoy using my resources to meet others' needs.", giftType: "giver", order: 12 },
  { text: "I am careful with my spending and value good stewardship.", giftType: "giver", order: 19 },
  { text: "I enjoy giving in ways that multiply the effectiveness of my gift.", giftType: "giver", order: 26 },
  { text: "I can easily discern when to give and when not to.", giftType: "giver", order: 33 },
  { text: "I enjoy managing resources effectively.", giftType: "giver", order: 40 },
  { text: "I tend to think long-term in my planning and decisions.", giftType: "giver", order: 47 },
  { text: "I prefer to give anonymously rather than publicly.", giftType: "giver", order: 54 },
  { text: "I am more likely to give generously to effective initiatives.", giftType: "giver", order: 61 },
  { text: "I enjoy making wise financial decisions and investments.", giftType: "giver", order: 68 },

  // Ruler questions
  { text: "I naturally take charge in group settings.", giftType: "ruler", order: 6 },
  { text: "I enjoy organizing people and resources toward a vision.", giftType: "ruler", order: 13 },
  { text: "I am skilled at delegating responsibilities to others.", giftType: "ruler", order: 20 },
  { text: "I think in terms of projects and goals.", giftType: "ruler", order: 27 },
  { text: "I am persistent in the face of obstacles.", giftType: "ruler", order: 34 },
  { text: "I can make difficult decisions without being swayed by emotions.", giftType: "ruler", order: 41 },
  { text: "I enjoy creating order out of chaos.", giftType: "ruler", order: 48 },
  { text: "I naturally see the big picture in situations.", giftType: "ruler", order: 55 },
  { text: "I hold myself and others to high standards.", giftType: "ruler", order: 62 },
  { text: "I quickly identify how to improve existing systems or processes.", giftType: "ruler", order: 69 },

  // Mercy questions
  { text: "I easily sense other people's emotions and feelings.", giftType: "mercy", order: 7 },
  { text: "I am drawn to people who are suffering or in pain.", giftType: "mercy", order: 14 },
  { text: "I strongly dislike conflict and seek harmony.", giftType: "mercy", order: 21 },
  { text: "I am sensitive to the emotional atmosphere in a room.", giftType: "mercy", order: 28 },
  { text: "I am patient with people who are emotionally needy.", giftType: "mercy", order: 35 },
  { text: "I find it easy to forgive others.", giftType: "mercy", order: 42 },
  { text: "I enjoy creating beautiful, harmonious environments.", giftType: "mercy", order: 49 },
  { text: "I am deeply moved by expressions of love and kindness.", giftType: "mercy", order: 56 },
  { text: "I am more concerned with people's feelings than with tasks.", giftType: "mercy", order: 63 },
  { text: "I naturally adapt to others' emotional needs.", giftType: "mercy", order: 70 },
];

// Seed the database with questions (mutation version)
export const seedQuestions = mutation({
  handler: async (ctx) => {
    // Check if questions already exist
    const existingQuestions = await ctx.db.query("questions").collect();
    if (existingQuestions.length > 0) {
      return { success: false, message: "Questions already exist in the database." };
    }

    // Insert all sample questions
    for (const question of sampleQuestions) {
      await ctx.db.insert("questions", question);
    }

    return {
      success: true,
      message: `Successfully added ${sampleQuestions.length} questions to the database.`
    };
  },
});

// Seed an admin user
// Action version of seed questions (can be called from client)
export const seedQuestionsAction = action({
  handler: async (ctx) => {
    // Check if questions already exist
    const existingQuestions = await ctx.runQuery(api.questions.getAll);

    if (existingQuestions && existingQuestions.length > 0) {
      console.log(`Database already has ${existingQuestions.length} questions. Skipping seed.`);
      return {
        success: true,
        message: `Database already has ${existingQuestions.length} questions. No new questions added.`,
        questionsCount: existingQuestions.length
      };
    }

    // Add all sample questions
    let addedCount = 0;
    for (const question of sampleQuestions) {
      await ctx.runMutation(api.questions.add, {
        text: question.text,
        giftType: question.giftType,
        order: question.order
      });
      addedCount++;
    }

    console.log(`Successfully added ${addedCount} questions to the database.`);
    return {
      success: true,
      message: `Successfully added ${addedCount} questions to the database.`,
      questionsCount: addedCount
    };
  },
});

export const seedAdmin = mutation({
  handler: async (ctx) => {
    // Check if admin users exist already
    const existingAdmins = await ctx.db.query("adminUsers").collect();
    if (existingAdmins.length > 0) {
      return { success: false, message: "Admin users already exist." };
    }

    // Create a default admin user
    // In a real application, you would hash the password!
    await ctx.db.insert("adminUsers", {
      username: "admin",
      passwordHash: "admin123", // This should be hashed in production!
    });

    return {
      success: true,
      message: "Successfully created default admin user."
    };
  },
});