import { CalendarDays, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CashFlowChart } from "../components/charts/CashFlowChart";
import { ExpenseDonutChart } from "../components/charts/ExpenseDonutChart";
import { StatsCardGrid } from "../components/common/StatsCardGrid";
import { useFinance } from "../context/FinanceContext";
import { ProjectsPage } from "./ProjectsPage";
import { useState } from "react";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    selectedMonth,
    setSelectedMonth,
    dashboardCards,
    cashFlowData,
    expenseDonutData,
    projectProfitability,
    recentExpenses,
  } = useFinance();
  const [showProjects, setShowProjects] = useState(false);
  const totalExpensesValue =
    dashboardCards.find((card) => card.title === "Total Expenses")?.value ??
    "$0";
  const totalExpenses = Number(totalExpensesValue.replace(/[^0-9.]/g, "")) || 0;

  return (
    <>
      <section className="animate-[fadeIn_.35s_ease] space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-5xl font-semibold text-slate-900">Overview</h2>
            <p className="mt-2 text-lg text-slate-600">
              Your financial health at a glance.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 rounded-xl border border-panel-border bg-white px-4 py-2 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:shadow-panel">
            <CalendarDays size={16} />
            <input
              type="month"
              className="border-0 bg-transparent outline-none focus:outline-none focus:ring-0"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            />
          </label>
          <button
            onClick={() => setShowProjects(true)}
            className="bg-primary text-white px-4 py-2 rounded-xl"
          >
            Manage Projects
          </button>
        </div>

        <StatsCardGrid cards={dashboardCards} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CashFlowChart data={cashFlowData} />
          </div>
          <ExpenseDonutChart
            data={expenseDonutData}
            totalExpenses={totalExpenses}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <section className="overflow-hidden rounded-2xl border border-panel-border bg-white xl:col-span-2">
            <header className="flex items-center justify-between border-b border-panel-border px-6 py-4">
              <h3 className="text-4xl font-semibold text-slate-900">
                Project Profitability
              </h3>
              <button className="text-sm font-medium text-primary">
                View All
              </button>
            </header>
            <table className="min-w-full text-left">
              <thead className="bg-surface-bg text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">Project / Client</th>
                  <th className="px-6 py-3">Revenue</th>
                  <th className="px-6 py-3">Expenses</th>
                  <th className="px-6 py-3">Margin</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {projectProfitability.map((project) => (
                  <tr key={project.id} className="border-t border-panel-border">
                    <td className="px-6 py-4">
                      <p className="font-medium">{project.project}</p>
                      <p className="text-sm text-slate-500">{project.client}</p>
                    </td>
                    <td className="px-6 py-4">
                      ${project.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      ${project.expenses.toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 font-medium ${project.margin >= 70 ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {project.margin}%
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          project.status === "Active"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="overflow-hidden rounded-2xl border border-panel-border bg-white">
            <header className="flex items-center justify-between border-b border-panel-border px-5 py-4">
              <h3 className="text-4xl font-semibold text-slate-900">
                Recent Expenses
              </h3>
              <Filter size={16} className="text-slate-500" />
            </header>
            <ul>
              {recentExpenses.map((expense) => (
                <li
                  key={`${expense.vendor}-${expense.date}`}
                  className="flex items-center justify-between border-b border-panel-border px-5 py-4 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {expense.vendor}
                    </p>
                    <p className="text-sm text-slate-500">{expense.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ${Math.abs(expense.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">{expense.date}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/expenses")}
              className="w-full border-t border-panel-border py-3 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              See all expenses
            </button>
          </section>
        </div>
      </section>
      {showProjects && <ProjectsPage onClose={() => setShowProjects(false)} />}
    </>
  );
};
