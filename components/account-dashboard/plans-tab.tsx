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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PlansTabProps {
  selectedAccount: string | null;
  accountPlans: PlanWithAccount[];
}

export function PlansTab({ selectedAccount, accountPlans }: PlansTabProps) {
  const [filters, setFilters] = useState({
    listView: "",
    linesOfCoverage: "",
    planTypes: "",
    fundingType: "",
    locations: "",
    employeeTypes: "",
    secondaryPlanType: "",
    nonBrokered: "",
  });

  // Filter the plans based on selected filters
  const filteredPlans = accountPlans.filter((plan) => {
    if (filters.planTypes && plan.plan_type !== filters.planTypes) return false;
    if (filters.linesOfCoverage && plan.carrier !== filters.linesOfCoverage)
      return false;
    // Add more filter logic as needed
    return true;
  });

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      listView: "",
      linesOfCoverage: "",
      planTypes: "",
      fundingType: "",
      locations: "",
      employeeTypes: "",
      secondaryPlanType: "",
      nonBrokered: "",
    });
  };

  return (
    <div className="mt-6">
      {/* Filter Section */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Group by</span>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="plans-products"
                  name="groupBy"
                  defaultChecked
                  className="w-4 h-4"
                />
                <label htmlFor="plans-products" className="text-sm">
                  Plans and Products
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="line-coverage"
                  name="groupBy"
                  className="w-4 h-4"
                />
                <label htmlFor="line-coverage" className="text-sm">
                  Line of Coverage
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm">
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* First Row of Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Select
                value={filters.listView}
                onValueChange={(value) => handleFilterChange("listView", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="List View (4)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="active">Active Plans</SelectItem>
                  <SelectItem value="pending">Pending Plans</SelectItem>
                  <SelectItem value="expired">Expired Plans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.linesOfCoverage}
                onValueChange={(value) =>
                  handleFilterChange("linesOfCoverage", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lines of Coverage (0)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="vision">Vision</SelectItem>
                  <SelectItem value="life">Life Insurance</SelectItem>
                  <SelectItem value="disability">Disability</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.planTypes}
                onValueChange={(value) =>
                  handleFilterChange("planTypes", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Plan Types (0)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HMO">HMO</SelectItem>
                  <SelectItem value="PPO">PPO</SelectItem>
                  <SelectItem value="EPO">EPO</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                  <SelectItem value="HDHP">
                    High Deductible Health Plan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.fundingType}
                onValueChange={(value) =>
                  handleFilterChange("fundingType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Funding Type (0)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fully-insured">Fully Insured</SelectItem>
                  <SelectItem value="self-funded">Self Funded</SelectItem>
                  <SelectItem value="level-funded">Level Funded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row of Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select
                value={filters.locations}
                onValueChange={(value) =>
                  handleFilterChange("locations", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Locations (0)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-locations">All Locations</SelectItem>
                  <SelectItem value="headquarters">Headquarters</SelectItem>
                  <SelectItem value="branch-offices">Branch Offices</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.employeeTypes}
                onValueChange={(value) =>
                  handleFilterChange("employeeTypes", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Employee Types (0)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.secondaryPlanType}
                onValueChange={(value) =>
                  handleFilterChange("secondaryPlanType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Secondary Plan Type (0)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplemental">Supplemental</SelectItem>
                  <SelectItem value="voluntary">Voluntary</SelectItem>
                  <SelectItem value="cobra">COBRA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.nonBrokered}
                onValueChange={(value) =>
                  handleFilterChange("nonBrokered", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Non-Brokered (2)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Tab Content */}
      <Card>
        <CardHeader>
          <CardTitle>Account Plans</CardTitle>
          <CardDescription>
            Detailed view of all plans for {selectedAccount}
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
                  <TableHead>Enrollment</TableHead>
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
                          {plan.plan_type}
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
                          {plan.plan}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {(plan.enrollment || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(plan.effective_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(plan.renewal_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        $
                        {(
                          (plan.annual_employee_cost || 0) +
                          (plan.annual_employer_cost || 0)
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        $
                        {(plan.annual_revenue || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
            <Link
              href={`/add-plan?account=${encodeURIComponent(
                selectedAccount || ""
              )}`}
            >
              <Button>Add New Plan</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
