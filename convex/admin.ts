import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple authentication function for admin
// In a production environment, you'd want to use a more secure authentication method
export const authenticate = query({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { username, password } = args;
    
    // In a real application, you would hash the password and compare it to the stored hash
    // For simplicity, we're just comparing the raw password (not recommended for production)
    const adminUser = await ctx.db
      .query("adminUsers")
      .filter((q) => q.eq(q.field("username"), username))
      .first();
    
    if (!adminUser) {
      return { success: false, message: "User not found" };
    }
    
    // Simple check - in a real app, use proper password hashing!
    if (adminUser.passwordHash === password) {
      return { success: true, message: "Authentication successful" };
    } else {
      return { success: false, message: "Invalid password" };
    }
  },
});

// Create initial admin user
export const createAdminUser = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { username, password } = args;
    
    // Check if admin users exist already
    const existingAdmins = await ctx.db.query("adminUsers").collect();
    if (existingAdmins.length > 0) {
      throw new Error("Admin users already exist. Cannot create more through this function.");
    }
    
    // Create the admin user
    // In a real application, you would hash the password first!
    const id = await ctx.db.insert("adminUsers", {
      username,
      passwordHash: password, // This should be hashed in production!
    });
    
    return id;
  },
}); 