"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ReviewPage() {
  const search = useSearchParams();
  const account = search?.get("account") || "(unknown)";
  const planName = search?.get("planName") || "(unnamed)";
  const carrier = search?.get("carrier") || "(none)";
  const effectiveDate = search?.get("effectiveDate") || "(none)";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/plan-config">
                <Button variant="ghost" size="sm">
                  Back to Configuration
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Review New Plan
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
          <CardHeader>
            <CardTitle>Plan Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account</p>
                <p className="font-medium">{account}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plan Name</p>
                <p className="font-medium">{planName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carrier</p>
                <p className="font-medium">{carrier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Effective Date</p>
                <p className="font-medium">{effectiveDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/plan-config">
            <Button variant="outline">Back to Edit</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-green-600 hover:bg-green-700">
              Save New Plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
