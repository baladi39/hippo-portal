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
  PageHeader,
  createBackAction,
  createSignOutAction,
} from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const PLAN_TYPES = [
  "Medical PPO",
  "Medical HMO",
  "Dental PPO",
  "Dental HMO",
  "Vision Plan",
  "Life Insurance",
  "Disability Insurance",
  "HSA Plan",
];

export default function AddPlanPage() {
  const search = useSearchParams();
  const account = search?.get("account") || "(unknown)";
  const [newPlanType, setNewPlanType] = React.useState("");

  const headerActions = [
    createBackAction(
      `/account-plans?account=${encodeURIComponent(account)}`,
      "Back to Plans"
    ),
    createSignOutAction(),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Add New Plan" actions={headerActions} />

      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Plan Type</CardTitle>
            <CardDescription>
              Choose the type of benefit plan you want to add for {account}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Plan Type</label>
                <Select
                  value={newPlanType}
                  onValueChange={(v) => setNewPlanType(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_TYPES.map((t: string) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/plan-config?account=${encodeURIComponent(
                    account
                  )}&newType=${encodeURIComponent(newPlanType)}`}
                >
                  <Button disabled={!newPlanType}>
                    Continue to Configuration
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
