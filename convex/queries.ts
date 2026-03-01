import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all users
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Get user by username
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

// Get users by role
export const getUsersByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

// Get users by region
export const getUsersByRegion = query({
  args: { region: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_region", (q) => q.eq("region", args.region))
      .collect();
  },
});

// Get users by county
export const getUsersByCounty = query({
  args: { county: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_county", (q) => q.eq("county", args.county))
      .collect();
  },
});

// Get all transfers
export const getAllTransfers = query({
  handler: async (ctx) => {
    return await ctx.db.query("transfers").collect();
  },
});

// Get transfers by status
export const getTransfersByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transfers")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get transfers by officer
export const getTransfersByOfficer = query({
  args: { officerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transfers")
      .withIndex("by_officer", (q) => q.eq("officerId", args.officerId))
      .collect();
  },
});

// Get all leave records
export const getAllLeaveRecords = query({
  handler: async (ctx) => {
    return await ctx.db.query("leaveRecords").collect();
  },
});

// Get leave records by officer
export const getLeaveRecordsByOfficer = query({
  args: { officerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leaveRecords")
      .withIndex("by_officer", (q) => q.eq("officerId", args.officerId))
      .collect();
  },
});

// Get all leave applications
export const getAllLeaveApplications = query({
  handler: async (ctx) => {
    return await ctx.db.query("leaveApplications").collect();
  },
});

// Get leave applications by status
export const getLeaveApplicationsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leaveApplications")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get leave balances by officer
export const getLeaveBalanceByOfficer = query({
  args: { officerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leaveBalances")
      .withIndex("by_officer", (q) => q.eq("officerId", args.officerId))
      .first();
  },
});

// Get all created users
export const getAllCreatedUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("createdUsers").collect();
  },
});

// Get created user by email
export const getCreatedUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("createdUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});
