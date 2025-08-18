"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, MoreVertical, ArrowLeft, Calendar } from "lucide-react"

type Screen = "login" | "dashboard" | "account-plans" | "replace-plan" | "add-plan" | "plan-config" | "review"

const mockAccounts = [
  { id: 1, name: "The Daily Grind", industry: "Food & Beverage", employees: 25, status: "Active" },
  { id: 2, name: "Tech Solutions Inc", industry: "Technology", employees: 150, status: "Active" },
  { id: 3, name: "Green Valley Medical", industry: "Healthcare", employees: 75, status: "Active" },
  { id: 4, name: "Metro Construction", industry: "Construction", employees: 200, status: "Active" },
  { id: 5, name: "Sunrise Retail", industry: "Retail", employees: 45, status: "Active" },
]

const mockPlans = [
  {
    id: 1,
    name: "Medical PPO",
    type: "Medical",
    carrier: "Blue Cross Blue Shield",
    status: "Active",
    effectiveDate: "01/01/2024",
    employees: 25,
  },
  {
    id: 2,
    name: "Dental PPO",
    type: "Dental",
    carrier: "Delta Dental",
    status: "Active",
    effectiveDate: "01/01/2024",
    employees: 20,
  },
  {
    id: 3,
    name: "Vision Plan",
    type: "Vision",
    carrier: "VSP",
    status: "Active",
    effectiveDate: "01/01/2024",
    employees: 18,
  },
  {
    id: 4,
    name: "Life Insurance",
    type: "Life",
    carrier: "MetLife",
    status: "Active",
    effectiveDate: "01/01/2024",
    employees: 25,
  },
]

const planTypes = [
  "Medical PPO",
  "Medical HMO",
  "Dental PPO",
  "Dental HMO",
  "Vision Plan",
  "Life Insurance",
  "Disability Insurance",
  "HSA Plan",
]

const carriers = [
  "AFLAC",
  "Blue Cross Blue Shield",
  "Aetna",
  "Cigna",
  "UnitedHealthcare",
  "Delta Dental",
  "VSP",
  "MetLife",
  "Guardian",
]

const billingTypes = ["Direct Bill", "List Bill", "Self-Administered"]

const fundingTypes = ["Fully Insured", "Self-Funded", "Level Funded", "Stop Gap"]

