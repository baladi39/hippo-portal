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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planService, planTypeService } from "@/lib/database";
import { PlanWithAccount } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function ReplacePlanPage() {
  const search = useSearchParams();
  const account = search?.get("account") || "(unknown)";
  const planId = Number(search?.get("planId")) || null;
  const [plan, setPlan] = React.useState<PlanWithAccount | null>(null);
  const [replacementPlanType, setReplacementPlanType] = React.useState("");
  const [planTypes, setPlanTypes] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [nonBrokered, setNonBrokered] = React.useState(false);
  const [includeSplits, setIncludeSplits] = React.useState("Yes");
  const [includeContributions, setIncludeContributions] = React.useState("No");
  const [includeEligibilityRules, setIncludeEligibilityRules] =
    React.useState("No");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plan types
        const types = await planTypeService.getAll();
        setPlanTypes(types);

        // Fetch plan details if planId is provided
        if (planId) {
          const planData = await planService.getById(planId);
          setPlan(planData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/account-dashboard?account=${encodeURIComponent(
                  account
                )}`}
              >
                <Button variant="ghost" size="sm">
                  Back to Plans
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Replace Plan</h1>
            </div>
            <Link href="/login">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">
                  Current Plan Being Replaced
                </h3>
                <p className="text-blue-700 mt-1">
                  {plan?.plan_type_info?.plan_type_name || plan?.plan_type} -{" "}
                  {plan?.carrier}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">Account</p>
                <p className="font-medium text-blue-900">{account}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add Plan</CardTitle>
            <CardDescription>
              Configure the replacement plan for {account}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Plan By */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Add Plan By
              </label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-sm text-gray-600">
                  Creating a Plan (Any Carrier)
                </span>
              </div>
            </div>

            {/* Plan Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Plan Type
              </label>
              <Select
                value={replacementPlanType}
                onValueChange={(v) => setReplacementPlanType(v)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loading ? "Loading plan types..." : "Select a plan type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {planTypes.map((type: string) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Origination Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Origination Reason
              </label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-sm text-gray-600">Replacement</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="non-brokered"
                  checked={nonBrokered}
                  onChange={(e) => setNonBrokered(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="non-brokered" className="text-sm text-gray-700">
                  Non-Brokered
                </label>
              </div>
            </div>

            {/* Include Splits */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Include Splits
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="splits-yes"
                    name="includeSplits"
                    value="Yes"
                    checked={includeSplits === "Yes"}
                    onChange={(e) => setIncludeSplits(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="splits-yes"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="splits-no"
                    name="includeSplits"
                    value="No"
                    checked={includeSplits === "No"}
                    onChange={(e) => setIncludeSplits(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="splits-no"
                    className="ml-2 text-sm text-gray-700"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Include Contributions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Include Contributions
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="contributions-yes"
                    name="includeContributions"
                    value="Yes"
                    checked={includeContributions === "Yes"}
                    onChange={(e) => setIncludeContributions(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="contributions-yes"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="contributions-no"
                    name="includeContributions"
                    value="No"
                    checked={includeContributions === "No"}
                    onChange={(e) => setIncludeContributions(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="contributions-no"
                    className="ml-2 text-sm text-gray-700"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Include Eligibility Rules */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Include Eligibility Rules
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="eligibility-yes"
                    name="includeEligibilityRules"
                    value="Yes"
                    checked={includeEligibilityRules === "Yes"}
                    onChange={(e) => setIncludeEligibilityRules(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="eligibility-yes"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="eligibility-no"
                    name="includeEligibilityRules"
                    value="No"
                    checked={includeEligibilityRules === "No"}
                    onChange={(e) => setIncludeEligibilityRules(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="eligibility-no"
                    className="ml-2 text-sm text-gray-700"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href={`/account-dashboard?account=${encodeURIComponent(
                  account
                )}`}
              >
                <Button variant="outline">Cancel</Button>
              </Link>
              <Link
                href={`/plan-config?account=${encodeURIComponent(
                  account
                )}&replaceId=${plan?.plan_id}&replaceType=${encodeURIComponent(
                  replacementPlanType
                )}&nonBrokered=${nonBrokered}&includeSplits=${includeSplits}&includeContributions=${includeContributions}&includeEligibilityRules=${includeEligibilityRules}`}
              >
                <Button disabled={!replacementPlanType || loading}>Next</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
