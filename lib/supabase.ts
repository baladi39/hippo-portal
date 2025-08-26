import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types matching the new schema
export interface Account {
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

export interface PlanType {
  plan_type_id: number;
  plan_type_name: string;
  category: string;
  is_active: boolean;
  created_date: string;
  updated_date?: string;
}

export interface Carrier {
  carrier_id: number;
  company_name: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Plan {
  plan_id: number;
  account_id: number;
  carrier: string;
  plan_type: string;
  plan_type_id?: number;
  carrier_id?: number;
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

// Extended type for joined data (used in views)
export interface PlanWithAccount extends Plan {
  annual_employee_cost: number;
  annual_revenue: number;
  annual_commission: number;
  enrollment: number;
  account: Account;
  plan_type_info?: PlanType;
  carrier_info?: Carrier;
}

export interface PlanConfig {
  id?: number;
  carrier: string;
  billing_type: string;
  plan_name: string;
  policy_number?: string;
  original_effective_date?: string;
  effective_date: string;
  commission_start_date?: string;
  funding: string;
  plan_id?: number;
  created_at?: string;
  updated_at?: string;
}
