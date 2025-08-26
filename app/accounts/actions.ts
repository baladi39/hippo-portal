"use server";

import {
  AccountDto,
  AccountFilters,
  AccountWithPlansDto,
  DashboardSummary,
  PlanDto,
  PlanFilters,
} from "@/server/models/account-model";
import { AccountsRepo } from "@/server/repositories/accounts-repo";
import { AccountService } from "@/server/services/account-service";

// Create service and repository instances
const accountService = new AccountService();
const accountsRepo = new AccountsRepo(accountService);

// Re-export types for client use
export type {
  AccountDto,
  AccountFilters,
  AccountWithPlansDto,
  DashboardSummary,
  PlanDto,
  PlanFilters,
};

/**
 * Fetch all accounts with optional filters
 */
export const fetchAccounts = async (filters?: AccountFilters) => {
  try {
    return await accountsRepo.findAll(filters);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch accounts");
  }
};

/**
 * Fetch a specific account by ID
 */
export const fetchAccountById = async (accountId: number) => {
  try {
    return await accountsRepo.findById(accountId);
  } catch (error) {
    console.error(`Error fetching account ID ${accountId}:`, error);
    throw error instanceof Error ? error : new Error("Failed to fetch account");
  }
};

/**
 * Fetch all plans with account information (main data for accounts page)
 */
export const fetchPlansWithAccounts = async (filters?: PlanFilters) => {
  try {
    return await accountsRepo.findAllPlansWithAccounts(filters);
  } catch (error) {
    console.error("Error fetching plans with accounts:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch plans with accounts");
  }
};

/**
 * Search plans with account information
 */
export const searchPlansWithAccounts = async (searchTerm: string) => {
  try {
    if (!searchTerm.trim()) {
      // If no search term, return all plans
      return await accountsRepo.findAllPlansWithAccounts();
    }

    return await accountsRepo.searchPlansWithAccounts(searchTerm);
  } catch (error) {
    console.error("Error searching plans with accounts:", error);
    throw error instanceof Error ? error : new Error("Failed to search plans");
  }
};

/**
 * Fetch accounts with their plans summary
 */
export const fetchAccountsWithPlans = async () => {
  try {
    return await accountsRepo.findAccountsWithPlans();
  } catch (error) {
    console.error("Error fetching accounts with plans:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch accounts with plans");
  }
};

/**
 * Generate dashboard summary statistics
 */
export const generateDashboardSummary = async () => {
  try {
    return await accountsRepo.generateDashboardSummary();
  } catch (error) {
    console.error("Error generating dashboard summary:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to generate dashboard summary");
  }
};

/**
 * Update account information
 */
export const updateAccount = async (
  accountId: number,
  updates: Partial<AccountDto>
) => {
  try {
    return await accountsRepo.updateAccount(accountId, updates);
  } catch (error) {
    console.error(`Error updating account ID ${accountId}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update account");
  }
};

/**
 * Create new account
 */
export const createAccount = async (
  accountData: Omit<AccountDto, "accountId" | "createdDate" | "updatedDate">
) => {
  try {
    return await accountsRepo.createAccount(accountData);
  } catch (error) {
    console.error("Error creating account:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create account");
  }
};

/**
 * Get formatted accounts data for the accounts page table
 * This matches the existing getAccountsWithPlansData function
 */
export const getAccountsWithPlansData = async (filters?: PlanFilters) => {
  try {
    const response = await accountsRepo.findAllPlansWithAccounts(filters);

    return response.plans.map((plan) => ({
      accountId: plan.accountId,
      accountName: plan.accountName,
      accountOfficeDivision: plan.accountOfficeDivision,
      accountPrimarySalesLead: plan.accountPrimarySalesLead || "TBD",
      accountClassification: plan.accountClassification || "TBD",
      carrier: plan.carrier,
      planType: plan.planType,
      planName: plan.planName,
      policyGroupNumber: plan.policyGroupNumber || "TBD",
      effectiveDate: new Date(plan.effectiveDate).toLocaleDateString(),
      renewalDate: new Date(plan.renewalDate).toLocaleDateString(),
      enrollment: plan.enrollment || "TBD",
      annualRevenue: plan.annualRevenue || "TBD",
      planId: plan.planId,
    }));
  } catch (error) {
    console.error("Error getting accounts with plans data:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get accounts data");
  }
};

/**
 * Get summary data for the accounts dashboard
 * This matches the existing getSummaryData function
 */
export const getSummaryData = async () => {
  try {
    return await accountsRepo.generateDashboardSummary();
  } catch (error) {
    console.error("Error getting summary data:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get summary data");
  }
};
