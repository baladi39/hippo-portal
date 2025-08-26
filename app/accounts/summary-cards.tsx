import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DashboardSummary } from "./actions";

interface SummaryCardsProps {
  summaryData: DashboardSummary;
}

export function SummaryCards({ summaryData }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Plans Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Up for Renewal</span>
            <span className="text-xl font-bold text-orange-600">
              {summaryData.plans.upForRenewal}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">New Business</span>
            <span className="text-xl font-bold text-green-600">
              {summaryData.plans.newBusiness}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Expired No Action</span>
            <span className="text-xl font-bold text-red-600">
              {summaryData.plans.expiredNoAction}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Products Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Up for Renewal</span>
            <span className="text-xl font-bold text-orange-600">
              {summaryData.products.upForRenewal}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">New Business</span>
            <span className="text-xl font-bold text-green-600">
              {summaryData.products.newBusiness}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Expired No Action</span>
            <span className="text-xl font-bold text-red-600">
              {summaryData.products.expiredNoAction}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Record Assignments Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Record Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Due Today</span>
            <span className="text-xl font-bold text-red-600">
              {summaryData.recordAssignments.dueToday}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Past Due</span>
            <span className="text-xl font-bold text-red-700">
              {summaryData.recordAssignments.pastDue}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Upcoming</span>
            <span className="text-xl font-bold text-blue-600">
              {summaryData.recordAssignments.upcoming}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Activities Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Due Today</span>
            <span className="text-xl font-bold text-red-600">
              {summaryData.activities.dueToday}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Past Due</span>
            <span className="text-xl font-bold text-red-700">
              {summaryData.activities.pastDue}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Upcoming</span>
            <span className="text-xl font-bold text-blue-600">
              {summaryData.activities.upcoming}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
