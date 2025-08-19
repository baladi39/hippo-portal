"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mockPlans } from "../_data/mock";

export default function AccountPlansPage() {
  const search = useSearchParams();
  const account = search?.get("account") || "(unknown)";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Back to Accounts
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{account}</h1>
            </div>
            <Link href="/login">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Benefit Plans</h2>
            <p className="text-gray-600 mt-1">
              Manage benefit plans for {account}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/add-plan?account=${encodeURIComponent(account)}`}>
              <Button>Add New Plan</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Enrolled Employees</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPlans.map((plan: any) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.type}</TableCell>
                    <TableCell>{plan.carrier}</TableCell>
                    <TableCell>{plan.status}</TableCell>
                    <TableCell>{plan.effectiveDate}</TableCell>
                    <TableCell>{plan.employees}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          href={`/replace-plan?account=${encodeURIComponent(
                            account
                          )}&planId=${plan.id}`}
                        >
                          <Button variant="ghost" size="sm">
                            Replace
                          </Button>
                        </Link>
                        <Link
                          href={`/plan-config?account=${encodeURIComponent(
                            account
                          )}&planId=${plan.id}`}
                        >
                          <Button variant="ghost" size="sm">
                            Config
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
