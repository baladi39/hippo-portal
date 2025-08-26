"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { type PlanDto } from "./actions";

interface AccountsTableProps {
  plans: PlanDto[];
}

export function AccountsTable({ plans }: AccountsTableProps) {
  const router = useRouter();

  const handleViewAccount = (accountId: number) => {
    router.push(`/account-dashboard?accountId=${accountId}`);
  };

  const handleEditPlan = (planId: number, accountId: number) => {
    router.push(`/plan-config?planId=${planId}&accountId=${accountId}`);
  };

  const handleReplacePlan = (planId: number, accountId: number) => {
    router.push(`/replace-plan?planId=${planId}&accountId=${accountId}`);
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No accounts found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account Name</TableHead>
          <TableHead>Plan Name</TableHead>
          <TableHead>Carrier</TableHead>
          <TableHead>Plan Type</TableHead>
          <TableHead>Effective Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={`${plan.accountId}-${plan.planId}`}>
            <TableCell className="font-medium">
              <button
                onClick={() => handleViewAccount(plan.accountId)}
                className="text-blue-600 hover:text-blue-800 hover:underline text-left"
              >
                {plan.accountName}
              </button>
            </TableCell>
            <TableCell>{plan.planName}</TableCell>
            <TableCell>{plan.carrier}</TableCell>
            <TableCell>
              <span className="capitalize">{plan.planType}</span>
            </TableCell>
            <TableCell>
              {plan.effectiveDate
                ? new Date(plan.effectiveDate).toLocaleDateString()
                : "N/A"}
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  plan.status === "active"
                    ? "bg-green-100 text-green-800"
                    : plan.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : plan.status === "renewal"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {plan.status}
              </span>
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
                  <DropdownMenuItem
                    onClick={() => handleViewAccount(plan.accountId)}
                  >
                    View Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEditPlan(plan.planId, plan.accountId)}
                  >
                    Edit Plan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      handleReplacePlan(plan.planId, plan.accountId)
                    }
                  >
                    Replace Plan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
