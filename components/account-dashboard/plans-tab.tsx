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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlanDto } from "@/server/models/account-model";
import { Filter, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Filter constants
const LINES_OF_COVERAGE = [
  "All",
  "Medical",
  "Dental",
  "Vision",
  "Life",
  "Disability",
];
const PLAN_TYPES = [
  "All",
  "PPO",
  "HMO",
  "Vision Plan",
  "Life Insurance",
  "AD&D",
];
const FUNDING_TYPES = ["All", "Fully Insured", "Self-Funded", "Level Funded"];
const EMPLOYEE_TYPES = ["All", "Full-Time", "Part-Time", "Seasonal"];
const LOCATIONS = ["All", "Main Office", "Remote", "Field"];

interface PlanFilters {
  linesOfCoverage: string;
  planTypes: string;
  fundingTypes: string;
  employeeTypes: string;
  locations: string;
  secondaryPlanType: string;
  nonBrokered: string;
}

interface PlansTabProps {
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

export function PlansTab({ selectedAccount, accountId }: PlansTabProps) {
  const [accountData, setAccountData] = useState<AccountDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PlanFilters>({
    linesOfCoverage: "All",
    planTypes: "All",
    fundingTypes: "All",
    employeeTypes: "All",
    locations: "All",
    secondaryPlanType: "All",
    nonBrokered: "All",
  });

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

  const accountPlans = accountData?.accountPlans || [];

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
              Please select an account from the accounts page to view plans.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
              Error Loading Plans Data
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter the plans based on selected filters
  const filteredPlans = accountPlans.filter((plan: PlanDto) => {
    if (filters.planTypes !== "All" && plan.planType !== filters.planTypes)
      return false;
    if (
      filters.linesOfCoverage !== "All" &&
      plan.carrier !== filters.linesOfCoverage
    )
      return false;
    // Add more filter logic as needed
    return true;
  });

  const handleFilterChange = (filterType: keyof PlanFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      linesOfCoverage: "All",
      planTypes: "All",
      fundingTypes: "All",
      employeeTypes: "All",
      locations: "All",
      secondaryPlanType: "All",
      nonBrokered: "All",
    });
  };

  return (
    <div className="mt-6">
      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Group by Plans and Products
              </CardTitle>
              <CardDescription>
                Filter and view plans for {selectedAccount}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Lines of Coverage ({filteredPlans.length})
                </label>
                <Select
                  value={filters.linesOfCoverage}
                  onValueChange={(value) =>
                    handleFilterChange("linesOfCoverage", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LINES_OF_COVERAGE.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Plan Types ({filteredPlans.length})
                </label>
                <Select
                  value={filters.planTypes}
                  onValueChange={(value) =>
                    handleFilterChange("planTypes", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_TYPES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Funding Type ({filteredPlans.length})
                </label>
                <Select
                  value={filters.fundingTypes}
                  onValueChange={(value) =>
                    handleFilterChange("fundingTypes", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FUNDING_TYPES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Employee Types ({filteredPlans.length})
                </label>
                <Select
                  value={filters.employeeTypes}
                  onValueChange={(value) =>
                    handleFilterChange("employeeTypes", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_TYPES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Locations ({filteredPlans.length})
                </label>
                <Select
                  value={filters.locations}
                  onValueChange={(value) =>
                    handleFilterChange("locations", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Secondary Plan Type ({filteredPlans.length})
                </label>
                <Select
                  value={filters.secondaryPlanType}
                  onValueChange={(value) =>
                    handleFilterChange("secondaryPlanType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Non-Brokered ({filteredPlans.length})
                </label>
                <Select
                  value={filters.nonBrokered}
                  onValueChange={(value) =>
                    handleFilterChange("nonBrokered", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Plans Tab Content */}
      <Card>
        <CardHeader>
          <CardTitle>Account Plans</CardTitle>
          <CardDescription>
            {filteredPlans.length} plan(s) found for {selectedAccount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Type</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Renewal Date</TableHead>
                  <TableHead>Annual Premium</TableHead>
                  <TableHead>Annual Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan: PlanDto) => (
                    <TableRow key={plan.planId}>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {plan.planType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {plan.carrier}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={"#"}
                          className="text-blue-600 hover:underline"
                        >
                          {plan.planType} - {plan.carrier}
                        </Link>
                      </TableCell>
                      <TableCell>{plan.status || "Active"}</TableCell>
                      <TableCell>
                        {new Date(plan.effectiveDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(plan.renewalDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>N/A</TableCell>
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
                                href={`/plan-config?account=${encodeURIComponent(
                                  plan.accountName
                                )}&planId=${plan.planId}`}
                                className="w-full"
                              >
                                Plan Info
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Benefits</DropdownMenuItem>
                            <DropdownMenuItem>Rates</DropdownMenuItem>
                            <DropdownMenuItem>Splits</DropdownMenuItem>
                            <DropdownMenuItem>Posting Record</DropdownMenuItem>
                            <DropdownMenuItem>Contributions</DropdownMenuItem>
                            <DropdownMenuItem>Eligibility</DropdownMenuItem>
                            <DropdownMenuItem>
                              Plan Attachments
                            </DropdownMenuItem>
                            <DropdownMenuItem>Plan Contacts</DropdownMenuItem>
                            <DropdownMenuItem>Print</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Renew</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/replace-plan?accountid=${plan.accountId}&planId=${plan.planId}`}
                                className="w-full"
                              >
                                Replace
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-gray-500 py-8"
                    >
                      No plans found for this account
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {filteredPlans.length} plan
              {filteredPlans.length !== 1 ? "s" : ""}
              {filteredPlans.length !== accountPlans.length && (
                <span className="text-gray-500">
                  {" "}
                  (filtered from {accountPlans.length} total)
                </span>
              )}
            </div>
            <Link href="#">
              <Button>Add New Plan</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
