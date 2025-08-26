import {
  CreatePlanData,
  PlanDto,
  PlanFilters,
  PlanModel,
  PlanSummary,
  PlanWithAccountModel,
} from "../models/plan-model";
import { PlanService } from "../services/plan-service";

/**
 * Plans Repository - handles business logic and data transformation
 * between the service layer and the frontend
 */
export class PlansRepo {
  constructor(private planService: PlanService) {}

  /**
   * Find all plans with optional filters
   */
  async findAll(filters?: PlanFilters): Promise<{
    plans: PlanDto[];
    total_count: number;
    message: string;
    success: boolean;
  }> {
    try {
      const response = await this.planService.fetchPlans(filters);
      const planDtos = response.results.plans.map(this.mapToPlanDto);

      return {
        plans: planDtos,
        total_count: response.results.total_count,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error in PlansRepo.findAll:", error);
      throw error;
    }
  }

  /**
   * Find plan by ID
   */
  async findById(planId: number): Promise<PlanDto> {
    try {
      const plan = await this.planService.fetchPlanById(planId);

      // For individual plan fetch, we need to get account info separately
      // This is a simplified version - you might want to modify the service
      // to include account info for single plan queries
      return this.mapPlanModelToDto(plan);
    } catch (error) {
      console.error(`Error in PlansRepo.findById(${planId}):`, error);
      throw error;
    }
  }

  /**
   * Find plans by account ID
   */
  async findByAccountId(accountId: number): Promise<PlanDto[]> {
    try {
      const plans = await this.planService.fetchPlansByAccountId(accountId);
      return plans.map(this.mapPlanModelToDto);
    } catch (error) {
      console.error(`Error in PlansRepo.findByAccountId(${accountId}):`, error);
      throw error;
    }
  }

  /**
   * Create new plan
   */
  async create(planData: CreatePlanData): Promise<PlanDto> {
    try {
      const plan = await this.planService.createPlan(planData);
      return this.mapPlanModelToDto(plan);
    } catch (error) {
      console.error("Error in PlansRepo.create:", error);
      throw error;
    }
  }

  /**
   * Update plan
   */
  async update(
    planId: number,
    updates: Partial<CreatePlanData>
  ): Promise<PlanDto> {
    try {
      const plan = await this.planService.updatePlan(planId, updates);
      return this.mapPlanModelToDto(plan);
    } catch (error) {
      console.error(`Error in PlansRepo.update(${planId}):`, error);
      throw error;
    }
  }

  /**
   * Update plan status
   */
  async updateStatus(planId: number, status: string): Promise<PlanDto> {
    try {
      const plan = await this.planService.updatePlanStatus(planId, status);
      return this.mapPlanModelToDto(plan);
    } catch (error) {
      console.error(
        `Error in PlansRepo.updateStatus(${planId}, ${status}):`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete plan (soft delete)
   */
  async delete(planId: number): Promise<void> {
    try {
      await this.planService.deletePlan(planId);
    } catch (error) {
      console.error(`Error in PlansRepo.delete(${planId}):`, error);
      throw error;
    }
  }

  /**
   * Get plans summary statistics
   */
  async getSummary(): Promise<PlanSummary> {
    try {
      const response = await this.planService.getPlansSummary();
      return response.results;
    } catch (error) {
      console.error("Error in PlansRepo.getSummary:", error);
      throw error;
    }
  }

  /**
   * Get upcoming renewals
   */
  async getUpcomingRenewals(days: number = 30): Promise<{
    plans: PlanDto[];
    total_count: number;
    message: string;
    success: boolean;
  }> {
    try {
      const response = await this.planService.getUpcomingRenewals(days);
      const planDtos = response.results.plans.map(this.mapToPlanDto);

      return {
        plans: planDtos,
        total_count: response.results.total_count,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error in PlansRepo.getUpcomingRenewals:", error);
      throw error;
    }
  }

  /**
   * Search plans with account information
   */
  async searchPlansWithAccounts(filters?: PlanFilters): Promise<{
    plans: PlanDto[];
    total_count: number;
    message: string;
    success: boolean;
  }> {
    try {
      const response = await this.planService.fetchPlans(filters);

      // Filter by search term if provided (enhanced search across account names)
      let filteredPlans = response.results.plans;

      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredPlans = response.results.plans.filter((planWithAccount) => {
          const accountName =
            planWithAccount.account?.account?.toLowerCase() || "";
          const carrier = planWithAccount.carrier.toLowerCase();
          const planType = planWithAccount.plan_type.toLowerCase();
          const policyNumber =
            planWithAccount.policy_group_number?.toLowerCase() || "";

          return (
            accountName.includes(searchTerm) ||
            carrier.includes(searchTerm) ||
            planType.includes(searchTerm) ||
            policyNumber.includes(searchTerm)
          );
        });
      }

      const planDtos = filteredPlans.map(this.mapToPlanDto);

      return {
        plans: planDtos,
        total_count: filteredPlans.length,
        message: "Plans searched successfully",
        success: true,
      };
    } catch (error) {
      console.error("Error in PlansRepo.searchPlansWithAccounts:", error);
      throw error;
    }
  }

  /**
   * Map API plan with account model to DTO for the client
   */
  private mapToPlanDto(planWithAccount: PlanWithAccountModel): PlanDto {
    const account = planWithAccount.account;

    return {
      planId: planWithAccount.plan_id,
      accountId: planWithAccount.account_id,
      accountName: account?.account || "Unknown Account",
      accountOfficeDivision: account?.state || "",
      accountPrimarySalesLead: undefined, // Future field
      accountClassification: undefined, // Future field
      carrier: planWithAccount.carrier,
      planType: planWithAccount.plan_type,
      planName: `${planWithAccount.carrier} ${planWithAccount.plan_type}`,
      policyGroupNumber: planWithAccount.policy_group_number,
      effectiveDate: planWithAccount.effective_date,
      renewalDate: planWithAccount.renewal_date,
      cancellationDate: planWithAccount.cancellation_date,
      status: planWithAccount.status,
      enrollment: undefined, // Future field
      annualRevenue: undefined, // Future field
      createdDate: planWithAccount.created_date,
      updatedDate: planWithAccount.updated_date,
      commissionPaidByCarrier: planWithAccount.commission_paid_by_carrier,
      billing: planWithAccount.billing,
    };
  }

  /**
   * Map plain plan model to DTO (without account info)
   */
  private mapPlanModelToDto(plan: PlanModel): PlanDto {
    return {
      planId: plan.plan_id,
      accountId: plan.account_id,
      accountName: "Account " + plan.account_id, // Fallback when account info not available
      accountOfficeDivision: "",
      accountPrimarySalesLead: undefined,
      accountClassification: undefined,
      carrier: plan.carrier,
      planType: plan.plan_type,
      planTypeId: plan.plan_type_id,
      planName: `${plan.carrier} ${plan.plan_type}`,
      policyGroupNumber: plan.policy_group_number,
      effectiveDate: plan.effective_date,
      renewalDate: plan.renewal_date,
      cancellationDate: plan.cancellation_date,
      status: plan.status,
      enrollment: undefined,
      annualRevenue: undefined,
      createdDate: plan.created_date,
      updatedDate: plan.updated_date,
      commissionPaidByCarrier: plan.commission_paid_by_carrier,
      billing: plan.billing,
    };
  }
}
