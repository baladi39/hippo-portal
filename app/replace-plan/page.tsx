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
import { mockPlans, planTypes } from "../_data/mock";

export default function ReplacePlanPage() {
  const search = useSearchParams();
  const account = search?.get("account") || "(unknown)";
  const planId = Number(search?.get("planId")) || null;
  const plan = mockPlans.find((p: any) => p.id === planId);
  const [replacementPlanType, setReplacementPlanType] = React.useState("");

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
              <h1 className="text-2xl font-bold text-gray-900">Replace Plan</h1>
            </div>
            <Link href="/login">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">
                  Current Plan Being Replaced
                </h3>
                <p className="text-blue-700 mt-1">
                  {plan?.name} - {plan?.carrier}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">Account</p>
                <p className="font-medium text-blue-900">{account}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Select New Plan Type</CardTitle>
            <CardDescription>
              Choose the type of plan you want to replace the current{" "}
              {plan?.name} with
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Plan Type</label>
              <Select
                value={replacementPlanType}
                onValueChange={(v) => setReplacementPlanType(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan type" />
                </SelectTrigger>
                <SelectContent>
                  {planTypes.map((type: string) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-4">
              <Link
                href={`/plan-config?account=${encodeURIComponent(
                  account
                )}&replaceId=${plan?.id}&replaceType=${encodeURIComponent(
                  replacementPlanType
                )}`}
              >
                <Button disabled={!replacementPlanType}>
                  Continue to Configuration
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
