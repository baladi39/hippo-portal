"use server";

import {
  CreatePlanData,
  PlanDto,
  PlanFilters,
} from "@/server/models/plan-model";
import { PlanTypesRepo } from "@/server/repositories/plan-types-repo";
import { PlansRepo } from "@/server/repositories/plans-repo";
import { PlanService } from "@/server/services/plan-service";

// Create service and repository instances
const planService = new PlanService();
const plansRepo = new PlansRepo(planService);
const planTypesRepo = new PlanTypesRepo(planService);

// Re-export types for client use
export type { CreatePlanData, PlanDto, PlanFilters };

/**
 * Plan type with ID and name
 */
export interface PlanTypeOption {
  plan_type_id: number;
  plan_type_name: string;
  category: string;
}

/**
 * Replacement plan configuration data
 */
export interface ReplacePlanConfig {
  originalPlanId: number;
  accountId: number;
  accountName: string;
  replacementPlanTypeId: number;
  replacementPlanTypeName: string;
  nonBrokered: boolean;
  includeSplits: string;
  includeContributions: string;
  includeEligibilityRules: string;
}

/**
 * Fetch plan types available for replacement
 */
export const fetchPlanTypes = async (): Promise<PlanTypeOption[]> => {
  try {
    const planTypes = await planTypesRepo.findAll();
    // Convert DTO back to the expected format for the frontend
    return planTypes.map((dto) => ({
      plan_type_id: dto.id,
      plan_type_name: dto.name,
      category: dto.category,
    }));
  } catch (error) {
    console.error("Error fetching plan types:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch plan types");
  }
};

/**
 * Fetch a specific plan by ID for replacement
 */
export const fetchPlanById = async (planId: number) => {
  try {
    return await plansRepo.findById(planId);
  } catch (error) {
    console.error(`Error fetching plan ID ${planId}:`, error);
    throw error instanceof Error ? error : new Error("Failed to fetch plan");
  }
};

/**
 * Validate replacement plan configuration
 */
export const validateReplacementPlan = async (config: ReplacePlanConfig) => {
  try {
    // Basic validation logic
    if (!config.originalPlanId) {
      throw new Error("Original plan ID is required");
    }

    if (!config.replacementPlanTypeName) {
      throw new Error("Replacement plan type is required");
    }

    if (!config.accountId) {
      throw new Error("Account ID is required");
    }

    // Check if the original plan exists
    await plansRepo.findById(config.originalPlanId);

    return {
      valid: true,
      message: "Replacement plan configuration is valid",
    };
  } catch (error) {
    console.error("Error validating replacement plan:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to validate replacement plan");
  }
};

/**
 * Create replacement plan
 */
export const createReplacementPlan = async (config: ReplacePlanConfig) => {
  try {
    // First validate the configuration
    await validateReplacementPlan(config);

    // Get the original plan details
    const originalPlan = await plansRepo.findById(config.originalPlanId);

    // Create replacement plan data based on config
    const replacementData: CreatePlanData = {
      account_id: config.accountId,
      carrier: "TBD", // Will be configured in plan-config
      plan_type: config.replacementPlanTypeName,
      plan_type_id: config.replacementPlanTypeId,
      effective_date: new Date().toISOString().split("T")[0], // Today's date
      renewal_date: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0], // One year from now
      status: "pending_configuration",
    };

    return await plansRepo.create(replacementData);
  } catch (error) {
    console.error(`Error creating replacement plan:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create replacement plan");
  }
};

/**
 * Cancel plan replacement process
 */
export const cancelPlanReplacement = async (planId: number) => {
  try {
    // Update the plan status to cancelled
    return await plansRepo.updateStatus(planId, "cancelled");
  } catch (error) {
    console.error(`Error canceling replacement for plan ID ${planId}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to cancel plan replacement");
  }
};

/**
 * Get plans for a specific account (useful for replacement context)
 */
export const getPlansByAccount = async (accountId: number) => {
  try {
    return await plansRepo.findByAccountId(accountId);
  } catch (error) {
    console.error(`Error fetching plans for account ID ${accountId}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch account plans");
  }
};
