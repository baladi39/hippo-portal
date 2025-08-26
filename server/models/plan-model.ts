/**
 * Raw Plan model from database
 */
export interface PlanModel {
  plan_id: number;
  account_id: number;
  carrier: string;
  plan_type: string;
  plan_type_id?: number;
  commission_paid_by_carrier?: string;
  billing?: string;
  policy_group_number?: string;
  effective_date: string;
  renewal_date: string;
  cancellation_date?: string;
  status: string;
  created_date: string;
  updated_date?: string;
}

/**
 * Plan with account relationship - includes account information
 */
export interface PlanWithAccountModel extends PlanModel {
  account: {
    account_id: number;
    account: string;
    sba: number;
    state: string;
    commission_1_basis: string;
    commission_2_basis: string;
    flat_fee: number;
    percentage: number;
    created_date: string;
    updated_date?: string;
  };
}

/**
 * Enhanced Plan DTO for frontend consumption
 */
export interface PlanDto {
  planId: number;
  accountId: number;
  accountName: string;
  accountOfficeDivision: string;
  accountPrimarySalesLead?: string;
  accountClassification?: string;
  carrier: string;
  planType: string;
  planTypeId?: number;
  planName: string;
  policyGroupNumber?: string;
  effectiveDate: string;
  renewalDate: string;
  cancellationDate?: string;
  status: string;
  enrollment?: string; // Future field
  annualRevenue?: string; // Future field
  createdDate: string;
  updatedDate?: string;
  commissionPaidByCarrier?: string;
  billing?: string;
}

/**
 * Plan creation/update data
 */
export interface CreatePlanData {
  account_id: number;
  carrier: string;
  plan_type: string;
  plan_type_id?: number;
  commission_paid_by_carrier?: string;
  billing?: string;
  policy_group_number?: string;
  effective_date: string;
  renewal_date: string;
  cancellation_date?: string;
  status: string;
}

export interface UpdatePlanData extends Partial<CreatePlanData> {
  plan_id: number;
}

/**
 * Search and filter parameters for plans
 */
export interface PlanFilters {
  searchTerm?: string;
  accountId?: number;
  carrier?: string;
  planType?: string;
  status?: string;
  effectiveDateFrom?: string;
  effectiveDateTo?: string;
  renewalDateFrom?: string;
  renewalDateTo?: string;
  offset?: number;
  limit?: number;
}

/**
 * Plan statistics and summary data
 */
export interface PlanSummary {
  totalPlans: number;
  activeePlans: number;
  upcomingRenewals: number;
  expiredPlans: number;
  plansByCarrier: Record<string, number>;
  plansByType: Record<string, number>;
  plansByStatus: Record<string, number>;
}

/**
 * API Response types for plans
 */
export interface PlansResponse {
  message: string;
  success: boolean;
  results: {
    plans: PlanWithAccountModel[];
    total_count: number;
  };
}

export interface PlanResponse {
  message: string;
  success: boolean;
  results: PlanModel;
}

export interface PlanSummaryResponse {
  message: string;
  success: boolean;
  results: PlanSummary;
}
