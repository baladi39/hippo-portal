import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, createSignOutAction } from "@/components/ui/page-header";
import Link from "next/link";
import { fetchPlanById, fetchPlanTypes, type PlanTypeOption } from "./actions";
import ReplacePlanForm from "./replace-plan-form";

interface ReplacePlanPageProps {
  searchParams: Promise<{
    account?: string;
    accountId?: string;
    accountid?: string;
    planId?: string;
    planTypeId?: string;
    planTypeName?: string;
    nonBrokered?: string;
    includeSplits?: string;
    includeContributions?: string;
    includeEligibilityRules?: string;
  }>;
}

export default async function ReplacePlanPage({
  searchParams,
}: ReplacePlanPageProps) {
  const params = await searchParams;

  const account = params.account || "(unknown)";
  const accountIdParam = params.accountId || params.accountid;
  const accountId = accountIdParam ? Number(accountIdParam) : null;
  const planIdParam = params.planId;
  const planId = planIdParam ? Number(planIdParam) : null;

  // Show message when no account is selected
  if (!accountId && !account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Replace Plan"
          breadcrumb={
            <Link href="/accounts">
              <Button variant="ghost" size="sm">
                Back to Accounts
              </Button>
            </Link>
          }
          actions={[createSignOutAction()]}
        />
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Account Selected
              </h3>
              <p className="text-gray-600">
                Please select an account to replace a plan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fetch data on the server side
  let plan = null;
  let planTypes: PlanTypeOption[] = [];
  let error = null;

  try {
    console.log("Fetching data with planId:", planId);

    // Fetch plan types using server action
    planTypes = await fetchPlanTypes();

    // Fetch plan details if planId is provided using server action
    if (planId && !isNaN(planId)) {
      console.log("Fetching plan with ID:", planId);
      plan = await fetchPlanById(planId);
      console.log("Plan data fetched:", plan);
    } else {
      console.log("No valid planId provided in URL. planId:", planId);
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    error = err instanceof Error ? err.message : "Failed to load data";
  }

  // Determine initial form values based on loaded plan data or reasonable defaults
  const initialPlanTypeId = plan?.planTypeId;
  const initialPlanTypeName = plan?.planType;

  // Derive form values from plan properties when available
  const initialNonBrokered = plan
    ? plan.commissionPaidByCarrier === "No" ||
      plan.commissionPaidByCarrier === "N/A"
    : false;

  // Set defaults based on plan type or use sensible defaults
  const initialIncludeSplits = plan
    ? plan.planType.toLowerCase().includes("commission")
      ? "Yes"
      : "No"
    : "Yes";

  const initialIncludeContributions = plan
    ? plan.planType.toLowerCase().includes("401") ||
      plan.planType.toLowerCase().includes("retirement")
      ? "Yes"
      : "No"
    : "No";

  const initialIncludeEligibilityRules = plan
    ? plan.status === "Active"
      ? "Yes"
      : "No"
    : "No";

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Error Loading Page
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                href={`/account-dashboard?accountId=${accountId}&tab=plans`}
              >
                <Button>Back to Plans</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Replace Plan"
        breadcrumb={
          <Link href={`/account-dashboard?accountId=${accountId}&tab=plans`}>
            <Button variant="ghost" size="sm">
              Back to Plans
            </Button>
          </Link>
        }
        actions={[createSignOutAction()]}
      />

      <div className="max-w-4xl mx-auto p-6">
        <ReplacePlanForm
          plan={plan}
          planTypes={planTypes}
          accountId={accountId!}
          account={account}
          initialPlanTypeId={initialPlanTypeId}
          initialPlanTypeName={initialPlanTypeName}
          initialNonBrokered={initialNonBrokered}
          initialIncludeSplits={initialIncludeSplits}
          initialIncludeContributions={initialIncludeContributions}
          initialIncludeEligibilityRules={initialIncludeEligibilityRules}
        />
      </div>
    </div>
  );
}
