"use client";

import {
  fetchAccountById,
  fetchAccountByName,
  fetchActiveCarriers,
  type Carrier,
} from "@/app/plan-config/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PageHeader,
  createPlanConfigActions,
} from "@/components/ui/page-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AccountDto } from "@/server/models/account-model";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const BILLING_TYPES = ["Direct Bill", "List Bill", "Self-Administered"];

const COMMISSIONS_PAID_BY = ["Insurer/TPA", "Client", "Other"];

const ATTRIBUTE_VIEWS = ["Express", "Standard", "Full"];

const METAL_LEVELS = ["Bronze", "Silver", "Gold", "Platinum", "Catastrophic"];

const ACA_SAFE_HARBOR = ["Safe Harbor", "Not Safe Harbor"];

const SECONDARY_PLAN_TYPES = ["None Selected", "Medical", "Dental", "Vision"];

const FUNDING_TYPES = [
  "Fully Insured",
  "Self-Funded",
  "Level Funded",
  "Stop Gap",
];

export default function PlanConfigPage() {
  const search = useSearchParams();
  const account = search?.get("account") || "(unknown)";
  const accountId = search?.get("accountId")
    ? parseInt(search.get("accountId")!)
    : null;
  const newType = search?.get("newType") || "";
  const replaceId = search?.get("replaceId") || null;
  const replaceType = search?.get("replaceType") || null;

  // Extract original plan data for replacement scenarios
  const originalPlanData = replaceId
    ? {
        originalPlanId: search?.get("originalPlanId") || "",
        originalPlanName: search?.get("originalPlanName") || "",
        originalCarrier: search?.get("originalCarrier") || "",
        originalPlanType: search?.get("originalPlanType") || "",
        originalStatus: search?.get("originalStatus") || "",
        originalEffectiveDate: search?.get("originalEffectiveDate") || "",
        originalRenewalDate: search?.get("originalRenewalDate") || "",
        originalCancellationDate: search?.get("originalCancellationDate") || "",
        originalCommissionPaidByCarrier:
          search?.get("originalCommissionPaidByCarrier") || "",
        originalPolicyGroupNumber:
          search?.get("originalPolicyGroupNumber") || "",
        originalBilling: search?.get("originalBilling") || "",
        originalAccountName: search?.get("originalAccountName") || "",
        originalAccountOfficeDivision:
          search?.get("originalAccountOfficeDivision") || "",
        originalAccountPrimarySalesLead:
          search?.get("originalAccountPrimarySalesLead") || "",
        originalAccountClassification:
          search?.get("originalAccountClassification") || "",
        originalEnrollment: search?.get("originalEnrollment") || "",
        originalAnnualRevenue: search?.get("originalAnnualRevenue") || "",
        originalCreatedDate: search?.get("originalCreatedDate") || "",
        originalUpdatedDate: search?.get("originalUpdatedDate") || "",
        // Replacement configuration data
        nonBrokered: search?.get("nonBrokered") || "false",
        includeSplits: search?.get("includeSplits") || "Yes",
        includeContributions: search?.get("includeContributions") || "No",
        includeEligibilityRules: search?.get("includeEligibilityRules") || "No",
      }
    : null;

  // State for form fields
  const [carrier, setCarrier] = React.useState("");
  const [billingType, setBillingType] = React.useState("");
  const [planName, setPlanName] = React.useState("");
  const [effectiveDate, setEffectiveDate] = React.useState("");
  const [fundingType, setFundingType] = React.useState("Fully Insured");

  // State for loaded data
  const [carriers, setCarriers] = React.useState<Carrier[]>([]);
  const [carriersLoading, setCarriersLoading] = React.useState(true);
  const [carriersError, setCarriersError] = React.useState<string | null>(null);

  // State for account data
  const [accountData, setAccountData] = React.useState<AccountDto | null>(null);
  const [accountLoading, setAccountLoading] = React.useState(true);
  const [accountError, setAccountError] = React.useState<string | null>(null);

  // Load carriers and account data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      // Load carriers
      try {
        setCarriersLoading(true);
        setCarriersError(null);
        const activeCarriers = await fetchActiveCarriers();
        setCarriers(activeCarriers);
      } catch (error) {
        console.error("Failed to load carriers:", error);
        setCarriersError(
          error instanceof Error ? error.message : "Failed to load carriers"
        );
      } finally {
        setCarriersLoading(false);
      }

      // Load account data - prioritize accountId if available, fallback to account name
      if (accountId) {
        try {
          setAccountLoading(true);
          setAccountError(null);
          const accountInfo = await fetchAccountById(accountId);
          setAccountData(accountInfo);
        } catch (error) {
          console.error("Failed to load account by ID:", error);
          setAccountError(
            error instanceof Error ? error.message : "Failed to load account"
          );
        } finally {
          setAccountLoading(false);
        }
      } else if (account && account !== "(unknown)") {
        try {
          setAccountLoading(true);
          setAccountError(null);
          const accountInfo = await fetchAccountByName(account);
          setAccountData(accountInfo);
          if (!accountInfo) {
            setAccountError(`Account "${account}" not found`);
          }
        } catch (error) {
          console.error("Failed to load account by name:", error);
          setAccountError(
            error instanceof Error ? error.message : "Failed to load account"
          );
        } finally {
          setAccountLoading(false);
        }
      } else {
        setAccountLoading(false);
        setAccountError("No account specified");
      }
    };

    loadData();
  }, [account, accountId]);

  // Effective Dates fields
  const [originalPlanEffectiveDate, setOriginalPlanEffectiveDate] =
    React.useState("");
  const [renewalDate, setRenewalDate] = React.useState("");
  const [commissionStartDate, setCommissionStartDate] = React.useState("");
  const [newBusinessUntil, setNewBusinessUntil] = React.useState("");
  const [continuousPolicy, setContinuousPolicy] = React.useState(false);

  // Additional form fields
  const [commissionsPaidBy, setCommissionsPaidBy] = React.useState("");
  const [policyGroupNumber, setPolicyGroupNumber] = React.useState("");
  const [originationReason, setOriginationReason] =
    React.useState("Replacement");
  const [priorPlan, setPriorPlan] = React.useState("");
  const [automaticActivityLog, setAutomaticActivityLog] = React.useState("");
  const [attributeView, setAttributeView] = React.useState("Express");
  const [eligibleEmployees, setEligibleEmployees] = React.useState("");
  const [metalLevel, setMetalLevel] = React.useState("");
  const [acaSafeHarbor, setAcaSafeHarbor] = React.useState("");
  const [secondaryPlanType, setSecondaryPlanType] =
    React.useState("None Selected");
  const [benefitAttributes, setBenefitAttributes] = React.useState("empty");
  const [currentPlan, setCurrentPlan] = React.useState("");
  const [reportingYear, setReportingYear] = React.useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Plan Configuration"
        actions={createPlanConfigActions(account, replaceId, accountId)}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Account Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            {accountLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">
                  Loading account information...
                </span>
              </div>
            ) : accountError ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Account Error
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{accountError}</p>
                  </div>
                </div>
              </div>
            ) : accountData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Account Name
                    {accountId && (
                      <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Loaded by ID
                      </span>
                    )}
                  </Label>
                  <p className="font-semibold text-lg">
                    {accountData.accountName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Account ID
                  </Label>
                  <p className="font-medium">{accountData.accountId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    State
                  </Label>
                  <p className="font-medium">{accountData.state}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Office Division
                  </Label>
                  <p className="font-medium">{accountData.officeDivision}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    SBA
                  </Label>
                  <p className="font-medium">{accountData.sba}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Plan Type
                  </Label>
                  <p className="font-medium">{replaceType || newType}</p>
                </div>
                {accountData.primarySalesLead && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Primary Sales Lead
                    </Label>
                    <p className="font-medium">
                      {accountData.primarySalesLead}
                    </p>
                  </div>
                )}
                {accountData.classification && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Classification
                    </Label>
                    <p className="font-medium">{accountData.classification}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Commission Basis 1
                  </Label>
                  <p className="font-medium">{accountData.commissionBasis1}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Commission Basis 2
                  </Label>
                  <p className="font-medium">{accountData.commissionBasis2}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Flat Fee
                  </Label>
                  <p className="font-medium">
                    {/* ${accountData.flatFee.toLocaleString()} */}
                    ""
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Percentage
                  </Label>
                  <p className="font-medium">{accountData.percentage}%</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Account: {account}
                  {accountId && (
                    <span className="ml-2 text-xs text-blue-600">
                      (ID: {accountId})
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  Account information not available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Plan Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Carrier*</Label>
                  <Select
                    value={carrier}
                    onValueChange={(v) => setCarrier(v)}
                    disabled={
                      carriersLoading ||
                      !!carriersError ||
                      carriers.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          carriersLoading
                            ? "Loading carriers..."
                            : carriersError
                            ? "Error loading carriers"
                            : carriers.length === 0
                            ? "No carriers available"
                            : "Select carrier"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {carriers.map((c: Carrier) => (
                        <SelectItem key={c.carrierId} value={c.companyName}>
                          {c.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Billing Type*</Label>
                  <Select
                    value={billingType}
                    onValueChange={(v) => setBillingType(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BILLING_TYPES.map((t: string) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Commissions/Fees Paid By*</Label>
                  <Select
                    value={commissionsPaidBy}
                    onValueChange={(v) => setCommissionsPaidBy(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select who pays commissions" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMISSIONS_PAID_BY.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plan Name*</Label>
                  <Input
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="Enter plan name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Funding Type</Label>
                  <Select
                    value={fundingType}
                    onValueChange={(v) => setFundingType(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNDING_TYPES.map((f: string) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Policy/Group Number*</Label>
                  <Input
                    value={policyGroupNumber}
                    onChange={(e) => setPolicyGroupNumber(e.target.value)}
                    placeholder="Enter policy/group number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Origination Reason</Label>
                  <p className="text-sm text-gray-600">{originationReason}</p>
                </div>

                <div className="space-y-2">
                  <Label>Prior Plan*</Label>
                  <Input
                    value={priorPlan}
                    onChange={(e) => setPriorPlan(e.target.value)}
                    placeholder="Enter prior plan details"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Automatic Activity Log Creation for Renewal</Label>
                  <Select
                    value={automaticActivityLog}
                    onValueChange={(v) => setAutomaticActivityLog(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Attribute View*</Label>
                  <Select
                    value={attributeView}
                    onValueChange={(v) => setAttributeView(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ATTRIBUTE_VIEWS.map((view) => (
                        <SelectItem key={view} value={view}>
                          {view}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Effective Dates Card */}
            <Card>
              <CardHeader>
                <CardTitle>Effective Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Original Plan Effective Date*</Label>
                  <Input
                    type="date"
                    value={originalPlanEffectiveDate}
                    onChange={(e) =>
                      setOriginalPlanEffectiveDate(e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Effective Date*</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="continuous"
                        checked={continuousPolicy}
                        onCheckedChange={(checked) =>
                          setContinuousPolicy(!!checked)
                        }
                      />
                      <Label htmlFor="continuous" className="text-sm">
                        Continuous Policy
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Renewal Date*</Label>
                  <Input
                    type="date"
                    value={renewalDate}
                    onChange={(e) => setRenewalDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Commission Start Date*</Label>
                  <Input
                    type="date"
                    value={commissionStartDate}
                    onChange={(e) => setCommissionStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>New Business Until</Label>
                  <Input
                    type="date"
                    value={newBusinessUntil}
                    onChange={(e) => setNewBusinessUntil(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Number of Eligible Employees</Label>
                  <Input
                    type="number"
                    value={eligibleEmployees}
                    onChange={(e) => setEligibleEmployees(e.target.value)}
                    placeholder="Enter number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Metal Level</Label>
                  <Select
                    value={metalLevel}
                    onValueChange={(v) => setMetalLevel(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {METAL_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ACA Safe Harbor Affordability</Label>
                  <Select
                    value={acaSafeHarbor}
                    onValueChange={(v) => setAcaSafeHarbor(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACA_SAFE_HARBOR.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reporting Year</Label>
                    <Input
                      value={reportingYear}
                      onChange={(e) => setReportingYear(e.target.value)}
                      placeholder="YYYY"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Secondary Plan Type</Label>
                  <Select
                    value={secondaryPlanType}
                    onValueChange={(v) => setSecondaryPlanType(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECONDARY_PLAN_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Benefit Attributes</Label>
                  <RadioGroup
                    value={benefitAttributes}
                    onValueChange={setBenefitAttributes}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="empty" id="empty" />
                      <Label htmlFor="empty" className="text-sm">
                        Leave attribute values empty
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="text-sm">
                        Use standard plan attribute defaults{" "}
                        <span className="text-gray-500 italic">
                          (Values are populated for all plan attributes
                          regardless of selected Attribute View.)
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="copy" id="copy" />
                      <Label htmlFor="copy" className="text-sm">
                        Copy benefit attribute values from a current plan
                      </Label>
                    </div>
                  </RadioGroup>

                  {benefitAttributes === "copy" && (
                    <div className="mt-3">
                      <Label className="text-sm font-medium">
                        Current Plan
                      </Label>
                      <Input
                        value={currentPlan}
                        onChange={(e) => setCurrentPlan(e.target.value)}
                        placeholder="Enter current plan details"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Link
                href={`/review?${new URLSearchParams({
                  // New plan data
                  account: account,
                  planName: planName,
                  carrier: carrier,
                  billingType: billingType,
                  commissionsPaidBy: commissionsPaidBy,
                  fundingType: fundingType,
                  policyGroupNumber: policyGroupNumber,
                  originalPlanEffectiveDate: originalPlanEffectiveDate,
                  effectiveDate: effectiveDate,
                  renewalDate: renewalDate,
                  commissionStartDate: commissionStartDate,
                  newBusinessUntil: newBusinessUntil,
                  continuousPolicy: continuousPolicy.toString(),
                  originationReason: originationReason,
                  priorPlan: priorPlan,
                  automaticActivityLog: automaticActivityLog,
                  attributeView: attributeView,
                  eligibleEmployees: eligibleEmployees,
                  metalLevel: metalLevel,
                  acaSafeHarbor: acaSafeHarbor,
                  reportingYear: reportingYear,
                  secondaryPlanType: secondaryPlanType,
                  benefitAttributes: benefitAttributes,
                  currentPlan: currentPlan,
                  // Replacement scenario flag and data
                  isReplacement: replaceId ? "true" : "false",
                  replaceId: replaceId || "",
                  replaceType: replaceType || "",
                  // Original plan data (for replacement scenarios)
                  ...(originalPlanData || {}),
                }).toString()}`}
              >
                <Button
                  disabled={
                    !carrier ||
                    !billingType ||
                    !planName ||
                    !effectiveDate ||
                    !originalPlanEffectiveDate ||
                    !renewalDate ||
                    !commissionStartDate ||
                    !commissionsPaidBy ||
                    !policyGroupNumber ||
                    !priorPlan
                  }
                >
                  Continue to Review
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
