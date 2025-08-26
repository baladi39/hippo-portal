/**
 * Raw Account model from database
 */
export interface AccountModel {
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
}

/**
 * Enhanced Account DTO for frontend consumption
 */
export interface AccountDto {
  accountId: number;
  accountName: string;
  sba: number;
  state: string;
  officeDivision: string; // Using state as office division
  primarySalesLead?: string; // Future field
  classification?: string; // Future field
  commissionBasis1: string;
  commissionBasis2: string;
  flatFee: number;
  percentage: number;
  createdDate: string;
  updatedDate?: string;
}

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
 * Plan with account relationship
 */
export interface PlanWithAccountModel extends PlanModel {
  account: AccountModel;
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
}

/**
 * Account with plans summary
 */
export interface AccountWithPlansDto {
  accountId: number;
  accountName: string;
  accountOfficeDivision: string;
  accountPrimarySalesLead?: string;
  accountClassification?: string;
  plans: PlanDto[];
  totalPlans: number;
  upcomingRenewals: number;
}

/**
 * Search and filter parameters
 */
export interface AccountFilters {
  searchTerm?: string;
  state?: string;
  status?: string;
  sba?: number;
  offset?: number;
  limit?: number;
}

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
 * Summary statistics
 */
export interface DashboardSummary {
  plans: {
    upForRenewal: number;
    expiredNoAction: number;
    newBusiness: number;
  };
  products: {
    upForRenewal: number;
    expiredNoAction: number;
    newBusiness: number;
  };
  recordAssignments: {
    dueToday: number;
    pastDue: number;
    upcoming: number;
  };
  activities: {
    dueToday: number;
    pastDue: number;
    upcoming: number;
  };
  requests: {
    dueToday: number;
    pastDue: number;
    responses: number;
  };
}

/**
 * API Response types
 */
export interface AccountsResponse {
  message: string;
  success: boolean;
  results: {
    accounts: AccountModel[];
    total_count: number;
  };
}

export interface PlansResponse {
  message: string;
  success: boolean;
  results: {
    plans: PlanWithAccountModel[];
    total_count: number;
  };
}
