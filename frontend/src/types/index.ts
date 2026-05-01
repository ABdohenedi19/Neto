
export type InvoiceStatus = 'Received' | 'Pending' | 'Overdue' | 'Draft'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface Invoice {
  id: string
  client: string
  project: string
  date: string
  dueDate: string
  amount: number
  status: InvoiceStatus
}

export interface ExpenseItem {
  label: string
  value: number
  color: string
}

export interface OverviewCardData {
  title: string
  value: string
  trend: string
  positive?: boolean
}

export interface CashFlowPoint {
  week: string
  income: number
  expense: number
}

export interface ProjectProfitabilityItem {
  project: string
  client: string
  revenue: number
  expenses: number
  margin: number
  status: 'Active' | 'Completed'
}

export interface RecentExpenseItem {
  vendor: string
  category: string
  amount: number
  date: string
}

export interface MonthlyDashboardData {
  overviewCards: OverviewCardData[]
  cashFlowData: CashFlowPoint[]
  expenseDonutData: ExpenseItem[]
  projectProfitability: ProjectProfitabilityItem[]
  recentExpenses: RecentExpenseItem[]
}

export type IncomeKind = 'fixed' | 'project'
export type ExpenseKind = 'work' | 'personal'

export interface IncomeEntry {
  id: string
  client: string
  project: string
  amount: number
  date: string
  type: IncomeKind
  status: 'Received' | 'Pending'
}

export interface ExpenseEntry {
  id: string
  vendor: string
  description: string
  category: string
  type: ExpenseKind
  amount: number
  date: string
}
