export interface DashboardData {
  totalIncomeThisMonth: number;
  totalExpensesThisMonth: number;
  netProfit: number;
  savingsRate: number;

  last6MonthsBar: {
    month: string;
    income: number;
    expenses: number;
  }[];

  expensesByCategory: {
    category: string;
    total: number;
  }[];

  projectProfitability: {
    projectName: string;
    revenue: number;
    netMargin: number;
    belowThreshold: boolean;
  }[];
}

export interface TransactionResponse {
  type: "Expense" | "Income" | "TopUp" | "Project";
  amount: number;
  reference: string;
  createdAt: string;
}

export interface FixedIncomeResponse {
  id: string;
  label: string;
  amount: number;
  isActive: boolean;
  createdAt: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  clientName: string;
  amount: number;
  status: "Pending" | "Received";
  date: string;
  createdAt?: string;
  invoice?: InvoiceResponse | null;
}

export interface ExpenseResponse {
  id: string;
  vendor?: string;
  name?: string;
  description: string;
  category: string;
  type?: "work" | "personal";
  amount: number;
  date: string;
  isRecurring?: boolean;
}

export interface ExpenseGroupResponse {
  id: string;
  categoryId: string;
  name: string;
  amount: number;
  isRecurring: boolean;
  createdAt: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
  expenseGroups: ExpenseGroupResponse[];
}

export interface CreateProjectPayload {
  name: string;
  clientName: string;
  amount: number;
  date: string;
}

export interface CreateInvoicePayload {
  projectId: string;
  clientName: string;
  description: string;
  amount: number;
  dueDate: string;
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  clientName: string;
  description: string;
  amount: number;
  dueDate: string;
  pdfUrl: string | null;
  createdAt: string;
}

export interface CreateProjectInvoicePayload {
  projectName: string;
  clientName: string;
  description: string;
  amount: number;
  projectDate: string;
  dueDate: string;
}

export interface IncomeEntry {
  id: string;
  type: "fixed" | "project";
  client: string;
  project: string;
  amount: number;
  date: string;
  status?: "Pending" | "Received";
}

export interface ExpenseEntry {
  id: string;
  vendor: string;
  description: string;
  category: string;
  type: "work" | "personal";
  amount: number;
  date: string;
  isRecurring?: boolean;
}

export interface DashboardCard {
  title: string;
  value: string;
  trend: string;
  positive: boolean;
}

export interface CashFlowItem {
  week: string;
  income: number;
  expense: number;
}

export interface ExpenseDonutItem {
  label: string;
  value: number;
  color: string;
}

export interface ProjectProfitabilityItem {
  id: string;
  project: string;
  client: string;
  revenue: number;
  expenses: number;
  margin: number;
  status: string;
}

export interface RecentExpense {
  vendor: string;
  category: string;
  amount: number;
  date: string;
}

export interface FinanceContextValue {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;

  dashboardCards: DashboardCard[];
  cashFlowData: CashFlowItem[];
  expenseDonutData: ExpenseDonutItem[];
  projectProfitability: ProjectProfitabilityItem[];
  recentExpenses: RecentExpense[];

  filteredIncomeEntries: IncomeEntry[];
  filteredExpenseEntries: ExpenseEntry[];
  addIncome: (label: string, amount: number) => Promise<void>;
  addExpense: (payload: Omit<ExpenseEntry, "id">) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;

createProjectInvoice: (
  projectId: string,
  payload: {
    clientName: string;
    description: string;
    amount: number;
    dueDate: string;
  }
) => Promise<InvoiceResponse | null>;
  projects: ProjectResponse[];

  addProject: (payload: {
    name: string;
    clientName: string;
    amount: number;
    date: string;
  }) => Promise<void>;
  updateProject: (
    projectId: string,
    payload: {
      name: string;
      clientName: string;
      amount: number;
      date: string;
    }
  ) => Promise<void>;
  receiveProject: (projectId: string) => Promise<void>;
}
