"use server";

import { PlanDto, PlanFilters } from "@/server/models/account-model";
import { AccountsRepo } from "@/server/repositories/accounts-repo";
import { AccountService } from "@/server/services/account-service";

const accountService = new AccountService();
const accountsRepo = new AccountsRepo(accountService);

// Re-export types for client use
export interface AccountDashboardData {
  plans: PlanDto[];
  accountPlans: PlanDto[];
  summary: {
    totalPlans: number;
    activePlans: number;
    carrierBreakdown: Record<string, number>;
    planTypeBreakdown: Record<string, number>;
  };
}

/**
 * Fetch all plans with account information
 */
export const fetchAllPlans = async (filters?: PlanFilters) => {
  try {
    const response = await accountsRepo.findAllPlansWithAccounts(filters);
    return {
      plans: response.plans,
      total_count: response.total_count,
      message: response.message,
      success: response.success,
    };
  } catch (error) {
    console.error("Error fetching all plans:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch plans");
  }
};

/**
 * Fetch plans for a specific account by account name
 */
export const fetchPlansByAccountName = async (accountName: string) => {
  try {
    const response = await accountsRepo.searchPlansWithAccounts(accountName);
    // Filter the results to only include plans for the specific account
    const filteredPlans = response.plans.filter(
      (plan) => plan.accountName === accountName
    );

    return {
      plans: filteredPlans,
      total_count: filteredPlans.length,
      message: response.message,
      success: response.success,
    };
  } catch (error) {
    console.error(`Error fetching plans for account ${accountName}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch account plans");
  }
};

/**
 * Fetch dashboard data for an account by ID
 */
export const fetchAccountDashboardDataById = async (
  accountId: number
): Promise<AccountDashboardData> => {
  try {
    // First get the account details to get the account name
    const account = await fetchAccountById(accountId);

    // Then fetch dashboard data using the account name
    return await fetchAccountDashboardData(account.accountName);
  } catch (error) {
    console.error(
      `Error fetching dashboard data for account ID ${accountId}:`,
      error
    );
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch dashboard data");
  }
};

/**
 * Fetch dashboard data for an account (or all accounts if no account specified)
 */
export const fetchAccountDashboardData = async (
  accountName?: string
): Promise<AccountDashboardData> => {
  try {
    let plansResponse;

    if (accountName) {
      plansResponse = await fetchPlansByAccountName(accountName);
    } else {
      plansResponse = await accountsRepo.findAllPlansWithAccounts();
    }

    const plans = plansResponse.plans;

    // Generate summary statistics
    const summary = {
      totalPlans: plans.length,
      activePlans: plans.filter((plan: PlanDto) => plan.status === "Active")
        .length,
      carrierBreakdown: plans.reduce(
        (acc: Record<string, number>, plan: PlanDto) => {
          acc[plan.carrier] = (acc[plan.carrier] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      planTypeBreakdown: plans.reduce(
        (acc: Record<string, number>, plan: PlanDto) => {
          acc[plan.planType] = (acc[plan.planType] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    return {
      plans,
      accountPlans: plans, // Same as plans since we've already filtered
      summary,
    };
  } catch (error) {
    console.error("Error fetching account dashboard data:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch dashboard data");
  }
};

/**
 * Get dashboard summary for an account
 */
export const fetchAccountSummary = async (accountName?: string) => {
  try {
    if (accountName) {
      // For specific account, filter plans and generate summary
      const plansResponse = await fetchPlansByAccountName(accountName);
      const plans = plansResponse.plans;

      return {
        totalPlans: plans.length,
        activePlans: plans.filter((plan: PlanDto) => plan.status === "Active")
          .length,
        carrierBreakdown: plans.reduce(
          (acc: Record<string, number>, plan: PlanDto) => {
            acc[plan.carrier] = (acc[plan.carrier] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
        planTypeBreakdown: plans.reduce(
          (acc: Record<string, number>, plan: PlanDto) => {
            acc[plan.planType] = (acc[plan.planType] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      };
    } else {
      // Return overall dashboard summary
      return await accountsRepo.generateDashboardSummary();
    }
  } catch (error) {
    console.error("Error fetching account summary:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch account summary");
  }
};

/**
 * Fetch account details by ID
 */
export const fetchAccountById = async (accountId: number) => {
  try {
    return await accountsRepo.findById(accountId);
  } catch (error) {
    console.error(`Error fetching account ${accountId}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch account details");
  }
};

/**
 * Get all accounts with their plans summary
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
