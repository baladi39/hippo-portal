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

export interface Plan {
  plan_id: number;
  account_id: number;
  plan: string;
  carrier: string;
  plan_type: string;
  enrollment: number;
  monthly_employee_cost: number;
  monthly_employer_cost: number;
  annual_employee_cost: number;
  annual_employer_cost: number;
  annual_revenue: number;
  annual_commission: number;
  effective_date: string;
  renewal_date: string;
  created_date: string;
  updated_date?: string;
}

// Extended type for joined data (used in views)
export interface PlanWithAccount extends Plan {
  account: Account;
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
