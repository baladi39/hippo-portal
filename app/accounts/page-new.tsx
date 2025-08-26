import { Card, CardContent } from "@/components/ui/card";
import {
  PageHeader,
  createAccountsPageActions,
} from "@/components/ui/page-header";
import { AccountsTable } from "./accounts-table";
import {
  fetchPlansWithAccounts,
  getSummaryData,
  searchPlansWithAccounts,
  type PlanDto,
} from "./actions";
import { SearchForm } from "./search-form";
import { SummaryCards } from "./summary-cards";

interface AccountsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AccountsPage({
  searchParams,
}: AccountsPageProps) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.search as string;

  // Fetch data on the server
  let plans: PlanDto[] = [];
  let summaryData, error;

  try {
    // Fetch plans (with search if provided)
    const plansPromise = searchTerm
      ? searchPlansWithAccounts(searchTerm)
      : fetchPlansWithAccounts();

    // Fetch summary data
    const summaryPromise = getSummaryData();

    // Wait for both to complete
    const [plansResult, summaryResult] = await Promise.all([
      plansPromise,
      summaryPromise,
    ]);

    plans = plansResult.plans;
    summaryData = summaryResult;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load data";
    plans = [];
    summaryData = null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Hippo Portal" actions={createAccountsPageActions()} />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Accounts</h2>
          <p className="text-gray-600">
            Manage your client accounts and their benefit plans
          </p>
        </div>

        {/* Search */}
        <SearchForm initialSearchTerm={searchTerm || ""} />

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-red-600 text-center">
                <p className="font-medium">Error loading data</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        {!error && summaryData && <SummaryCards summaryData={summaryData} />}

        {/* Plans Table */}
        {!error && (
          <Card>
            <CardContent className="p-6">
              <AccountsTable plans={plans} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
