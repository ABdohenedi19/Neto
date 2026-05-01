import { BriefcaseBusiness, CalendarClock, Plus, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { StatCard } from '../components/common/StatCard'

const currency = (value: number) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export const IncomePage = () => {
  const { selectedMonth, setSelectedMonth, filteredIncomeEntries, addIncome } =
    useFinance()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newIncome, setNewIncome] = useState({
    label: '',
    amount: '1000',
  })

  const fixedIncome = filteredIncomeEntries.filter(
    (entry) => entry.type === 'fixed'
  )
  const projectIncome = filteredIncomeEntries.filter(
    (entry) => entry.type === 'project'
  )

  const fixedTotal = fixedIncome.reduce(
    (sum, entry) => sum + entry.amount,
    0
  )
  const projectTotal = projectIncome.reduce(
    (sum, entry) => sum + entry.amount,
    0
  )

  const total = fixedTotal + projectTotal

  const handleSubmitIncome = async () => {
    const amount = Number(newIncome.amount)
    const label = newIncome.label.trim()
    if (!label || !amount) return

    await addIncome(label, amount)
    setNewIncome({ label: '', amount: '1000' })
    setIsAddModalOpen(false)
  }

  return (
    <section className="animate-[fadeIn_.35s_ease] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-5xl font-semibold text-slate-900">
            Income Overview
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Track your fixed retainers and project-based earnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-panel-border bg-white px-3 py-2 text-sm"
          />

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white"
          >
            <Plus size={14} />
            Add Income
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <StatCard title="Fixed Income" value={currency(fixedTotal)} trend="" positive />
        <StatCard title="Project Income" value={currency(projectTotal)} trend="" positive />
        <StatCard title="Total Income" value={currency(total)} trend="" positive highlight />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border bg-white">
          <header className="flex justify-between border-b px-6 py-4">
            <h3 className="text-4xl font-semibold">Fixed Income</h3>
            <CalendarClock size={18} />
          </header>

          <ul>
            {fixedIncome.map((entry) => (
              <li key={entry.id} className="flex justify-between px-6 py-4 border-b">
                <div>
                  <p className="font-medium">
                    {entry.project
                      ? `${entry.client} ${entry.project}`
                      : entry.client}
                  </p>
                  <p className="text-sm text-slate-500">Monthly</p>
                </div>

                <span>{currency(entry.amount)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border bg-white xl:col-span-2">
          <header className="flex justify-between border-b px-6 py-4">
            <h3 className="text-4xl font-semibold">Project Invoices</h3>
            <BriefcaseBusiness size={18} />
          </header>

          <table className="min-w-full text-left">
            <tbody>
              {projectIncome.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4">
                    <p>{entry.client}</p>
                    <p className="text-sm text-slate-500">
                      {entry.project}
                    </p>
                  </td>

                  <td>{new Date(entry.date).toLocaleDateString()}</td>

                  <td>{currency(entry.amount)}</td>

                  <td>
                    <span>{entry.status}</span>
                  </td>

                  <td>
                    <Wallet size={14} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-xl animate-[fadeIn_.2s_ease] overflow-hidden rounded-2xl border border-panel-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-panel-border px-6 py-4">
              <h3 className="text-4xl font-semibold text-slate-900">Add Income</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="rounded p-1 text-slate-500 transition hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <label className="block space-y-2 text-sm">
                <span className="text-slate-600">Label</span>
                <input
                  value={newIncome.label}
                  onChange={(event) => setNewIncome((prev) => ({ ...prev, label: event.target.value }))}
                  placeholder="Monthly retainer"
                  className="w-full rounded-lg border border-panel-border px-3 py-2"
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="text-slate-600">Amount</span>
                <input
                  value={newIncome.amount}
                  onChange={(event) => setNewIncome((prev) => ({ ...prev, amount: event.target.value }))}
                  className="w-full rounded-lg border border-panel-border px-3 py-2"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-panel-border px-6 py-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitIncome}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:brightness-105"
              >
                Add Income
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}