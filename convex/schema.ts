import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - Main authentication and user data
  users: defineTable({
    username: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("CS"),
      v.literal("PS"),
      v.literal("PAS"),
      v.literal("RC"),
      v.literal("CC"),
      v.literal("DC"),
      v.literal("ACC"),
      v.literal("SNA"),
      v.literal("US"),
      v.literal("AS")
    ),
    email: v.string(),
    region: v.optional(v.string()),
    county: v.optional(v.string()),
    district: v.optional(v.string()),
    ministryId: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("Male"), v.literal("Female"))),
    employeeNumber: v.optional(v.string()),
    dateOfJoining: v.optional(v.string()),
    yearsOfService: v.optional(v.number()),
    nationality: v.optional(v.string()),
    education: v.optional(v.string()),
    currentStation: v.optional(v.string()),
    phone: v.optional(v.string()),
    // Performance data
    performanceRating: v.optional(v.number()),
    tenureAtCurrentStation: v.optional(v.number()),
    specialization: v.optional(v.array(v.string())),
  })
    .index("by_username", ["username"])
    .index("by_role", ["role"])
    .index("by_region", ["region"])
    .index("by_county", ["county"])
    .index("by_email", ["email"]),

  // Transfers table
  transfers: defineTable({
    officerId: v.string(),
    officerName: v.string(),
    officerRole: v.string(),
    fromLocation: v.string(),
    toLocation: v.string(),
    fromMinistry: v.optional(v.string()),
    toMinistry: v.optional(v.string()),
    status: v.union(
      v.literal("drafted"),
      v.literal("initiated"),
      v.literal("pending_approval"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("completed")
    ),
    draftedBy: v.optional(v.string()),
    draftedByName: v.optional(v.string()),
    draftedDate: v.optional(v.string()),
    initiatedBy: v.optional(v.string()),
    initiatedByName: v.optional(v.string()),
    initiatedDate: v.optional(v.string()),
    approvedBy: v.optional(v.string()),
    approvedByName: v.optional(v.string()),
    approvalDate: v.optional(v.string()),
    rejectedBy: v.optional(v.string()),
    rejectedByName: v.optional(v.string()),
    rejectionDate: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    reportingStatus: v.optional(
      v.union(
        v.literal("not_reported"),
        v.literal("reported"),
        v.literal("pending_release"),
        v.literal("released")
      )
    ),
    reportedDate: v.optional(v.string()),
    releasedBy: v.optional(v.string()),
    releasedByName: v.optional(v.string()),
    releasedDate: v.optional(v.string()),
    effectiveDate: v.string(),
    reason: v.string(),
    notes: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))),
  })
    .index("by_officer", ["officerId"])
    .index("by_status", ["status"])
    .index("by_initiator", ["initiatedBy"]),

  // Leave Records table
  leaveRecords: defineTable({
    officerId: v.string(),
    officerName: v.string(),
    officerRole: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("on_leave"),
      v.literal("study_leave"),
      v.literal("sick_leave"),
      v.literal("deceased"),
      v.literal("suspended")
    ),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    updatedBy: v.string(),
    updatedByName: v.string(),
    updatedDate: v.string(),
    notes: v.optional(v.string()),
  })
    .index("by_officer", ["officerId"])
    .index("by_status", ["status"]),

  // Leave Applications table
  leaveApplications: defineTable({
    applicantId: v.string(),
    applicantName: v.string(),
    applicantRole: v.string(),
    leaveType: v.union(
      v.literal("annual"),
      v.literal("sick"),
      v.literal("maternity"),
      v.literal("paternity"),
      v.literal("study"),
      v.literal("compassionate"),
      v.literal("unpaid")
    ),
    startDate: v.string(),
    endDate: v.string(),
    numberOfDays: v.number(),
    reason: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled")
    ),
    applicationDate: v.string(),
    approverId: v.optional(v.string()),
    approverName: v.optional(v.string()),
    approvalDate: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    reliefOfficer: v.optional(v.string()),
    reliefOfficerName: v.optional(v.string()),
    contactDuringLeave: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_applicant", ["applicantId"])
    .index("by_status", ["status"])
    .index("by_approver", ["approverId"]),

  // Leave Balances table
  leaveBalances: defineTable({
    officerId: v.string(),
    officerName: v.string(),
    annualLeaveEntitlement: v.number(),
    annualLeaveTaken: v.number(),
    annualLeaveBalance: v.number(),
    sickLeaveEntitlement: v.number(),
    sickLeaveTaken: v.number(),
    sickLeaveBalance: v.number(),
    maternityLeaveEntitlement: v.optional(v.number()),
    maternityLeaveTaken: v.optional(v.number()),
    paternityLeaveEntitlement: v.optional(v.number()),
    paternityLeaveTaken: v.optional(v.number()),
    studyLeaveEntitlement: v.number(),
    studyLeaveTaken: v.number(),
    year: v.number(),
  }).index("by_officer", ["officerId"]),

  // Created Users (from your CreatedUsersContext)
  createdUsers: defineTable({
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
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),
});
