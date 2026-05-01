import type {
  FixedIncomeResponse,
  ProjectResponse,
  ExpenseResponse,
  IncomeEntry,
  ExpenseEntry,
  ProjectProfitabilityItem,
} from "../types/finance";

/* ================= FIXED INCOME ================= */

export const mapFixedIncome = (data: FixedIncomeResponse[]): IncomeEntry[] => {
  return data.map((f) => ({
    id: f.id,
    type: "fixed",
    client: f.label,
    project: "",
    amount: f.amount,
    date: f.createdAt,
  }));
};

/* ================= PROJECTS ================= */

export const mapProjects = (data: ProjectResponse[]): IncomeEntry[] => {
  return data.map((p) => ({
    id: p.id,
    type: "project",
    client: p.clientName,
    project: p.name,
    amount: p.amount,
    date: p.date,
    status: p.status,
  }));
};

/* ================= EXPENSES ================= */

export const mapExpenses = (data: ExpenseResponse[]): ExpenseEntry[] => {
  return data.map((e) => ({
    id: e.id,
    vendor: e.vendor ?? e.name ?? "Unknown",
    description: e.description,
    category: e.category,
    type: e.type ?? "work",
    amount: e.amount,
    date: e.date,
    isRecurring: e.isRecurring,
  }));
};

/* ================= PROJECT PROFITABILITY ================= */

type ProjectProfitabilityResponse = {
  projectName: string;
  revenue: number;
  netMargin: number;
  belowThreshold: boolean;
};

export const mapProjectProfitability = (
  data: ProjectProfitabilityResponse[],
): ProjectProfitabilityItem[] => {
  return data.map((p) => ({
    project: p.projectName,
    client: "Client",
    revenue: p.revenue,
    expenses: p.revenue - p.netMargin,
    margin: Math.round((p.netMargin / p.revenue) * 100),
    status: p.belowThreshold ? "Low" : "Active",
  }));
};
