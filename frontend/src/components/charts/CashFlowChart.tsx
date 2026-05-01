import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CashFlowPoint } from '../../types'

export const CashFlowChart = ({ data }: { data: CashFlowPoint[] }) => (
  <section className="rounded-2xl border border-panel-border bg-white p-5">
    <h3 className="mb-4 text-4xl font-semibold text-slate-900">Cash Flow</h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#E7EEEA" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" name="Income" stroke="#0E8A68" strokeWidth={3} />
          <Line type="monotone" dataKey="expense" name="Expense" stroke="#DE5656" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
)
