"use client";

import { Badge } from "@/components/ui/badge";
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
import { planService } from "@/lib/database";
import { Plan } from "@/lib/supabase";
import { ArrowLeft, Filter, MoreVertical, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Filter constants based on the screenshot
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

export default function AccountPlansPage() {
  const search = useSearchParams();
  const router = useRouter();
  const account = search?.get("account") || "(unknown)";
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
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
    loadPlans();
  }, [account]);

  useEffect(() => {
    applyFilters();
  }, [plans, filters]);

  const loadPlans = async () => {
    if (account === "(unknown)") return;

    setLoading(true);
    try {
      const data = await planService.getByAccount(account);
      setPlans(data);
    } catch (error) {
      console.error("Failed to load plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...plans];

    // Apply filters (simplified for now since we don't have all the data fields yet)
    if (filters.planTypes !== "All") {
      filtered = filtered.filter((plan) =>
        plan.plan_type.includes(filters.planTypes)
      );
    }

    setFilteredPlans(filtered);
  };

  const handleFilterChange = (filterType: keyof PlanFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleReplacePlan = (plan: Plan) => {
    router.push(
      `/replace-plan?account=${encodeURIComponent(account)}&planId=${
        plan.plan_id
      }`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{account}</h1>
                <p className="text-sm text-gray-600">
                  EPIC Insurance Brokers & Consultants
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Tasks
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Log Record
              </Button>
              <Button variant="outline" size="sm">
                Recently Viewed
              </Button>
              <Link href="/login">
                <Button variant="ghost">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Group by Plans and Products
                </CardTitle>
                <CardDescription>
                  Filter and view plans for {account}
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

        {/* Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Plans</CardTitle>
            <CardDescription>
              {filteredPlans.length} plan(s) found for {account}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading plans...</div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No plans found for this account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Type</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Commission Paid by Carrier</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Billing</TableHead>
                      <TableHead>Policy/Group</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Renewal Date</TableHead>
                      <TableHead>Cancellation Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.plan_id}>
                        <TableCell>{plan.plan_type}</TableCell>
                        <TableCell>{plan.carrier}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <Link
                            href={`/plan-config?account=${encodeURIComponent(
                              account
                            )}&planId=${plan.plan_id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {plan.plan}
                          </Link>
                        </TableCell>
                        <TableCell>D</TableCell>
                        <TableCell>
                          {plan.policy_group_number || "PENDING"}
                        </TableCell>
                        <TableCell>
                          {new Date(plan.effective_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(plan.renewal_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleReplacePlan(plan)}
                              >
                                Replace
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  href={`/plan-config?account=${encodeURIComponent(
                                    account
                                  )}&planId=${plan.plan_id}`}
                                >
                                  Edit Configuration
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Terminate
                              </DropdownMenuItem>
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

        {/* Bottom Status Bar */}
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Badge variant="outline">📎 Attachments</Badge>
          <Badge variant="outline">👥 Marketing Group</Badge>
          <Badge variant="outline">🔗 Plan Relationships</Badge>
          <Badge variant="outline">📝 Incomplete Plan</Badge>
          <Badge variant="outline">🔄 Renewed</Badge>
          <Badge variant="outline">📋 Replaced</Badge>
          <Badge variant="outline">🚫 No Posting Records</Badge>
          <Badge variant="outline">💰 Non-Revenue</Badge>
          <Badge variant="outline">🏥 HDHP Qualified Plan</Badge>
          <Badge variant="outline">📄 Continuous Policy</Badge>
          <Badge variant="outline">❌ No Split Applied</Badge>
          <Badge variant="outline">🚫 Non-Brokered Plan</Badge>
        </div>
      </div>
    </div>
  );
}
