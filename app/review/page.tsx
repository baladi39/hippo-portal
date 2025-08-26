"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ReviewPage() {
  const search = useSearchParams();

  // Basic information
  const account = search?.get("account") || "(unknown)";
  const planName = search?.get("planName") || "(unnamed)";
  const carrier = search?.get("carrier") || "(none)";

  // Plan details
  const billingType = search?.get("billingType") || "(none)";
  const commissionsPaidBy = search?.get("commissionsPaidBy") || "(none)";
  const fundingType = search?.get("fundingType") || "(none)";
  const policyGroupNumber = search?.get("policyGroupNumber") || "(none)";

  // Effective dates
  const originalPlanEffectiveDate =
    search?.get("originalPlanEffectiveDate") || "(none)";
  const effectiveDate = search?.get("effectiveDate") || "(none)";
  const renewalDate = search?.get("renewalDate") || "(none)";
  const commissionStartDate = search?.get("commissionStartDate") || "(none)";
  const newBusinessUntil = search?.get("newBusinessUntil") || "(none)";
  const continuousPolicy = search?.get("continuousPolicy") === "true";

  // Additional fields
  const originationReason = search?.get("originationReason") || "(none)";
  const priorPlan = search?.get("priorPlan") || "(none)";
  const automaticActivityLog = search?.get("automaticActivityLog") || "(none)";
  const attributeView = search?.get("attributeView") || "(none)";
  const eligibleEmployees = search?.get("eligibleEmployees") || "(none)";
  const metalLevel = search?.get("metalLevel") || "(none)";
  const acaSafeHarbor = search?.get("acaSafeHarbor") || "(none)";
  const reportingYear = search?.get("reportingYear") || "(none)";
  const secondaryPlanType = search?.get("secondaryPlanType") || "(none)";
  const benefitAttributes = search?.get("benefitAttributes") || "(none)";
  const currentPlan = search?.get("currentPlan") || "(none)";

  // Replacement scenario data
  const isReplacement = search?.get("isReplacement") === "true";
  const replaceId = search?.get("replaceId") || null;
  const replaceType = search?.get("replaceType") || null;

  // Original plan data (for replacement scenarios)
  const originalPlanData = isReplacement
    ? {
        originalPlanId: search?.get("originalPlanId") || "(none)",
        originalPlanName: search?.get("originalPlanName") || "(none)",
        originalCarrier: search?.get("originalCarrier") || "(none)",
        originalPlanType: search?.get("originalPlanType") || "(none)",
        originalStatus: search?.get("originalStatus") || "(none)",
        originalEffectiveDate: search?.get("originalEffectiveDate") || "(none)",
        originalRenewalDate: search?.get("originalRenewalDate") || "(none)",
        originalCancellationDate:
          search?.get("originalCancellationDate") || "(none)",
        originalCommissionPaidByCarrier:
          search?.get("originalCommissionPaidByCarrier") || "(none)",
        originalPolicyGroupNumber:
          search?.get("originalPolicyGroupNumber") || "(none)",
        originalBilling: search?.get("originalBilling") || "(none)",
        originalAccountName: search?.get("originalAccountName") || "(none)",
        originalAccountOfficeDivision:
          search?.get("originalAccountOfficeDivision") || "(none)",
        originalAccountPrimarySalesLead:
          search?.get("originalAccountPrimarySalesLead") || "(none)",
        originalAccountClassification:
          search?.get("originalAccountClassification") || "(none)",
        originalEnrollment: search?.get("originalEnrollment") || "(none)",
        originalAnnualRevenue: search?.get("originalAnnualRevenue") || "(none)",
        originalCreatedDate: search?.get("originalCreatedDate") || "(none)",
        originalUpdatedDate: search?.get("originalUpdatedDate") || "(none)",
        nonBrokered: search?.get("nonBrokered") || "false",
        includeSplits: search?.get("includeSplits") || "Yes",
        includeContributions: search?.get("includeContributions") || "No",
        includeEligibilityRules: search?.get("includeEligibilityRules") || "No",
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/plan-config">
                <Button variant="ghost" size="sm">
                  Back to Configuration
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {isReplacement ? "Review Plan Replacement" : "Review New Plan"}
              </h1>
            </div>
            <Link href="/login">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Original Plan Information (for replacement scenarios) */}
        {isReplacement && originalPlanData && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">
                Plan Being Replaced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-red-600">Plan ID</p>
                  <p className="font-medium text-red-900">
                    {originalPlanData.originalPlanId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600">Plan Name</p>
                  <p className="font-medium text-red-900">
                    {originalPlanData.originalPlanName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600">Carrier</p>
                  <p className="font-medium text-red-900">
                    {originalPlanData.originalCarrier}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600">Plan Type</p>
                  <p className="font-medium text-red-900">
                    {originalPlanData.originalPlanType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600">Status</p>
                  <p className="font-medium text-red-900">
                    {originalPlanData.originalStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600">Current Effective Date</p>
                  <p className="font-medium text-red-900">
                    {originalPlanData.originalEffectiveDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600">Current Renewal Date</p>
                  <p className="font-medium text-red-900">
                    {originalPlanData.originalRenewalDate}
                  </p>
                </div>
                {originalPlanData.originalPolicyGroupNumber !== "(none)" && (
                  <div>
                    <p className="text-sm text-red-600">Policy/Group Number</p>
                    <p className="font-medium text-red-900">
                      {originalPlanData.originalPolicyGroupNumber}
                    </p>
                  </div>
                )}
                {originalPlanData.originalBilling !== "(none)" && (
                  <div>
                    <p className="text-sm text-red-600">Billing</p>
                    <p className="font-medium text-red-900">
                      {originalPlanData.originalBilling}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Replacement Configuration (for replacement scenarios) */}
        {isReplacement && originalPlanData && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">
                Replacement Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Non-Brokered</p>
                  <p className="font-medium text-blue-900">
                    {originalPlanData.nonBrokered === "true" ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Include Splits</p>
                  <p className="font-medium text-blue-900">
                    {originalPlanData.includeSplits}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Include Contributions</p>
                  <p className="font-medium text-blue-900">
                    {originalPlanData.includeContributions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">
                    Include Eligibility Rules
                  </p>
                  <p className="font-medium text-blue-900">
                    {originalPlanData.includeEligibilityRules}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Plan Information */}
        <Card className={isReplacement ? "bg-green-50 border-green-200" : ""}>
          <CardHeader>
            <CardTitle className={isReplacement ? "text-green-900" : ""}>
              {isReplacement
                ? "New Plan Configuration"
                : "Basic Plan Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Account
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {account}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Plan Name
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {planName}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Carrier
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {carrier}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Billing Type
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {billingType}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Commissions/Fees Paid By
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {commissionsPaidBy}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Funding Type
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {fundingType}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Details */}
        <Card className={isReplacement ? "bg-green-50 border-green-200" : ""}>
          <CardHeader>
            <CardTitle className={isReplacement ? "text-green-900" : ""}>
              Plan Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Policy/Group Number
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {policyGroupNumber}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Origination Reason
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {originationReason}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Prior Plan
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {priorPlan}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Automatic Activity Log
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {automaticActivityLog}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Attribute View
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {attributeView}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Secondary Plan Type
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {secondaryPlanType}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Effective Dates */}
        <Card className={isReplacement ? "bg-green-50 border-green-200" : ""}>
          <CardHeader>
            <CardTitle className={isReplacement ? "text-green-900" : ""}>
              Effective Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Original Plan Effective Date
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {originalPlanEffectiveDate}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Effective Date
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {effectiveDate}
                  {continuousPolicy && (
                    <span
                      className={`ml-2 text-xs ${
                        isReplacement ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      (Continuous Policy)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Renewal Date
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {renewalDate}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Commission Start Date
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {commissionStartDate}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  New Business Until
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {newBusinessUntil !== "(none)"
                    ? newBusinessUntil
                    : "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className={isReplacement ? "bg-green-50 border-green-200" : ""}>
          <CardHeader>
            <CardTitle className={isReplacement ? "text-green-900" : ""}>
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Number of Eligible Employees
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {eligibleEmployees !== "(none)"
                    ? eligibleEmployees
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Metal Level
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {metalLevel !== "(none)" ? metalLevel : "Not specified"}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  ACA Safe Harbor Affordability
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {acaSafeHarbor !== "(none)" ? acaSafeHarbor : "Not specified"}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Reporting Year
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {reportingYear !== "(none)" ? reportingYear : "Not specified"}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isReplacement ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Benefit Attributes
                </p>
                <p
                  className={`font-medium ${
                    isReplacement ? "text-green-900" : ""
                  }`}
                >
                  {benefitAttributes === "empty" &&
                    "Leave attribute values empty"}
                  {benefitAttributes === "standard" &&
                    "Use standard plan attribute defaults"}
                  {benefitAttributes === "copy" && "Copy from current plan"}
                </p>
              </div>
              {benefitAttributes === "copy" && currentPlan !== "(none)" && (
                <div>
                  <p
                    className={`text-sm ${
                      isReplacement ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    Current Plan (for copying)
                  </p>
                  <p
                    className={`font-medium ${
                      isReplacement ? "text-green-900" : ""
                    }`}
                  >
                    {currentPlan}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/plan-config">
            <Button variant="outline">Back to Edit</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-green-600 hover:bg-green-700">
              Save New Plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
