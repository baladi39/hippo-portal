import {
  Account,
  Plan,
  PlanConfig,
  PlanWithAccount,
  supabase,
} from "./supabase";

// Account operations
export const accountService = {
  async getAll(): Promise<Account[]> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("account");

      if (error) {
        console.error("Error fetching accounts:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error("Error fetching accounts:", err);
      throw err;
    }
  },

  async getById(accountId: number): Promise<Account | null> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("account_id", accountId)
        .single();

      if (error) {
        console.error("Error fetching account:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error fetching account:", err);
      return null;
    }
  },

  async getByName(accountName: string): Promise<Account | null> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("account", accountName)
        .single();

      if (error) {
        console.error("Error fetching account by name:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error fetching account by name:", err);
      return null;
    }
  },

  async search(query: string): Promise<Account[]> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .or(
          `account.ilike.%${query}%,account_classification.ilike.%${query}%,account_primary_sales_lead.ilike.%${query}%`
        )
        .order("account");

      if (error) {
        console.error("Error searching accounts:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error("Error searching accounts:", err);
      throw err;
    }
  },

  async create(
    account: Omit<Account, "account_id" | "created_date" | "updated_date">
  ): Promise<Account | null> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .insert([account])
        .select()
        .single();

      if (error) {
        console.error("Error creating account:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error creating account:", err);
      return null;
    }
  },

  async update(
    accountId: number,
    updates: Partial<Account>
  ): Promise<Account | null> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .update({
          ...updates,
          updated_date: new Date().toISOString(),
        })
        .eq("account_id", accountId)
        .select()
        .single();

      if (error) {
        console.error("Error updating account:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error updating account:", err);
      return null;
    }
  },

  async delete(accountId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("account_id", accountId);

      if (error) {
        console.error("Error deleting account:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error deleting account:", err);
      return false;
    }
  },
};

// Plan operations
export const planService = {
  async getAll(): Promise<PlanWithAccount[]> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select(
          `
          *,
          account:accounts(*),
          plan_type_info:plan_types(plan_type_name, category)
        `
        )
        .order("plan_id");

      if (error) {
        console.error("Error fetching all plans:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      return data || [];
    } catch (err) {
      console.error("Error fetching all plans:", err);
      throw err;
    }
  },

  async getByAccount(accountId: number): Promise<Plan[]> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("account_id", accountId)
        .order("plan");

      if (error) {
        console.error("Error fetching plans by account:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("Error fetching plans by account:", err);
      return [];
    }
  },

  async getByAccountName(accountName: string): Promise<PlanWithAccount[]> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select(
          `
          *,
          account:accounts!inner(*),
          plan_type_info:plan_types(plan_type_name, category)
        `
        )
        .eq("accounts.account", accountName)
        .order("plan_id");

      if (error) {
        console.error("Error fetching plans by account name:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("Error fetching plans by account name:", err);
      return [];
    }
  },

  async getById(planId: number): Promise<PlanWithAccount | null> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select(
          `
          *,
          account:accounts(*),
          plan_type_info:plan_types(plan_type_name, category)
        `
        )
        .eq("plan_id", planId)
        .single();

      if (error) {
        console.error("Error fetching plan:", error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Error fetching plan:", err);
      return null;
    }
  },

  async create(
    plan: Omit<Plan, "plan_id" | "created_date" | "updated_date">
  ): Promise<Plan | null> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .insert([plan])
        .select()
        .single();

      if (error) {
        console.error("Error creating plan:", error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Error creating plan:", err);
      return null;
    }
  },

  async update(planId: number, updates: Partial<Plan>): Promise<Plan | null> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .update({
          ...updates,
          updated_date: new Date().toISOString(),
        })
        .eq("plan_id", planId)
        .select()
        .single();

      if (error) {
        console.error("Error updating plan:", error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Error updating plan:", err);
      return null;
    }
  },

  async delete(planId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("plans")
        .delete()
        .eq("plan_id", planId);

      if (error) {
        console.error("Error deleting plan:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error deleting plan:", err);
      return false;
    }
  },

  async search(query: string): Promise<PlanWithAccount[]> {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select(
          `
          *,
          account:accounts(*),
          plan_type_info:plan_types(plan_type_name, category)
        `
        )
        .or(`carrier.ilike.%${query}%,plan_type.ilike.%${query}%`)
        .order("plan_id");

      if (error) {
        console.error("Error searching plans:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      return data || [];
    } catch (err) {
      console.error("Error searching plans:", err);
      throw err;
    }
  },
};

// Plan types operations
export const planTypeService = {
  async getAll(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("plan_types")
        .select("plan_type_name")
        .eq("is_active", true)
        .order("plan_type_name");

      if (error) {
        console.error("Error fetching plan types:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      // Extract the plan type names from the data
      const types = data?.map((item: any) => item.plan_type_name) || [];

      return types;
    } catch (err) {
      console.error("Error fetching plan types:", err);
      throw err;
    }
  },
};

// Plan configuration operations
export const planConfigService = {
  async create(
    config: Omit<PlanConfig, "id" | "created_at" | "updated_at">
  ): Promise<PlanConfig | null> {
    const { data, error } = await supabase
      .from("plan_configs")
      .insert([config])
      .select()
      .single();

    if (error) {
      console.error("Error creating plan config:", error);
      return null;
    }
    return data;
  },

  async getByPlanId(planId: number): Promise<PlanConfig | null> {
    const { data, error } = await supabase
      .from("plan_configs")
      .select("*")
      .eq("plan_id", planId)
      .single();

    if (error) {
      console.error("Error fetching plan config:", error);
      return null;
    }
    return data;
  },
};
