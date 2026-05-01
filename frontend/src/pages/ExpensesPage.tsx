import { Calendar, Plus, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { StatCard } from '../components/common/StatCard'
import { useFinance } from '../context/FinanceContext'

const currency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const ExpensesPage = () => {
  const { selectedMonth, setSelectedMonth, filteredExpenseEntries, addExpense, deleteExpense } = useFinance()
  const [query, setQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({
    amount: '1240',
    currency: 'USD',
    category: 'Software',
    date: `${selectedMonth}-24`,
    project: 'Acme Corp Redesign',
    description: 'Annual Figma Enterprise License',
    recurring: false,
  })

  const total = filteredExpenseEntries.reduce((sum, entry) => sum + entry.amount, 0)
  const work = filteredExpenseEntries.filter((entry) => entry.type === 'work').reduce((sum, entry) => sum + entry.amount, 0)
  const personal = filteredExpenseEntries
    .filter((entry) => entry.type === 'personal')
    .reduce((sum, entry) => sum + entry.amount, 0)

  const visibleExpenses = useMemo(
    () =>
      filteredExpenseEntries.filter(
        (entry) =>
          entry.vendor.toLowerCase().includes(query.toLowerCase()) ||
          entry.description.toLowerCase().includes(query.toLowerCase()) ||
          entry.category.toLowerCase().includes(query.toLowerCase()),
      ),
    [filteredExpenseEntries, query],
  )

  const spendByCategory = useMemo(() => {
    const grouped = visibleExpenses.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + entry.amount
      return acc
    }, {})
    return Object.entries(grouped).sort((a, b) => b[1] - a[1])
  }, [visibleExpenses])

  const handleSubmitExpense = async () => {
    const amount = Number(newExpense.amount)
    if (!amount || !newExpense.description.trim()) return
    await addExpense({
      vendor: newExpense.project,
      description: newExpense.description.trim(),
      category: newExpense.category,
      type: newExpense.category === 'Meals' || newExpense.category === 'Food & Dining' ? 'personal' : 'work',
      amount,
      date: newExpense.date,
      isRecurring: newExpense.recurring,
    })
    setIsAddModalOpen(false)
  }

  return (
    <section className="animate-[fadeIn_.35s_ease] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-5xl font-semibold text-slate-900">Expenses</h2>
          <p className="mt-2 text-lg text-slate-600">Track and manage your operational costs.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="rounded-lg border border-panel-border bg-white px-3 py-2 text-sm transition hover:shadow-panel"
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
          >
            <Plus size={14} />
            Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <StatCard title="Total Spend" value={currency(total)} trend="+2.4% vs last month" positive={false} />
        <StatCard title="Work Related" value={currency(work)} trend="-1.1% vs last month" positive />
        <StatCard title="Personal" value={currency(personal)} trend="+5.0% vs last month" positive={false} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <section className="overflow-hidden rounded-2xl border border-panel-border bg-white xl:col-span-3">
          <div className="flex flex-wrap items-center gap-2 border-b border-panel-border px-4 py-3">
            <label className="flex min-w-64 flex-1 items-center gap-2 rounded-lg bg-surface-bg px-3 py-2 text-slate-500">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search expenses..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <button className="rounded-lg border border-panel-border px-3 py-2 text-sm transition hover:bg-slate-50">All Categories</button>
            <button className="rounded-lg border border-panel-border px-3 py-2 text-sm transition hover:bg-slate-50">All Types</button>
            <button className="rounded-lg border border-panel-border px-3 py-2 text-sm transition hover:bg-slate-50">Date Range</button>
          </div>

          <table className="min-w-full text-left">
            <thead className="bg-surface-bg text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleExpenses.map((entry) => (
                <tr key={entry.id} className="border-t border-panel-border transition hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{entry.vendor}</p>
                    <p className="text-sm text-slate-500">{entry.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{entry.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-sm ${entry.type === 'work' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      <span className={`h-2 w-2 rounded-full ${entry.type === 'work' ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                      {entry.type === 'work' ? 'Work' : 'Personal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">-{currency(entry.amount)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteExpense(entry.id)}
                      className="rounded-md border border-panel-border p-2 text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-panel-border bg-white p-5">
          <h3 className="mb-6 text-3xl font-semibold text-slate-900">Spend by Category</h3>
          <ul className="space-y-4">
            {spendByCategory.map(([category, amount]) => {
              const ratio = total > 0 ? (amount / total) * 100 : 0
              return (
                <li key={category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{category}</span>
                    <span>{currency(amount)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${ratio}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl animate-[fadeIn_.2s_ease] overflow-hidden rounded-2xl border border-panel-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-panel-border px-6 py-4">
              <h3 className="text-4xl font-semibold text-slate-900">Add Expense</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="rounded p-1 text-slate-500 transition hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="mb-2 text-sm text-slate-600">Amount</p>
                <div className="flex items-center gap-3 border-b border-panel-border pb-2">
                  <select
                    value={newExpense.currency}
                    onChange={(event) => setNewExpense((prev) => ({ ...prev, currency: event.target.value }))}
                    className="rounded-lg border border-panel-border bg-surface-bg px-3 py-2 text-sm outline-none transition focus:border-primary"
                  >
                    <option value="USD">$ USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="SAR">SAR</option>
                    <option value="AED">AED</option>
                    <option value="EGP">EGP</option>
                  </select>
                  <input
                    value={newExpense.amount}
                    onChange={(event) => setNewExpense((prev) => ({ ...prev, amount: event.target.value }))}
                    className="w-full text-right text-5xl font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-600">Category</p>
                <div className="flex flex-wrap gap-2">
                  {['Software', 'Travel', 'Food & Dining', 'Supplies', 'Meals'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setNewExpense((prev) => ({ ...prev, category }))}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        newExpense.category === category
                          ? 'border-primary bg-primary text-white'
                          : 'border-panel-border bg-surface-bg text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-2 text-sm">
                  <span className="text-slate-600">Date</span>
                  <div className="flex items-center gap-2 rounded-lg border border-panel-border px-3 py-2">
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(event) => setNewExpense((prev) => ({ ...prev, date: event.target.value }))}
                      className="w-full outline-none"
                    />
                    <Calendar size={16} className="text-slate-500" />
                  </div>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-slate-600">Linked Project</span>
                  <input
                    value={newExpense.project}
                    onChange={(event) => setNewExpense((prev) => ({ ...prev, project: event.target.value }))}
                    className="w-full rounded-lg border border-panel-border px-3 py-2"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm">
                <span className="text-slate-600">Description</span>
                <input
                  value={newExpense.description}
                  onChange={(event) => setNewExpense((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full rounded-lg border border-panel-border px-3 py-2"
                />
              </label>

              <div className="flex items-center justify-between border-t border-panel-border pt-4">
                <div>
                  <p className="font-medium text-slate-900">Recurring Expense</p>
                  <p className="text-sm text-slate-500">Automatically duplicate this entry periodically.</p>
                </div>
                <button
                  onClick={() => setNewExpense((prev) => ({ ...prev, recurring: !prev.recurring }))}
                  className={`relative h-7 w-12 rounded-full transition ${newExpense.recurring ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      newExpense.recurring ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-panel-border px-6 py-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitExpense}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:brightness-105"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
