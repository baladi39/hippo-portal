"use client";

import { DashboardTab, PlansTab } from "@/components/account-dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { planService } from "@/lib/database";
import { PlanWithAccount } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountDashboardPage() {
  const [plans, setPlans] = useState<PlanWithAccount[]>([]);
  const [accountPlans, setAccountPlans] = useState<PlanWithAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const selectedAccount = searchParams.get("account");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await planService.getAll();
      setPlans(data);

      // Filter plans for the selected account
      if (selectedAccount) {
        const filteredPlans = data.filter(
          (plan) => plan.account.account === selectedAccount
        );
        setAccountPlans(filteredPlans);
      } else {
        setAccountPlans(data);
      }

      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Failed to load plans:", error);
      setError(error instanceof Error ? error.message : "Failed to load plans");
      setPlans([]);
      setAccountPlans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Hippo Portal - Account Dashboard
            </h1>
            <div className="flex gap-2">
              <Link href="/accounts">
                <Button variant="outline">Back to Accounts</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

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
              onClick={loadPlans}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="w-full">
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
