import { Card, CardContent } from "@/components/ui/card";
import {
  PageHeader,
  createAccountDashboardActions,
} from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccountDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Hippo Portal - Account Dashboard"
        actions={createAccountDashboardActions()}
      />

      {/* Main Content - Skeleton structure */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-96 mb-2" />
          <Skeleton className="h-5 w-128" />
        </div>

        {/* Tabs Skeleton */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Account Dashboard</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {/* Dashboard Tab Skeleton */}
            <div className="space-y-6">
              {/* Summary Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts/Metrics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info Card */}
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plans">
            {/* Plans Tab Skeleton */}
            <div className="space-y-6">
              {/* Filter/Search Bar */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </CardContent>
              </Card>

              {/* Plans Table */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 border-b pb-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>

                    {/* Table Rows */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-6 gap-4 py-2">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
