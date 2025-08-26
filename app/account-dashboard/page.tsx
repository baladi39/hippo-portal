"use client";

import { DashboardTab, PlansTab } from "@/components/account-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import {
  PageHeader,
  createAccountDashboardActions,
} from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountDto } from "@/server/models/account-model";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAccountById } from "./actions";

export default function AccountDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read accountId from URL parameters
  const accountIdParam = searchParams.get("accountId");
  const accountId = accountIdParam ? parseInt(accountIdParam) : null;
  const currentTab = searchParams.get("tab") || "dashboard";

  // State for account data
  const [account, setAccount] = useState<AccountDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch account data when accountId changes
  useEffect(() => {
    const loadAccount = async () => {
      if (!accountId) {
        setAccount(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const accountData = await fetchAccountById(accountId);
        setAccount(accountData);
      } catch (err) {
        console.error("Error loading account:", err);
        setError(err instanceof Error ? err.message : "Failed to load account");
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [accountId]);

  const handleTabChange = (newTab: string) => {
    const params = new URLSearchParams();

    // Preserve existing accountId parameter
    if (accountId) {
      params.set("accountId", accountId.toString());
    }

    // Add the new tab parameter
    params.set("tab", newTab);

    // Update the URL without causing a page refresh
    router.push(`/account-dashboard?${params.toString()}`, { scroll: false });
  };

  // Show loading state while fetching account data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Hippo Portal - Account Dashboard"
          actions={createAccountDashboardActions(undefined)}
        />
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Card>
            <CardContent className="p-8">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Hippo Portal - Account Dashboard"
          actions={createAccountDashboardActions(undefined)}
        />
        <div className="max-w-7xl mx-auto p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Error Loading Account
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Hippo Portal - Account Dashboard"
        actions={createAccountDashboardActions(account?.accountName)}
      />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {account?.accountName || "Account Dashboard"}
          </h2>
          <p className="text-gray-600">
            {account
              ? `Detailed overview of ${account.accountName}'s hippo portfolio`
              : "Please select an account to view details"}
          </p>
        </div>

        {
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
                selectedAccount={account?.accountName || null}
                accountId={accountId}
              />
            </TabsContent>

            <TabsContent value="plans">
              <PlansTab
                selectedAccount={account?.accountName || null}
                accountId={accountId}
              />
            </TabsContent>
          </Tabs>
        }
      </div>
    </div>
  );
}