export default function BenefitsPortal() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [replacementPlanType, setReplacementPlanType] = useState<string>("")
  const [newPlanType, setNewPlanType] = useState<string>("")

  const [planConfig, setPlanConfig] = useState({
    carrier: "",
    billingType: "",
    planName: "",
    policyNumber: "",
    originalEffectiveDate: "",
    effectiveDate: "",
    commissionStartDate: "",
    funding: "Fully Insured",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentScreen("dashboard")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.toLowerCase().includes("daily grind")) {
      setSelectedAccount("The Daily Grind")
      setCurrentScreen("account-plans")
    }
  }

  const handleAccountSelect = (accountName: string) => {
    setSelectedAccount(accountName)
    setCurrentScreen("account-plans")
  }

  const handleReplacePlan = (plan: any) => {
    setSelectedPlan(plan)
    setCurrentScreen("replace-plan")
  }

  const handleAddNewPlan = () => {
    setSelectedPlan(null) // Clear any selected plan for replacement
    setNewPlanType("")
    setCurrentScreen("add-plan")
  }

  const handleProceedToConfigFromAdd = () => {
    setCurrentScreen("plan-config")
  }

  const handleProceedToConfig = () => {
    setCurrentScreen("plan-config")
  }

  const handleProceedToReview = () => {
    setCurrentScreen("review")
  }

  const updatePlanConfig = (field: string, value: string) => {
    setPlanConfig((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "carrier" && value
        ? {
            planName: `${replacementPlanType} - ${value}`,
          }
        : {}),
    }))
  }

  const handleSavePlan = () => {
    setCurrentScreen("account-plans")
  }

  if (currentScreen === "login") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">BenefitPoint Portal</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="carrierconnect-internal@threeflow.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="123" required />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentScreen === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">BenefitPoint Portal</h1>
              <Button variant="outline" onClick={() => setCurrentScreen("login")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Account Search</h2>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Enter Account Name (e.g., The Daily Grind)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Manage your client accounts and their benefit plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.industry}</TableCell>
                      <TableCell>{account.employees}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {account.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleAccountSelect(account.name)}>
                          View Plans
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentScreen === "account-plans") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Accounts
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">{selectedAccount}</h1>
              </div>
              <Button variant="outline" onClick={() => setCurrentScreen("login")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Benefit Plans</h2>
                <p className="text-gray-600 mt-1">Manage benefit plans for {selectedAccount}</p>
              </div>
              <Button onClick={handleAddNewPlan}>Add New Plan</Button>
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
                  {mockPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.type}</TableCell>
                      <TableCell>{plan.carrier}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {plan.status}
                        </span>
                      </TableCell>
                      <TableCell>{plan.effectiveDate}</TableCell>
                      <TableCell>{plan.employees}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReplacePlan(plan)}>Replace</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Terminate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockPlans.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockPlans.filter((p) => p.status === "Active").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "replace-plan") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("account-plans")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Plans
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Replace Plan</h1>
              </div>
              <Button variant="outline" onClick={() => setCurrentScreen("login")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">Current Plan Being Replaced</h3>
                    <p className="text-blue-700 mt-1">
                      {selectedPlan?.name} - {selectedPlan?.carrier}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">Account</p>
                    <p className="font-medium text-blue-900">{selectedAccount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select New Plan Type</CardTitle>
              <CardDescription>
                Choose the type of plan you want to replace the current {selectedPlan?.name} with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="plan-type">Plan Type</Label>
                <Select value={replacementPlanType} onValueChange={setReplacementPlanType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {planTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Plan Replacement Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Original Plan:</span>
                    <p className="font-medium">{selectedPlan?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">New Plan Type:</span>
                    <p className="font-medium">{replacementPlanType || "Not selected"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Account:</span>
                    <p className="font-medium">{selectedAccount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Affected Employees:</span>
                    <p className="font-medium">{selectedPlan?.employees} employees</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setCurrentScreen("account-plans")}>
                  Cancel
                </Button>
                <Button onClick={handleProceedToConfig} disabled={!replacementPlanType}>
                  Continue to Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Replacing a plan will terminate the existing plan and create a new one</li>
                <li>• All enrolled employees will need to re-enroll in the new plan</li>
                <li>• Plan effective dates and renewal cycles may change</li>
                <li>• Commission structures may be different for the new plan type</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentScreen === "add-plan") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("account-plans")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Plans
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Add New Plan</h1>
              </div>
              <Button variant="outline" onClick={() => setCurrentScreen("login")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-900">Adding New Benefit Plan</h3>
                    <p className="text-green-700 mt-1">Create a new benefit plan for {selectedAccount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">Account</p>
                    <p className="font-medium text-green-900">{selectedAccount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Plan Type</CardTitle>
              <CardDescription>Choose the type of benefit plan you want to add for {selectedAccount}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-plan-type">Plan Type</Label>
                <Select value={newPlanType} onValueChange={setNewPlanType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {planTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">New Plan Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Account:</span>
                    <p className="font-medium">{selectedAccount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Plan Type:</span>
                    <p className="font-medium">{newPlanType || "Not selected"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-medium">New Plan</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Plans:</span>
                    <p className="font-medium">{mockPlans.length} existing plans</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setCurrentScreen("account-plans")}>
                  Cancel
                </Button>
                <Button onClick={handleProceedToConfigFromAdd} disabled={!newPlanType}>
                  Continue to Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Plan Setup Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• This will create a brand new benefit plan for your account</li>
                <li>• You'll configure carrier, billing, and effective dates in the next step</li>
                <li>• Account team information will be automatically populated</li>
                <li>• Employees can enroll once the plan is active</li>
                <li>• Commission tracking will begin on the specified start date</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentScreen === "plan-config") {
    const isReplacement = selectedPlan !== null
    const currentPlanType = isReplacement ? replacementPlanType : newPlanType

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen(isReplacement ? "replace-plan" : "add-plan")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Plan Selection
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Plan Configuration</h1>
              </div>
              <Button variant="outline" onClick={() => setCurrentScreen("login")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Card className={isReplacement ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm ${isReplacement ? "text-blue-600" : "text-green-600"}`}>Account</p>
                  <p className={`font-medium ${isReplacement ? "text-blue-900" : "text-green-900"}`}>
                    {selectedAccount}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isReplacement ? "text-blue-600" : "text-green-600"}`}>Plan Type</p>
                  <p className={`font-medium ${isReplacement ? "text-blue-900" : "text-green-900"}`}>
                    {currentPlanType}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isReplacement ? "text-blue-600" : "text-green-600"}`}>
                    {isReplacement ? "Replacing" : "Action"}
                  </p>
                  <p className={`font-medium ${isReplacement ? "text-blue-900" : "text-green-900"}`}>
                    {isReplacement ? selectedPlan?.name : "New Plan"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Details</CardTitle>
                <CardDescription>Configure the basic plan information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier *</Label>
                  <Select value={planConfig.carrier} onValueChange={(value) => updatePlanConfig("carrier", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select carrier (e.g., AFLAC)" />
                    </SelectTrigger>
                    <SelectContent>
                      {carriers.map((carrier) => (
                        <SelectItem key={carrier} value={carrier}>
                          {carrier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-type">Billing Type *</Label>
                  <Select
                    value={planConfig.billingType}
                    onValueChange={(value) => updatePlanConfig("billingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {billingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan-name">Plan Name *</Label>
                  <Input
                    id="plan-name"
                    value={planConfig.planName}
                    onChange={(e) => updatePlanConfig("planName", e.target.value)}
                    placeholder="Auto-generated from carrier selection"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policy-number">Policy/Group Number</Label>
                  <Input
                    id="policy-number"
                    value={planConfig.policyNumber}
                    onChange={(e) => updatePlanConfig("policyNumber", e.target.value)}
                    placeholder="Enter number or 'Pending'"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Team Information</CardTitle>
                <CardDescription>Team details (auto-populated from JSON)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Account Manager</Label>
                      <p className="font-medium">Sarah Johnson</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Producer</Label>
                      <p className="font-medium">Mike Chen</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Service Rep</Label>
                      <p className="font-medium">Lisa Rodriguez</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Commission Split</Label>
                      <p className="font-medium">70/30</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Effective Dates</CardTitle>
                <CardDescription>Set plan timing and renewal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="original-effective">Original Plan Effective Date</Label>
                  <Input
                    id="original-effective"
                    type="date"
                    value={planConfig.originalEffectiveDate}
                    onChange={(e) => updatePlanConfig("originalEffectiveDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effective-date">Effective Date *</Label>
                  <Input
                    id="effective-date"
                    type="date"
                    value={planConfig.effectiveDate}
                    onChange={(e) => updatePlanConfig("effectiveDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commission-start">Commission Start Date</Label>
                  <Input
                    id="commission-start"
                    type="date"
                    value={planConfig.commissionStartDate}
                    onChange={(e) => updatePlanConfig("commissionStartDate", e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Renewal date will be automatically calculated for one year after the effective date
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Plan Information</CardTitle>
                <CardDescription>Funding and additional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="funding">Funding Type *</Label>
                  <Select value={planConfig.funding} onValueChange={(value) => updatePlanConfig("funding", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fundingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Note: Select "Fully Insured" except for Stop Gap product type</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Enter any additional plan notes or requirements..." rows={4} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCurrentScreen("replace-plan")}>
              Back
            </Button>
            <Button
              onClick={handleProceedToReview}
              disabled={
                !planConfig.carrier || !planConfig.billingType || !planConfig.planName || !planConfig.effectiveDate
              }
            >
              Continue to Review
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "review") {
    const isReplacement = selectedPlan !== null
    const currentPlanType = isReplacement ? replacementPlanType : newPlanType
    const renewalDate = planConfig.effectiveDate
      ? new Date(new Date(planConfig.effectiveDate).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : ""

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("plan-config")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Configuration
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isReplacement ? "Review Plan Replacement" : "Review New Plan"}
                </h1>
              </div>
              <Button variant="outline" onClick={() => setCurrentScreen("login")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Ready to Save</h3>
                  <p className="text-green-700">
                    Please review all details before {isReplacement ? "replacing the plan" : "creating the new plan"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Account</Label>
                    <p className="font-medium">{selectedAccount}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Plan Type</Label>
                    <p className="font-medium">{currentPlanType}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Carrier</Label>
                    <p className="font-medium">{planConfig.carrier}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Plan Name</Label>
                    <p className="font-medium">{planConfig.planName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Billing Type</Label>
                    <p className="font-medium">{planConfig.billingType}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Policy Number</Label>
                    <p className="font-medium">{planConfig.policyNumber || "Pending"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Account Manager</Label>
                    <p className="font-medium">Sarah Johnson</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Producer</Label>
                    <p className="font-medium">Mike Chen</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Service Rep</Label>
                    <p className="font-medium">Lisa Rodriguez</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Commission Split</Label>
                    <p className="font-medium">70/30</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dates & Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Original Effective Date</Label>
                  <p className="font-medium">{planConfig.originalEffectiveDate || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">New Effective Date</Label>
                  <p className="font-medium">{planConfig.effectiveDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Commission Start</Label>
                  <p className="font-medium">{planConfig.commissionStartDate || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Renewal Date</Label>
                  <p className="font-medium text-blue-600">{renewalDate} (Auto-calculated)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isReplacement ? (
            <Card>
              <CardHeader>
                <CardTitle>Plan Replacement Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Plan Being Replaced</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">Name:</span> {selectedPlan?.name}
                        </p>
                        <p>
                          <span className="text-gray-600">Carrier:</span> {selectedPlan?.carrier}
                        </p>
                        <p>
                          <span className="text-gray-600">Type:</span> {selectedPlan?.type}
                        </p>
                        <p>
                          <span className="text-gray-600">Enrolled:</span> {selectedPlan?.employees} employees
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">New Plan</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">Name:</span> {planConfig.planName}
                        </p>
                        <p>
                          <span className="text-gray-600">Carrier:</span> {planConfig.carrier}
                        </p>
                        <p>
                          <span className="text-gray-600">Type:</span> {currentPlanType}
                        </p>
                        <p>
                          <span className="text-gray-600">Funding:</span> {planConfig.funding}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>New Plan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">Plan Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Plan Name:</span>
                      <p className="font-medium">{planConfig.planName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Carrier:</span>
                      <p className="font-medium">{planConfig.carrier}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium">{currentPlanType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Funding:</span>
                      <p className="font-medium">{planConfig.funding}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {isReplacement ? (
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• The existing {selectedPlan?.name} plan will be terminated</li>
                  <li>
                    • The new {planConfig.planName} plan will be created with effective date {planConfig.effectiveDate}
                  </li>
                  <li>• All {selectedPlan?.employees} enrolled employees will need to re-enroll</li>
                  <li>
                    • Commission tracking will begin on {planConfig.commissionStartDate || planConfig.effectiveDate}
                  </li>
                  <li>• Plan will automatically renew on {renewalDate}</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    • The new {planConfig.planName} plan will be created with effective date {planConfig.effectiveDate}
                  </li>
                  <li>• Employees will be able to enroll once the plan becomes active</li>
                  <li>
                    • Commission tracking will begin on {planConfig.commissionStartDate || planConfig.effectiveDate}
                  </li>
                  <li>• Plan will automatically renew on {renewalDate}</li>
                  <li>• Account team will be notified of the new plan availability</li>
                </ul>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCurrentScreen("plan-config")}>
              Back to Edit
            </Button>
            <Button onClick={handleSavePlan} className="bg-green-600 hover:bg-green-700">
              {isReplacement ? "Save Plan Replacement" : "Save New Plan"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Current Screen: {currentScreen}</h1>
        <Button onClick={() => setCurrentScreen("dashboard")}>Back to Dashboard</Button>
      </div>
    </div>
  )
}
