import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { ExpenseItem } from '../../types'

interface ExpenseDonutChartProps {
  data: ExpenseItem[]
  totalExpenses: number
}

export const ExpenseDonutChart = ({ data, totalExpenses }: ExpenseDonutChartProps) => {
  return (
    <section className="rounded-2xl border border-panel-border bg-white p-5">
      <h3 className="text-4xl font-semibold text-slate-900">Expenses</h3>
      <div className="relative mx-auto my-6 h-48 w-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={48}
              outerRadius={70}
            >
              {data.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center animate-[fadeIn_.25s_ease]">
          <span className="text-xs uppercase tracking-wide text-slate-500">Total</span>
          <span className="text-lg font-semibold text-slate-900">
            ${totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <span>{item.value}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
