import { supabase } from "@/lib/supabase";
import {
  CreatePlanData,
  PlanFilters,
  PlanModel,
  PlansResponse,
  PlanSummary,
  PlanSummaryResponse,
  PlanWithAccountModel,
} from "../models/plan-model";

/**
 * Plan Service - handles data access layer for plans
 * Uses Supabase as the data source
 */
export class PlanService {
  /**
   * Fetch all plans with optional filters
   */
  async fetchPlans(filters?: PlanFilters): Promise<PlansResponse> {
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
        // Search in plan fields and account name
        query = query.or(
          `carrier.ilike.%${filters.searchTerm}%,plan_type.ilike.%${filters.searchTerm}%,policy_group_number.ilike.%${filters.searchTerm}%`
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
        console.error("Error fetching plans:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        message: "Plans fetched successfully",
        success: true,
        results: {
          plans: (data as PlanWithAccountModel[]) || [],
          total_count: count || 0,
        },
      };
    } catch (error) {
      console.error("Error in PlanService.fetchPlans:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching plans: ${error}`);
    }
  }

  /**
   * Fetch plan by ID
   */
  async fetchPlanById(planId: number): Promise<PlanModel> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("plan_id", planId)
        .single();

      if (error) {
        console.error("Error fetching plan by ID:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Plan not found");
      }

      return data as PlanModel;
    } catch (error) {
      console.error(`Error in PlanService.fetchPlanById(${planId}):`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching plan: ${error}`);
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
        `Error in PlanService.fetchPlansByAccountId(${accountId}):`,
        error
      );
      throw error instanceof Error
        ? error
        : new Error(`Error fetching plans for account: ${error}`);
    }
  }

  /**
   * Create new plan
   */
  async createPlan(planData: CreatePlanData): Promise<PlanModel> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .insert({
          ...planData,
          created_date: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error) {
        console.error("Error creating plan:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Plan creation failed");
      }

      return data as PlanModel;
    } catch (error) {
      console.error("Error in PlanService.createPlan:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error creating plan: ${error}`);
    }
  }

  /**
   * Update plan information
   */
  async updatePlan(
    planId: number,
    updates: Partial<CreatePlanData>
  ): Promise<PlanModel> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .update({
          ...updates,
          updated_date: new Date().toISOString(),
        })
        .eq("plan_id", planId)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating plan:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Plan not found or update failed");
      }

      return data as PlanModel;
    } catch (error) {
      console.error(`Error in PlanService.updatePlan(${planId}):`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error updating plan: ${error}`);
    }
  }

  /**
   * Update plan status
   */
  async updatePlanStatus(planId: number, status: string): Promise<PlanModel> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .update({
          status,
          updated_date: new Date().toISOString(),
        })
        .eq("plan_id", planId)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating plan status:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Plan not found or status update failed");
      }

      return data as PlanModel;
    } catch (error) {
      console.error(`Error in PlanService.updatePlanStatus(${planId}):`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error updating plan status: ${error}`);
    }
  }

  /**
   * Delete plan (soft delete by updating status)
   */
  async deletePlan(planId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from("plans")
        .update({
          status: "cancelled",
          updated_date: new Date().toISOString(),
        })
        .eq("plan_id", planId);

      if (error) {
        console.error("Error deleting plan:", error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (error) {
      console.error(`Error in PlanService.deletePlan(${planId}):`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error deleting plan: ${error}`);
    }
  }

  /**
   * Get plans summary statistics
   */
  async getPlansSummary(): Promise<PlanSummaryResponse> {
    try {
      // Get all plans for summary calculations
      const { data: plans, error } = await supabase.from("plans").select("*");

      if (error) {
        console.error("Error fetching plans for summary:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      const plansData = plans || [];
      const today = new Date();
      const thirtyDaysFromNow = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000
      );

      // Calculate summary statistics
      const totalPlans = plansData.length;
      const activePlans = plansData.filter((p) => p.status === "active").length;
      const upcomingRenewals = plansData.filter((plan) => {
        const renewalDate = new Date(plan.renewal_date);
        return (
          renewalDate >= today &&
          renewalDate <= thirtyDaysFromNow &&
          plan.status === "active"
        );
      }).length;
      const expiredPlans = plansData.filter(
        (p) => p.status === "expired"
      ).length;

      // Group by carrier
      const plansByCarrier = plansData.reduce((acc, plan) => {
        acc[plan.carrier] = (acc[plan.carrier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group by type
      const plansByType = plansData.reduce((acc, plan) => {
        acc[plan.plan_type] = (acc[plan.plan_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group by status
      const plansByStatus = plansData.reduce((acc, plan) => {
        acc[plan.status] = (acc[plan.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const summary: PlanSummary = {
        totalPlans,
        activeePlans: activePlans,
        upcomingRenewals,
        expiredPlans,
        plansByCarrier,
        plansByType,
        plansByStatus,
      };

      return {
        message: "Plans summary fetched successfully",
        success: true,
        results: summary,
      };
    } catch (error) {
      console.error("Error in PlanService.getPlansSummary:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching plans summary: ${error}`);
    }
  }

  /**
   * Get plans with upcoming renewals
   */
  async getUpcomingRenewals(days: number = 30): Promise<PlansResponse> {
    try {
      const today = new Date();
      const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

      const { data, error, count } = await supabase
        .from("plans")
        .select(
          `
          *,
          account:accounts(*)
        `
        )
        .gte("renewal_date", today.toISOString().split("T")[0])
        .lte("renewal_date", futureDate.toISOString().split("T")[0])
        .eq("status", "active")
        .order("renewal_date", { ascending: true });

      if (error) {
        console.error("Error fetching upcoming renewals:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        message: `Plans with renewals in the next ${days} days fetched successfully`,
        success: true,
        results: {
          plans: (data as PlanWithAccountModel[]) || [],
          total_count: count || 0,
        },
      };
    } catch (error) {
      console.error("Error in PlanService.getUpcomingRenewals:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching upcoming renewals: ${error}`);
    }
  }

  /**
   * Fetch all active plan types
   */
  async fetchPlanTypes(): Promise<
    { plan_type_id: number; plan_type_name: string; category: string }[]
  > {
    try {
      const { data, error } = await supabase
        .from("plan_types")
        .select("plan_type_id, plan_type_name, category")
        .eq("is_active", true)
        .order("plan_type_name");

      if (error) {
        console.error("Error fetching plan types:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error in PlanService.fetchPlanTypes:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching plan types: ${error}`);
    }
  }

  /**
   * Fetch a specific plan type by ID
   */
  async fetchPlanTypeById(
    planTypeId: number
  ): Promise<{
    plan_type_id: number;
    plan_type_name: string;
    category: string;
  } | null> {
    try {
      const { data, error } = await supabase
        .from("plan_types")
        .select("plan_type_id, plan_type_name, category")
        .eq("plan_type_id", planTypeId)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Error fetching plan type:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(
        `Error in PlanService.fetchPlanTypeById(${planTypeId}):`,
        error
      );
      return null;
    }
  }
}
