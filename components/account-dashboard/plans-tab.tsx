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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlanWithAccount } from "@/lib/supabase";
import { Filter, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  accountPlans: PlanWithAccount[];
}

export function PlansTab({ selectedAccount, accountPlans }: PlansTabProps) {
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

  // Filter the plans based on selected filters
  const filteredPlans = accountPlans.filter((plan) => {
    if (
      filters.planTypes !== "All" &&
      plan.plan_type_info?.plan_type_name !== filters.planTypes
    )
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
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.plan_id}>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {plan.plan_type_info?.plan_type_name ||
                            plan.plan_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {plan.carrier}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={`/plan-config?account=${encodeURIComponent(
                            plan.account.account
                          )}&planId=${plan.plan_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {plan.plan_type_info?.plan_type_name ||
                            plan.plan_type}{" "}
                          - {plan.carrier}
                        </Link>
                      </TableCell>
                      <TableCell>{plan.status || "Active"}</TableCell>
                      <TableCell>
                        {new Date(plan.effective_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(plan.renewal_date).toLocaleDateString()}
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
                                  plan.account.account
                                )}&planId=${plan.plan_id}`}
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
                                href={`/replace-plan?account=${encodeURIComponent(
                                  plan.account.account
                                )}&planId=${plan.plan_id}`}
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
