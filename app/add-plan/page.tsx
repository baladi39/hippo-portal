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
import { useSearchParams } from "next/navigation";
import React from "react";
import { planTypes } from "../_data/mock";

export default function AddPlanPage() {
  const search = useSearchParams();
  const account = search?.get("account") || "(unknown)";
  const [newPlanType, setNewPlanType] = React.useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/account-plans?account=${encodeURIComponent(account)}`}
              >
                <Button variant="ghost" size="sm">
                  Back to Plans
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add New Plan</h1>
            </div>
            <Link href="/login">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </div>

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
                    {planTypes.map((t: string) => (
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
