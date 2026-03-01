import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// ============ USER HOOKS ============
export function useAllUsers() {
  return useQuery(api.queries.getAllUsers);
}

export function useUserByUsername(username: string | undefined) {
  return useQuery(api.queries.getUserByUsername, username ? { username } : "skip");
}

export function useUsersByRole(role: string | undefined) {
  return useQuery(api.queries.getUsersByRole, role ? { role } : "skip");
}

export function useUsersByRegion(region: string | undefined) {
  return useQuery(api.queries.getUsersByRegion, region ? { region } : "skip");
}

export function useUsersByCounty(county: string | undefined) {
  return useQuery(api.queries.getUsersByCounty, county ? { county } : "skip");
}

// ============ TRANSFER HOOKS ============
export function useAllTransfers() {
  return useQuery(api.queries.getAllTransfers);
}

export function useTransfersByStatus(status: string | undefined) {
  return useQuery(api.queries.getTransfersByStatus, status ? { status } : "skip");
}

export function useTransfersByOfficer(officerId: string | undefined) {
  return useQuery(api.queries.getTransfersByOfficer, officerId ? { officerId } : "skip");
}

// ============ LEAVE HOOKS ============
export function useAllLeaveRecords() {
  return useQuery(api.queries.getAllLeaveRecords);
}

export function useLeaveRecordsByOfficer(officerId: string | undefined) {
  return useQuery(api.queries.getLeaveRecordsByOfficer, officerId ? { officerId } : "skip");
}

export function useAllLeaveApplications() {
  return useQuery(api.queries.getAllLeaveApplications);
}

export function useLeaveApplicationsByStatus(status: string | undefined) {
  return useQuery(api.queries.getLeaveApplicationsByStatus, status ? { status } : "skip");
}

export function useLeaveBalanceByOfficer(officerId: string | undefined) {
  return useQuery(api.queries.getLeaveBalanceByOfficer, officerId ? { officerId } : "skip");
}

// ============ CREATED USERS HOOKS ============
export function useAllCreatedUsers() {
  return useQuery(api.queries.getAllCreatedUsers);
}

export function useCreatedUserByEmail(email: string | undefined) {
  return useQuery(api.queries.getCreatedUserByEmail, email ? { email } : "skip");
}

// ============ MUTATION HOOKS ============
export function useCreateUser() {
  return useMutation(api.mutations.createUser);
}

export function useCreateTransfer() {
  return useMutation(api.mutations.createTransfer);
}

export function useUpdateTransfer() {
  return useMutation(api.mutations.updateTransfer);
}

export function useCreateLeaveRecord() {
  return useMutation(api.mutations.createLeaveRecord);
}

export function useUpdateLeaveRecord() {
  return useMutation(api.mutations.updateLeaveRecord);
}

export function useCreateLeaveApplication() {
  return useMutation(api.mutations.createLeaveApplication);
}

export function useUpdateLeaveApplication() {
  return useMutation(api.mutations.updateLeaveApplication);
}

export function useCreateCreatedUser() {
  return useMutation(api.mutations.createCreatedUser);
}

export function useUpdateCreatedUser() {
  return useMutation(api.mutations.updateCreatedUser);
}

export function useDeleteCreatedUser() {
  return useMutation(api.mutations.deleteCreatedUser);
}

// ============ SEED HOOKS ============
export function useBatchInsertUsers() {
  return useMutation(api.seed.batchInsertUsers);
}

export function useBatchInsertTransfers() {
  return useMutation(api.seed.batchInsertTransfers);
}

export function useBatchInsertLeaveRecords() {
  return useMutation(api.seed.batchInsertLeaveRecords);
}

export function useClearAllData() {
  return useMutation(api.seed.clearAllData);
}
