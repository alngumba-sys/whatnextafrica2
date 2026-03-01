import { mutation } from "./_generated/server";

// This function will seed the database with initial data
// Run this once after setting up Convex
export const seedDatabase = mutation({
  handler: async (ctx) => {
    // Check if data already exists
    const existingUsers = await ctx.db.query("users").first();
    if (existingUsers) {
      return { success: false, message: "Database already seeded" };
    }

    // We'll need to import and insert the data from your dummy files
    // This is a placeholder - you'll run the actual seeding from the browser
    return { success: true, message: "Ready to seed" };
  },
});

// Batch insert users
export const batchInsertUsers = mutation({
  args: {},
  handler: async (ctx, args: any) => {
    const users = args.users || [];
    const ids = [];
    
    for (const user of users) {
      const id = await ctx.db.insert("users", user);
      ids.push(id);
    }
    
    return { success: true, count: ids.length, ids };
  },
});

// Batch insert transfers
export const batchInsertTransfers = mutation({
  args: {},
  handler: async (ctx, args: any) => {
    const transfers = args.transfers || [];
    const ids = [];
    
    for (const transfer of transfers) {
      const id = await ctx.db.insert("transfers", transfer);
      ids.push(id);
    }
    
    return { success: true, count: ids.length, ids };
  },
});

// Batch insert leave records
export const batchInsertLeaveRecords = mutation({
  args: {},
  handler: async (ctx, args: any) => {
    const records = args.records || [];
    const ids = [];
    
    for (const record of records) {
      const id = await ctx.db.insert("leaveRecords", record);
      ids.push(id);
    }
    
    return { success: true, count: ids.length, ids };
  },
});

// Clear all data (for development/testing)
export const clearAllData = mutation({
  handler: async (ctx) => {
    // Delete all users
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }

    // Delete all transfers
    const transfers = await ctx.db.query("transfers").collect();
    for (const transfer of transfers) {
      await ctx.db.delete(transfer._id);
    }

    // Delete all leave records
    const leaveRecords = await ctx.db.query("leaveRecords").collect();
    for (const record of leaveRecords) {
      await ctx.db.delete(record._id);
    }

    // Delete all leave applications
    const leaveApps = await ctx.db.query("leaveApplications").collect();
    for (const app of leaveApps) {
      await ctx.db.delete(app._id);
    }

    // Delete all created users
    const createdUsers = await ctx.db.query("createdUsers").collect();
    for (const user of createdUsers) {
      await ctx.db.delete(user._id);
    }

    return { success: true, message: "All data cleared" };
  },
});
