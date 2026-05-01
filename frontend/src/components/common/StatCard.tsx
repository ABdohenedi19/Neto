import { ArrowDown, ArrowUp, CircleDollarSign } from 'lucide-react'

export const StatCard = ({
  title,
  value,
  trend,
  positive = true,
  highlight,
}: {
  title: string
  value: string
  trend: string
  positive?: boolean
  highlight?: boolean
}) => (
  <article
    className={`rounded-2xl border bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1 hover:shadow-md ${
      highlight ? 'border-primary ring-1 ring-primary/30' : 'border-panel-border'
    }`}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <span className="rounded-full bg-slate-100 p-2 text-slate-500">
        <CircleDollarSign size={14} />
      </span>
    </div>
    <p className="mt-3 text-[40px] font-semibold leading-none text-slate-900">{value}</p>
    <p className={`mt-3 inline-flex items-center gap-1 text-sm ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
      {positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
      {trend}
    </p>
  </article>
)
