"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { billingTypes, carriers, fundingTypes } from "../_data/mock";

export default function PlanConfigPage() {
  const search = useSearchParams();
  const account = search?.get("account") || "(unknown)";
  const newType = search?.get("newType") || "";
  const replaceId = search?.get("replaceId") || null;
  const replaceType = search?.get("replaceType") || null;

  const [carrier, setCarrier] = React.useState("");
  const [billingType, setBillingType] = React.useState("");
  const [planName, setPlanName] = React.useState("");
  const [effectiveDate, setEffectiveDate] = React.useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={
                  replaceId
                    ? `/replace-plan?account=${encodeURIComponent(
                        account
                      )}&planId=${replaceId}`
                    : `/add-plan?account=${encodeURIComponent(account)}`
                }
              >
                <Button variant="ghost" size="sm">
                  Back to Plan Selection
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Plan Configuration
              </h1>
            </div>
            <Link href="/login">
              <Button variant="outline">Sign Out</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Account</Label>
                <p className="font-medium">{account}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Plan Type</Label>
                <p className="font-medium">{replaceType || newType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Carrier</Label>
                <Select value={carrier} onValueChange={(v) => setCarrier(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((c: string) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Billing Type</Label>
                <Select
                  value={billingType}
                  onValueChange={(v) => setBillingType(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing type" />
                  </SelectTrigger>
                  <SelectContent>
                    {billingTypes.map((t: string) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Plan Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Funding Type</Label>
                <Select value={"Fully Insured"} onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingTypes.map((f: string) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex justify-end">
                  <Link
                    href={`/review?account=${encodeURIComponent(
                      account
                    )}&planName=${encodeURIComponent(
                      planName
                    )}&carrier=${encodeURIComponent(
                      carrier
                    )}&effectiveDate=${encodeURIComponent(effectiveDate)}`}
                  >
                    <Button
                      disabled={
                        !carrier || !billingType || !planName || !effectiveDate
                      }
                    >
                      Continue to Review
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
