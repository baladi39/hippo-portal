"use client";

import {
  fetchAccountDashboardData,
  fetchAccountDashboardDataById,
} from "@/app/account-dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanDto } from "@/server/models/account-model";
import { FileText, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardTabProps {
  selectedAccount: string | null;
  accountId?: number | null;
}

interface AccountDashboardData {
  plans: PlanDto[];
  accountPlans: PlanDto[];
  summary: {
    totalPlans: number;
    activePlans: number;
    carrierBreakdown: Record<string, number>;
    planTypeBreakdown: Record<string, number>;
  };
}

export function DashboardTab({
  selectedAccount,
  accountId,
}: DashboardTabProps) {
  const [accountData, setAccountData] = useState<AccountDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to safely parse numeric values
  const safeParseFloat = (value: string | undefined | null): number => {
    if (!value || value.trim() === "") return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  useEffect(() => {
    const loadAccountData = async () => {
      // If neither accountId nor selectedAccount is provided, don't load data
      if (!accountId && !selectedAccount) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let data;
        if (accountId) {
          // Prefer accountId if available
          data = await fetchAccountDashboardDataById(accountId);
        } else if (selectedAccount) {
          // Fall back to selectedAccount name
          data = await fetchAccountDashboardData(selectedAccount);
        }

        setAccountData(data || null);
      } catch (err) {
        console.error("Error loading account data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load account data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, [selectedAccount, accountId]);

  // Get account details from the first plan of the selected account
  const accountPlans = accountData?.accountPlans || [];
  const accountDetails = accountPlans.length > 0 ? accountPlans[0] : null;

  // Calculate revenue metrics using the new schema
  const calculatePremiumYTD = () => {
    return accountPlans.reduce((sum, plan) => {
      return sum + safeParseFloat(plan.annualRevenue);
    }, 0);
  };

  const calculateEstimatedAnnualizedPremium = () => {
    return calculatePremiumYTD(); // Already annualized in the new schema
  };

  const premiumYTD = calculatePremiumYTD();
  const estimatedAnnualizedPremium = calculateEstimatedAnnualizedPremium();
  const revenueYTD = accountPlans.reduce((sum, plan) => {
    return sum + safeParseFloat(plan.annualRevenue);
  }, 0);
  const estimatedAnnualizedRevenue = accountPlans.reduce((sum, plan) => {
    return sum + safeParseFloat(plan.annualRevenue);
  }, 0);

  // Show message when no account is selected
  if (!accountId && !selectedAccount) {
    return (
      <div className="mt-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Account Selected
            </h3>
            <p className="text-gray-600">
              Please select an account from the accounts page to view dashboard
              details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mt-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Error Loading Account Data
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Revenue/Premium Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Premium YTD</CardTitle>
            <CardDescription className="text-xs">
              Applied Jan 2025 - Aug 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {premiumYTD.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Estimated Annualized Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {estimatedAnnualizedPremium.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Revenue YTD</CardTitle>
            <CardDescription className="text-xs">
              Applied Jan 2025 - Aug 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {revenueYTD.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Estimated Annualized Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {estimatedAnnualizedRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedAccount || "Account"} Details
            </CardTitle>
            <CardDescription>Active, Client, Group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Full Time Employees:</span>
              <span className="font-medium">
                {accountDetails?.effectiveDate ? "23" : "N/A"} as of{" "}
                {accountDetails?.effectiveDate
                  ? new Date(accountDetails.effectiveDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Broker of Record:</span>
              <span className="font-medium">
                {accountDetails?.effectiveDate
                  ? new Date(accountDetails.effectiveDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">SIC Code:</span>
              <span className="font-medium">5812 - Eating Places</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Industry:</span>
              <span className="font-medium">Food Services/Lodging</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Market Size:</span>
              <span className="font-medium">Not Selected</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Employer Identification Number (EIN):
              </span>
              <span className="font-medium">35-1329682</span>
            </div>
            <div className="mt-4">
              <Link href="#" className="text-blue-600 text-sm hover:underline">
                More
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Account Team */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account Region:</span>
              <span className="font-medium">Midwest Southeast</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account Office:</span>
              <span className="font-medium">
                Indianapolis, IN - (317) 202 - MR/36
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Department:</span>
              <span className="font-medium">Employee Hippo</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Administrator:</span>
              <span className="font-medium">Tang, Jeanine</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Primary Contact:</span>
              <span className="font-medium">Tang, Jeanine</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Primary Sales Lead:</span>
              <span className="font-medium">Tang, Jeanine</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Primary Service Lead:</span>
              <span className="font-medium">Tang, Jeanine</span>
            </div>
            <div className="mt-4">
              <Link href="#" className="text-blue-600 text-sm hover:underline">
                More
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Address & Primary Contact */}
        <div className="space-y-6">
          {/* Main Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Main Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div className="text-sm">
                  <p>9 Burger Ave</p>
                  <p>Hagerstown, MD - 21740-6119</p>
                  <p>United States</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="#"
                  className="text-blue-600 text-sm hover:underline"
                >
                  More
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Primary Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Primary Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                A Primary Contact has not been assigned for this account.
              </p>
              <div className="mt-4">
                <Link
                  href="#"
                  className="text-blue-600 text-sm hover:underline"
                >
                  More
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Overview of account metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 bg-blue-100 text-blue-800">
                  Total Plans
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">
                  {accountPlans.length}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 bg-green-100 text-green-800">
                  Total Enrollment
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">
                  {accountPlans.reduce((sum, plan) => {
                    return sum + safeParseFloat(plan.enrollment);
                  }, 0)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 bg-purple-100 text-purple-800">
                  Plan Types
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">
                  {new Set(accountPlans.map((plan) => plan.planType)).size}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />+ Add Log Record
        </Button>
        <Button variant="outline">Recently Viewed</Button>
      </div>
    </div>
  );
}
