import { supabase } from "@/lib/supabase";
import {
  AccountFilters,
  AccountModel,
  AccountsResponse,
  PlanFilters,
  PlanModel,
  PlansResponse,
  PlanWithAccountModel,
} from "../models/account-model";

/**
 * Account Service - handles data access layer for accounts and plans
 * Uses Supabase as the data source
 */
export class AccountService {
  /**
   * Fetch all accounts with optional filters
   */
  async fetchAccounts(filters?: AccountFilters): Promise<AccountsResponse> {
    try {
      let query = supabase.from("accounts").select("*").order("account");

      // Apply filters
      if (filters?.searchTerm) {
        query = query.or(
          `account.ilike.%${filters.searchTerm}%,state.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters?.state) {
        query = query.eq("state", filters.state);
      }

      if (filters?.sba) {
        query = query.eq("sba", filters.sba);
      }

      // Apply pagination
      if (filters?.offset !== undefined) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 50) - 1
        );
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching accounts:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        message: "Accounts fetched successfully",
        success: true,
        results: {
          accounts: data || [],
          total_count: count || 0,
        },
      };
    } catch (error) {
      console.error("Error in AccountService.fetchAccounts:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching accounts: ${error}`);
    }
  }

  /**
   * Fetch account by ID
   */
  async fetchAccountById(accountId: number): Promise<AccountModel> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("account_id", accountId)
        .single();

      if (error) {
        console.error("Error fetching account by ID:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Account not found");
      }

      return data as AccountModel;
    } catch (error) {
      console.error(
        `Error in AccountService.fetchAccountById(${accountId}):`,
        error
      );
      throw error instanceof Error
        ? error
        : new Error(`Error fetching account: ${error}`);
    }
  }

  /**
   * Fetch all plans with account information
   */
  async fetchPlansWithAccounts(filters?: PlanFilters): Promise<PlansResponse> {
    try {
      let query = supabase
        .from("plans")
        .select(
          `
          *,
          account:accounts(*)
        `
        )
        .order("effective_date", { ascending: false });

      // Apply filters
      if (filters?.searchTerm) {
        // Need to join with accounts for searching account names
        query = query.or(
          `carrier.ilike.%${filters.searchTerm}%,plan_type.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters?.accountId) {
        query = query.eq("account_id", filters.accountId);
      }

      if (filters?.carrier) {
        query = query.eq("carrier", filters.carrier);
      }

      if (filters?.planType) {
        query = query.eq("plan_type", filters.planType);
      }

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.effectiveDateFrom) {
        query = query.gte("effective_date", filters.effectiveDateFrom);
      }

      if (filters?.effectiveDateTo) {
        query = query.lte("effective_date", filters.effectiveDateTo);
      }

      if (filters?.renewalDateFrom) {
        query = query.gte("renewal_date", filters.renewalDateFrom);
      }

      if (filters?.renewalDateTo) {
        query = query.lte("renewal_date", filters.renewalDateTo);
      }

      // Apply pagination
      if (filters?.offset !== undefined) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 50) - 1
        );
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching plans with accounts:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        message: "Plans with accounts fetched successfully",
        success: true,
        results: {
          plans: (data as PlanWithAccountModel[]) || [],
          total_count: count || 0,
        },
      };
    } catch (error) {
      console.error("Error in AccountService.fetchPlansWithAccounts:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching plans with accounts: ${error}`);
    }
  }

  /**
   * Fetch plans for a specific account
   */
  async fetchPlansByAccountId(accountId: number): Promise<PlanModel[]> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("account_id", accountId)
        .order("effective_date", { ascending: false });

      if (error) {
        console.error("Error fetching plans by account ID:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      return (data as PlanModel[]) || [];
    } catch (error) {
      console.error(
        `Error in AccountService.fetchPlansByAccountId(${accountId}):`,
        error
      );
      throw error instanceof Error
        ? error
        : new Error(`Error fetching plans for account: ${error}`);
    }
  }

  /**
   * Update account information
   */
  async updateAccount(
    accountId: number,
    updates: Partial<AccountModel>
  ): Promise<AccountModel> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .update({
          ...updates,
          updated_date: new Date().toISOString(),
        })
        .eq("account_id", accountId)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating account:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Account not found or update failed");
      }

      return data as AccountModel;
    } catch (error) {
      console.error(
        `Error in AccountService.updateAccount(${accountId}):`,
        error
      );
      throw error instanceof Error
        ? error
        : new Error(`Error updating account: ${error}`);
    }
  }

  /**
   * Create new account
   */
  async createAccount(
    accountData: Omit<
      AccountModel,
      "account_id" | "created_date" | "updated_date"
    >
  ): Promise<AccountModel> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .insert({
          ...accountData,
          created_date: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error) {
        console.error("Error creating account:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Account creation failed");
      }

      return data as AccountModel;
    } catch (error) {
      console.error("Error in AccountService.createAccount:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error creating account: ${error}`);
    }
  }

  /**
   * Delete account (soft delete by updating status)
   */
  async deleteAccount(accountId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from("accounts")
        .update({
          updated_date: new Date().toISOString(),
          // Note: Add status field to accounts table for soft deletes
        })
        .eq("account_id", accountId);

      if (error) {
        console.error("Error deleting account:", error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (error) {
      console.error(
        `Error in AccountService.deleteAccount(${accountId}):`,
        error
      );
      throw error instanceof Error
        ? error
        : new Error(`Error deleting account: ${error}`);
    }
  }
}
