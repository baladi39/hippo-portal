"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { planService } from "@/lib/database";
import { PlanWithAccount } from "@/lib/supabase";
import { MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function AccountsPage() {
  const [plans, setPlans] = useState<PlanWithAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await planService.getAll();
      setPlans(data);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Failed to load plans:", error);
      setError(error instanceof Error ? error.message : "Failed to load plans");
      setPlans([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadPlans();
      return;
    }

    setLoading(true);
    try {
      // Search plans by account name, plan name, or carrier
      const allPlans = await planService.getAll();
      const filteredPlans = allPlans.filter(
        (plan) =>
          plan.account.account
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          plan.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.plan_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPlans(filteredPlans);
      setError("");
    } catch (error) {
      console.error("Failed to search:", error);
      setError(error instanceof Error ? error.message : "Failed to search");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Get accounts with plans data for the new table structure
  const getAccountsWithPlansData = () => {
    return plans.map((planRecord) => ({
      accountId: planRecord.account.account_id,
      accountName: planRecord.account.account,
      accountOfficeDivision: planRecord.account.state, // Using state as office-division for now
      accountPrimarySalesLead: "TBD", // This field needs to be added to the Account table
      accountClassification: "TBD", // This field needs to be added to the Account table
      carrier: planRecord.carrier,
      planType: planRecord.plan_type,
      planName: planRecord.plan,
      policyGroupNumber: "TBD", // This field needs to be added to the Plan table
      effectiveDate: new Date(planRecord.effective_date).toLocaleDateString(),
      renewalDate: new Date(planRecord.renewal_date).toLocaleDateString(),
      enrollment: planRecord.enrollment,
      annualRevenue: planRecord.annual_revenue,
      planId: planRecord.plan_id,
    }));
  };

  // Calculate summary statistics
  const getSummaryData = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);

    const summaryStats = {
      plans: {
        upForRenewal: 0,
        expiredNoAction: 0,
        newBusiness: 0,
      },
      products: {
        upForRenewal: 0,
        expiredNoAction: 0,
        newBusiness: 0,
      },
      recordAssignments: {
        dueToday: 0,
        pastDue: 0,
        upcoming: 0,
      },
      activities: {
        dueToday: 0,
        pastDue: 0,
        upcoming: 0,
      },
      requests: {
        dueToday: 0,
        pastDue: 0,
        responses: 0,
      },
    };

    plans.forEach((plan) => {
      const renewalDate = new Date(plan.renewal_date);
      const effectiveDate = new Date(plan.effective_date);

      // Plans summary
      if (renewalDate <= thirtyDaysFromNow && renewalDate >= today) {
        summaryStats.plans.upForRenewal++;
      } else if (renewalDate < today) {
        summaryStats.plans.expiredNoAction++;
      } else if (effectiveDate >= today) {
        summaryStats.plans.newBusiness++;
      }

      // Products summary (same logic for now)
      if (renewalDate <= thirtyDaysFromNow && renewalDate >= today) {
        summaryStats.products.upForRenewal++;
      } else if (renewalDate < today) {
        summaryStats.products.expiredNoAction++;
      } else if (effectiveDate >= today) {
        summaryStats.products.newBusiness++;
      }
    });

    // Note: Record Assignments, Activities, and Requests would need additional data sources
    // For now, using placeholder calculations
    summaryStats.recordAssignments.dueToday = Math.floor(plans.length * 0.1);
    summaryStats.recordAssignments.pastDue = Math.floor(plans.length * 0.05);
    summaryStats.recordAssignments.upcoming = Math.floor(plans.length * 0.2);

    summaryStats.activities.dueToday = Math.floor(plans.length * 0.08);
    summaryStats.activities.pastDue = Math.floor(plans.length * 0.03);
    summaryStats.activities.upcoming = Math.floor(plans.length * 0.15);

    summaryStats.requests.dueToday = Math.floor(plans.length * 0.05);
    summaryStats.requests.pastDue = Math.floor(plans.length * 0.02);
    summaryStats.requests.responses = Math.floor(plans.length * 0.1);

    return summaryStats;
  };

  const accountsData = getAccountsWithPlansData();
  const summaryData = getSummaryData();
  const totalPlans = plans.length;
  const totalRevenue = plans.reduce(
    (sum, plan) => sum + plan.annual_revenue,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              BenefitPoint Portal
            </h1>
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Accounts</h2>
          <p className="text-gray-600">
            Manage your client accounts and their benefit plans
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search accounts, plans, carriers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  loadPlans();
                }}
              >
                Clear
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Plans Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Up for Renewal</span>
                  <span className="text-xl font-bold text-orange-600">
                    {summaryData.plans.upForRenewal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Expired No Action
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {summaryData.plans.expiredNoAction}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Business</span>
                  <span className="text-xl font-bold text-green-600">
                    {summaryData.plans.newBusiness}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Products Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Up for Renewal</span>
                  <span className="text-xl font-bold text-orange-600">
                    {summaryData.products.upForRenewal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Expired No Action
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {summaryData.products.expiredNoAction}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Business</span>
                  <span className="text-xl font-bold text-green-600">
                    {summaryData.products.newBusiness}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Record Assignments Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Record Assignments</CardTitle>
                <CardDescription className="text-xs">(90 days)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due Today</span>
                  <span className="text-xl font-bold text-red-600">
                    {summaryData.recordAssignments.dueToday}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Past Due</span>
                  <span className="text-xl font-bold text-red-700">
                    {summaryData.recordAssignments.pastDue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Upcoming</span>
                  <span className="text-xl font-bold text-blue-600">
                    {summaryData.recordAssignments.upcoming}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Activities Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Activities</CardTitle>
                <CardDescription className="text-xs">(90 days)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due Today</span>
                  <span className="text-xl font-bold text-red-600">
                    {summaryData.activities.dueToday}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Past Due</span>
                  <span className="text-xl font-bold text-red-700">
                    {summaryData.activities.pastDue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Upcoming</span>
                  <span className="text-xl font-bold text-blue-600">
                    {summaryData.activities.upcoming}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Requests Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due Today</span>
                  <span className="text-xl font-bold text-red-600">
                    {summaryData.requests.dueToday}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Past Due</span>
                  <span className="text-xl font-bold text-red-700">
                    {summaryData.requests.pastDue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Responses</span>
                  <span className="text-xl font-bold text-green-600">
                    {summaryData.requests.responses}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Accounts with Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Accounts with Plans</CardTitle>
            <CardDescription>
              Detailed view of all accounts and their associated plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading accounts...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p className="font-medium">Error loading accounts</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={loadPlans}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : accountsData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No accounts found.{" "}
                {searchTerm ? "Try a different search term." : ""}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Account</TableHead>
                      <TableHead>Account Office-Division</TableHead>
                      <TableHead>Account Primary Sales Lead</TableHead>
                      <TableHead>Account Classification</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Plan Type</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Policy Group #</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Renewal Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountsData.map((account) => (
                      <TableRow key={`${account.accountId}-${account.planId}`}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/account-dashboard?account=${encodeURIComponent(
                              account.accountName
                            )}`}
                            className="text-blue-600 hover:underline"
                          >
                            {account.accountName}
                          </Link>
                        </TableCell>
                        <TableCell>{account.accountOfficeDivision}</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {account.accountPrimarySalesLead}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {account.accountClassification}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {account.carrier}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {account.planType}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {account.planName}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {account.policyGroupNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {account.effectiveDate}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {account.renewalDate}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link
                                  href={`/account-dashboard?account=${encodeURIComponent(
                                    account.accountName
                                  )}`}
                                  className="w-full"
                                >
                                  View Account Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Link
                                  href={`/plan-config?account=${encodeURIComponent(
                                    account.accountName
                                  )}&planId=${account.planId}`}
                                  className="w-full"
                                >
                                  Plan Info
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Benefits</DropdownMenuItem>
                              <DropdownMenuItem>Rates</DropdownMenuItem>
                              <DropdownMenuItem>Splits</DropdownMenuItem>
                              <DropdownMenuItem>
                                Posting Record
                              </DropdownMenuItem>
                              <DropdownMenuItem>Contributions</DropdownMenuItem>
                              <DropdownMenuItem>Eligibility</DropdownMenuItem>
                              <DropdownMenuItem>
                                Plan Attachments
                              </DropdownMenuItem>
                              <DropdownMenuItem>Plan Contacts</DropdownMenuItem>
                              <DropdownMenuItem>Print</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Renew</DropdownMenuItem>
                              <DropdownMenuItem>Replace</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
