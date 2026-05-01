/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useAuth } from "./AuthContext";
import { financeApi } from "../services/financeApi";
import {
  mapExpenses,
  mapFixedIncome,
  mapProjects,
} from "../mappers/financeMappers";

import type {
  DashboardData,
  IncomeEntry,
  ExpenseEntry,
  FinanceContextValue,
  DashboardCard,
  CashFlowItem,
  ExpenseDonutItem,
  InvoiceResponse,
  ProjectProfitabilityItem,
  RecentExpense,
  ProjectResponse,
} from "../types/finance";

/* ================= CONTEXT ================= */

const FinanceContext = createContext<FinanceContextValue | null>(null);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [data, setData] = useState<DashboardData | null>(null);
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const getPreviousMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
  };
  const [selectedMonth, setSelectedMonth] = useState(getPreviousMonth());
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

  const receiveProject = async (projectId: string) => {
    if (!user) return;

    await financeApi.receiveProject(user.id, projectId);

    await Promise.all([loadProjects(user.id), loadDashboard(user.id)]);
  };

  const loadDashboard = async (userId: string) => {
    const dashboard = await financeApi.getDashboard(userId);
    setData(dashboard);
  };

  useEffect(() => {
    if (!user) return;

    loadDashboard(user.id);
  }, [user]);

  const loadIncome = async (userId: string) => {
    const [fixed, projects] = await Promise.all([
      financeApi.getFixedIncome(userId),
      financeApi.getProjects(userId),
    ]);

    setIncomeEntries([...mapFixedIncome(fixed), ...mapProjects(projects)]);
  };

  const loadExpenses = async (userId: string) => {
    const expenses = await financeApi.getExpenses(userId);
    setExpenseEntries(mapExpenses(expenses));
  };

  const loadProjects = async (userId: string) => {
    const res = await financeApi.getProjects(userId);
    setProjects(res);
  };

  /* ================= projects ================= */
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const run = async () => {
      try {
        const res = await financeApi.getProjects(user.id);
        if (!isMounted) return;
        setProjects(res);
      } catch (err) {
        console.error(err);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [user]);

  /* ================= INCOME ================= */

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const run = async () => {
      try {
        const [fixed, projects] = await Promise.all([
          financeApi.getFixedIncome(user.id),
          financeApi.getProjects(user.id),
        ]);

        if (!isMounted) return;

        setIncomeEntries([...mapFixedIncome(fixed), ...mapProjects(projects)]);
      } catch (err) {
        console.error(err);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [user]);

  /* ================= EXPENSES ================= */

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const run = async () => {
      try {
        const expenses = await financeApi.getExpenses(user.id);
        if (!isMounted) return;
        setExpenseEntries(mapExpenses(expenses));
      } catch (err) {
        console.error(err);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [user]);

  /* ================= ADD projects ================= */

  const addProject = async (payload: {
    name: string;
    clientName: string;
    amount: number;
    date: string;
  }) => {
    if (!user) return;

    await financeApi.createProject(user.id, payload);

    await Promise.all([loadProjects(user.id), loadDashboard(user.id)]);
  };

  const updateProject = async (
    projectId: string,
    payload: {
      name: string;
      clientName: string;
      amount: number;
      date: string;
    },
  ) => {
    if (!user) return;

    await financeApi.updateProject(user.id, projectId, payload);

    await Promise.all([loadProjects(user.id), loadDashboard(user.id)]);
  };

  /* ================= ADD INCOME ================= */

  const addIncome = async (label: string, amount: number) => {
    if (!user) return;

    try {
      await financeApi.addFixedIncome(user.id, label, amount);
      await Promise.all([loadIncome(user.id), loadDashboard(user.id)]);
    } catch (err) {
      console.error(err);
    }
  };

  const addExpense = async (payload: Omit<ExpenseEntry, "id">) => {
    if (!user) return;

    await financeApi.addExpense(user.id, payload);

    await Promise.all([loadExpenses(user.id), loadDashboard(user.id)]);
  };

  const deleteExpense = async (expenseId: string) => {
    if (!user) return;

    try {
      await financeApi.deleteExpense(user.id, expenseId);
      await Promise.all([loadExpenses(user.id), loadDashboard(user.id)]);
    } catch (err) {
      console.error(err);
    }
  };

  const createProjectInvoice = async (
    projectId: string,
    payload: {
      clientName: string;
      description: string;
      amount: number;
      dueDate: string;
    },
  ): Promise<InvoiceResponse | null> => {
    if (!user) return null;

    try {
      const invoice = await financeApi.createProjectInvoice(
        user.id,
        projectId,
        payload,
      );

      await Promise.all([loadIncome(user.id), loadDashboard(user.id)]);

      return invoice;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /* ================= FILTER ================= */

  const filteredIncomeEntries = useMemo(() => {
    return incomeEntries.filter((entry) => {
      const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
      return entryMonth === selectedMonth;
    });
  }, [incomeEntries, selectedMonth]);

  const filteredExpenseEntries = useMemo(() => {
    return expenseEntries.filter((entry) => {
      const entryMonth = new Date(entry.date).toISOString().slice(0, 7);
      return entryMonth === selectedMonth;
    });
  }, [expenseEntries, selectedMonth]);

  /* ================= DASHBOARD CARDS ================= */

  const dashboardCards = useMemo<DashboardCard[]>(() => {
    if (!data) return [];

    return [
      {
        title: "Total Income",
        value: `$${data.totalIncomeThisMonth}`,
        trend: "",
        positive: true,
      },
      {
        title: "Total Expenses",
        value: `$${data.totalExpensesThisMonth}`,
        trend: "",
        positive: false,
      },
      {
        title: "Net Profit",
        value: `$${data.netProfit}`,
        trend: "",
        positive: data.netProfit > 0,
      },
      {
        title: "Savings Rate",
        value: `${Math.round(data.savingsRate)}%`,
        trend: "",
        positive: data.savingsRate > 0,
      },
    ];
  }, [data]);

  /* ================= CASHFLOW ================= */

  const cashFlowData = useMemo<CashFlowItem[]>(() => {
    if (!data) return [];

    return data.last6MonthsBar.map((item) => ({
      week: item.month,
      income: item.income,
      expense: item.expenses,
    }));
  }, [data]);

  /* ================= EXPENSE DONUT ================= */

  const expenseDonutData = useMemo<ExpenseDonutItem[]>(() => {
    if (!data) return [];

    const total = data.expensesByCategory.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    return data.expensesByCategory.map((item, index) => ({
      label: item.category,
      value: total ? Math.round((item.total / total) * 100) : 0,
      color: ["#0E8A68", "#DE5656", "#F59E0B", "#3B82F6", "#8B5CF6"][index % 5],
    }));
  }, [data]);

  /* ================= PROJECT PROFITABILITY ================= */

  const projectProfitability = useMemo<ProjectProfitabilityItem[]>(() => {
    if (!data) return [];

    return data.projectProfitability.map((p, index) => ({
      id: `${p.projectName}-${index}`, // TEMP FIX
      project: p.projectName,
      client: "Client",
      revenue: p.revenue,
      expenses: p.revenue - p.netMargin,
      margin: Math.round((p.netMargin / p.revenue) * 100),
      status: p.belowThreshold ? "Low" : "Active",
    }));
  }, [data]);

  const recentExpenses = useMemo<RecentExpense[]>(() => {
    return filteredExpenseEntries.slice(0, 5).map((e) => ({
      vendor: e.vendor,
      category: e.category,
      amount: e.amount,
      date: e.date,
    }));
  }, [filteredExpenseEntries]);

  /* ================= VALUE ================= */

  return (
    <FinanceContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        dashboardCards,
        cashFlowData,
        expenseDonutData,
        projectProfitability,
        recentExpenses,
        filteredIncomeEntries,
        filteredExpenseEntries,
        addIncome,
        addExpense,
        deleteExpense,
        createProjectInvoice,
        projects,
        addProject,
        updateProject,
        receiveProject,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
};
