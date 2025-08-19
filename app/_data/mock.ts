export const mockAccounts = [
  {
    id: 1,
    name: "The Daily Grind",
    industry: "Food & Beverage",
    employees: 25,
    status: "Active",
  },
  {
    id: 2,
    name: "Tech Solutions Inc",
    industry: "Technology",
    employees: 150,
    status: "Active",
  },
  {
    id: 3,
    name: "Green Valley Medical",
    industry: "Healthcare",
    employees: 75,
    status: "Active",
  },
  {
    id: 4,
    name: "Metro Construction",
    industry: "Construction",
    employees: 200,
    status: "Active",
  },
  {
    id: 5,
    name: "Sunrise Retail",
    industry: "Retail",
    employees: 45,
    status: "Active",
  },
];

export const mockPlans = [
  {
    id: 1,
    name: "Medical PPO",
    type: "Medical",
    carrier: "Blue Cross Blue Shield",
    status: "Active",
    effectiveDate: "2024-01-01",
    employees: 25,
  },
  {
    id: 2,
    name: "Dental PPO",
    type: "Dental",
    carrier: "Delta Dental",
    status: "Active",
    effectiveDate: "2024-01-01",
    employees: 20,
  },
  {
    id: 3,
    name: "Vision Plan",
    type: "Vision",
    carrier: "VSP",
    status: "Active",
    effectiveDate: "2024-01-01",
    employees: 18,
  },
  {
    id: 4,
    name: "Life Insurance",
    type: "Life",
    carrier: "MetLife",
    status: "Active",
    effectiveDate: "2024-01-01",
    employees: 25,
  },
];

export const planTypes = [
  "Medical PPO",
  "Medical HMO",
  "Dental PPO",
  "Dental HMO",
  "Vision Plan",
  "Life Insurance",
  "Disability Insurance",
  "HSA Plan",
];

export const carriers = [
  "AFLAC",
  "Blue Cross Blue Shield",
  "Aetna",
  "Cigna",
  "UnitedHealthcare",
  "Delta Dental",
  "VSP",
  "MetLife",
  "Guardian",
];

export const billingTypes = ["Direct Bill", "List Bill", "Self-Administered"];
export const fundingTypes = [
  "Fully Insured",
  "Self-Funded",
  "Level Funded",
  "Stop Gap",
];
