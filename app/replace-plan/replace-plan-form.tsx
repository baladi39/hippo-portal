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
import Link from "next/link";
import React from "react";
import type { PlanDto, PlanTypeOption } from "./actions";

interface ReplacePlanFormProps {
  plan: PlanDto | null;
  planTypes: PlanTypeOption[];
  accountId: number;
  account: string;
  initialPlanTypeId?: number;
  initialPlanTypeName?: string;
  initialNonBrokered?: boolean;
  initialIncludeSplits?: string;
  initialIncludeContributions?: string;
  initialIncludeEligibilityRules?: string;
}

export default function ReplacePlanForm({
  plan,
  planTypes,
  accountId,
  account,
  initialPlanTypeId,
  initialPlanTypeName,
  initialNonBrokered = false,
  initialIncludeSplits = "Yes",
  initialIncludeContributions = "No",
  initialIncludeEligibilityRules = "No",
}: ReplacePlanFormProps) {
  const [replacementPlanType, setReplacementPlanType] = React.useState(
    initialPlanTypeName || ""
  );
  const [replacementPlanTypeId, setReplacementPlanTypeId] = React.useState<
    number | null
  >(initialPlanTypeId || null);
  const [nonBrokered, setNonBrokered] = React.useState(initialNonBrokered);
  const [includeSplits, setIncludeSplits] =
    React.useState(initialIncludeSplits);
  const [includeContributions, setIncludeContributions] = React.useState(
    initialIncludeContributions
  );
  const [includeEligibilityRules, setIncludeEligibilityRules] = React.useState(
    initialIncludeEligibilityRules
  );

  return (
    <>
      <Card className="bg-blue-50 border-blue-200">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">
                Current Plan Being Replaced
              </h3>
              <p className="text-blue-700 mt-1">
                {plan
                  ? `${plan.planType} - ${plan.carrier}`
                  : "No plan selected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add Plan</CardTitle>
          <CardDescription>
            Configure the replacement plan for{" "}
            {account !== "(unknown)" ? account : `Account ID: ${accountId}`}
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
              value={
                replacementPlanTypeId?.toString() ||
                initialPlanTypeId?.toString() ||
                ""
              }
              onValueChange={(v) => {
                const selectedPlanType = planTypes.find(
                  (type) => type.plan_type_id.toString() === v
                );
                if (selectedPlanType) {
                  setReplacementPlanTypeId(selectedPlanType.plan_type_id);
                  setReplacementPlanType(selectedPlanType.plan_type_name);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan type" />
              </SelectTrigger>
              <SelectContent>
                {planTypes.map((type) => (
                  <SelectItem
                    key={type.plan_type_id}
                    value={type.plan_type_id.toString()}
                  >
                    {type.plan_type_name}
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
            <Link href={`/account-dashboard?accountId=${accountId}&tab=plans`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Link
              href={`/plan-config?${new URLSearchParams({
                accountId: accountId.toString(),
                account: account,
                replaceId: plan?.planId?.toString() || "",
                replaceType: replacementPlanType,
                replaceTypeId: replacementPlanTypeId?.toString() || "",
                nonBrokered: nonBrokered.toString(),
                includeSplits: includeSplits,
                includeContributions: includeContributions,
                includeEligibilityRules: includeEligibilityRules,
                // Original plan information for caching
                ...(plan && {
                  originalPlanId: plan.planId?.toString() || "",
                  originalPlanName: plan.planName || "",
                  originalCarrier: plan.carrier || "",
                  originalPlanType: plan.planType || "",
                  originalStatus: plan.status || "",
                  originalEffectiveDate: plan.effectiveDate || "",
                  originalRenewalDate: plan.renewalDate || "",
                  originalCancellationDate: plan.cancellationDate || "",
                  originalCommissionPaidByCarrier:
                    plan.commissionPaidByCarrier || "",
                  originalPolicyGroupNumber: plan.policyGroupNumber || "",
                  originalBilling: plan.billing || "",
                  originalAccountName: plan.accountName || "",
                  originalAccountOfficeDivision:
                    plan.accountOfficeDivision || "",
                  originalAccountPrimarySalesLead:
                    plan.accountPrimarySalesLead || "",
                  originalAccountClassification:
                    plan.accountClassification || "",
                  originalEnrollment: plan.enrollment || "",
                  originalAnnualRevenue: plan.annualRevenue || "",
                  originalCreatedDate: plan.createdDate || "",
                  originalUpdatedDate: plan.updatedDate || "",
                }),
              }).toString()}`}
            >
              <Button disabled={!replacementPlanTypeId}>Next</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
