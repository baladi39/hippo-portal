"use client";

import { DashboardTab, PlansTab } from "@/components/account-dashboard";
import {
  PageHeader,
  createAccountDashboardActions,
} from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanWithAccount } from "@/lib/supabase";
import { PlanDto } from "@/server/models/account-model";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountDashboardData, fetchAccountDashboardData } from "./actions";

export default function AccountDashboardPage() {
  const [plans, setPlans] = useState<PlanWithAccount[]>([]);
  const [accountPlans, setAccountPlans] = useState<PlanWithAccount[]>([]);
  const [dashboardData, setDashboardData] =
    useState<AccountDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedAccount = searchParams.get("account");
  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    loadDashboardData();
  }, [selectedAccount]);

  const handleTabChange = (newTab: string) => {
    const params = new URLSearchParams();

    // Preserve existing account parameter
    if (selectedAccount) {
      params.set("account", selectedAccount);
    }

    // Add the new tab parameter
    params.set("tab", newTab);

    // Update the URL without causing a page refresh
    router.push(`/account-dashboard?${params.toString()}`, { scroll: false });
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchAccountDashboardData(
        selectedAccount || undefined
      );
      setDashboardData(data);

      // Convert PlanDto to PlanWithAccount format for existing components
      const convertedPlans = convertPlansForComponents(data.plans);
      setPlans(convertedPlans);
      setAccountPlans(convertedPlans);

      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load dashboard data"
      );
      setPlans([]);
      setAccountPlans([]);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  // Convert PlanDto[] to PlanWithAccount format expected by existing components
  const convertPlansForComponents = (
    planDtos: PlanDto[]
  ): PlanWithAccount[] => {
    return planDtos.map((plan) => ({
      plan_id: plan.planId,
      annual_employee_cost: 0, // Default value - could be fetched separately if needed
      annual_revenue: 0, // Default value - could be fetched separately if needed
      annual_commission: 0, // Default value - could be fetched separately if needed
      enrollment: 0, // Default value - could be fetched separately if needed
      account_id: plan.accountId,
      carrier: plan.carrier,
      plan_type: plan.planType,
      plan_type_id: undefined,
      commission_paid_by_carrier: undefined,
      billing: undefined,
      policy_group_number: plan.policyGroupNumber,
      effective_date: plan.effectiveDate,
      renewal_date: plan.renewalDate,
      cancellation_date: plan.cancellationDate,
      status: plan.status,
      created_date: plan.createdDate,
      updated_date: plan.updatedDate,
      account: {
        account_id: plan.accountId,
        account: plan.accountName,
        sba: 0, // Default value - could be fetched separately if needed
        state: plan.accountOfficeDivision,
        commission_1_basis: "",
        commission_2_basis: "",
        flat_fee: 0,
        percentage: 0,
        created_date: plan.createdDate,
        updated_date: plan.updatedDate,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Hippo Portal - Account Dashboard"
        actions={createAccountDashboardActions(selectedAccount || undefined)}
      />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {selectedAccount || "Account Dashboard"}
          </h2>
          <p className="text-gray-600">
            {selectedAccount
              ? `Detailed overview of ${selectedAccount}'s hippo portfolio`
              : "Please select an account to view details"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading account dashboard...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p className="font-medium">Error loading account dashboard</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Account Dashboard</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardTab
                selectedAccount={selectedAccount}
                accountPlans={accountPlans}
              />
            </TabsContent>

            <TabsContent value="plans">
              <PlansTab
                selectedAccount={selectedAccount}
                accountPlans={accountPlans}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
