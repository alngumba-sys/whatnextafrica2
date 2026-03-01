import { mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ USER MUTATIONS ============
export const createUser = mutation({
  args: {
    username: v.string(),
    name: v.string(),
    role: v.string(),
    email: v.string(),
    region: v.optional(v.string()),
    county: v.optional(v.string()),
    district: v.optional(v.string()),
    ministryId: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    employeeNumber: v.optional(v.string()),
    dateOfJoining: v.optional(v.string()),
    yearsOfService: v.optional(v.number()),
    nationality: v.optional(v.string()),
    education: v.optional(v.string()),
    currentStation: v.optional(v.string()),
    phone: v.optional(v.string()),
    performanceRating: v.optional(v.number()),
    tenureAtCurrentStation: v.optional(v.number()),
    specialization: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args as any);
  },
});

// ============ TRANSFER MUTATIONS ============
export const createTransfer = mutation({
  args: {
    officerId: v.string(),
    officerName: v.string(),
    officerRole: v.string(),
    fromLocation: v.string(),
    toLocation: v.string(),
    fromMinistry: v.optional(v.string()),
    toMinistry: v.optional(v.string()),
    status: v.string(),
    draftedBy: v.optional(v.string()),
    draftedByName: v.optional(v.string()),
    draftedDate: v.optional(v.string()),
    initiatedBy: v.optional(v.string()),
    initiatedByName: v.optional(v.string()),
    initiatedDate: v.optional(v.string()),
    effectiveDate: v.string(),
    reason: v.string(),
    notes: v.optional(v.string()),
    priority: v.optional(v.string()),
    reportingStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transfers", args as any);
  },
});

export const updateTransfer = mutation({
  args: {
    id: v.id("transfers"),
    status: v.optional(v.string()),
    approvedBy: v.optional(v.string()),
    approvedByName: v.optional(v.string()),
    approvalDate: v.optional(v.string()),
    rejectedBy: v.optional(v.string()),
    rejectedByName: v.optional(v.string()),
    rejectionDate: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    reportingStatus: v.optional(v.string()),
    reportedDate: v.optional(v.string()),
    releasedBy: v.optional(v.string()),
    releasedByName: v.optional(v.string()),
    releasedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates as any);
  },
});

// ============ LEAVE RECORD MUTATIONS ============
export const createLeaveRecord = mutation({
  args: {
    officerId: v.string(),
    officerName: v.string(),
    officerRole: v.string(),
    status: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    updatedBy: v.string(),
    updatedByName: v.string(),
    updatedDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leaveRecords", args as any);
  },
});

export const updateLeaveRecord = mutation({
  args: {
    id: v.id("leaveRecords"),
    status: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates as any);
  },
});

// ============ LEAVE APPLICATION MUTATIONS ============
export const createLeaveApplication = mutation({
  args: {
    applicantId: v.string(),
    applicantName: v.string(),
    applicantRole: v.string(),
    leaveType: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    numberOfDays: v.number(),
    reason: v.string(),
    status: v.string(),
    applicationDate: v.string(),
    reliefOfficer: v.optional(v.string()),
    reliefOfficerName: v.optional(v.string()),
    contactDuringLeave: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leaveApplications", args as any);
  },
});

export const updateLeaveApplication = mutation({
  args: {
    id: v.id("leaveApplications"),
    status: v.optional(v.string()),
    approverId: v.optional(v.string()),
    approverName: v.optional(v.string()),
    approvalDate: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates as any);
  },
});

// ============ CREATED USERS MUTATIONS ============
export const createCreatedUser = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    dateOfBirth: v.optional(v.string()),
    nationalId: v.optional(v.string()),
    role: v.string(),
    position: v.string(),
    department: v.string(),
    reportingTo: v.optional(v.string()),
    region: v.string(),
    county: v.string(),
    subcounty: v.optional(v.string()),
    headquarters: v.string(),
    jurisdictionOverview: v.optional(v.string()),
    education: v.optional(v.string()),
    yearsOfExperience: v.optional(v.string()),
    previousPositions: v.optional(v.string()),
    expertise: v.array(v.string()),
    budgetAllocated: v.optional(v.string()),
    performanceTarget: v.optional(v.string()),
    kpiMetrics: v.optional(v.string()),
    initiatives: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
      })
    ),
    createdBy: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("createdUsers", args as any);
  },
});

export const updateCreatedUser = mutation({
  args: {
    id: v.id("createdUsers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(v.string()),
    position: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates as any);
  },
});

export const deleteCreatedUser = mutation({
  args: { id: v.id("createdUsers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
