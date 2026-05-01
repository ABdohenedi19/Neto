import type { Invoice } from '../../types'

const statusStyle: Record<string, string> = {
  Received: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-slate-200 text-slate-700',
  Overdue: 'bg-rose-100 text-rose-700',
  Draft: 'bg-amber-100 text-amber-700',
}

export const InvoiceTable = ({ items }: { items: Invoice[] }) => (
  <div className="overflow-hidden rounded-2xl border border-panel-border bg-white">
    <table className="min-w-full text-left">
      <thead className="bg-surface-bg text-xs uppercase tracking-wide text-slate-500">
        <tr>
          <th className="px-6 py-4">Invoice</th>
          <th className="px-6 py-4">Client / Project</th>
          <th className="px-6 py-4">Date</th>
          <th className="px-6 py-4">Amount</th>
          <th className="px-6 py-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((invoice) => (
          <tr key={invoice.id} className="border-t border-panel-border">
            <td className="px-6 py-4 font-semibold">{invoice.id}</td>
            <td className="px-6 py-4">
              <p className="font-medium">{invoice.client}</p>
              <p className="text-sm text-slate-500">{invoice.project}</p>
            </td>
            <td className="px-6 py-4 text-slate-600">{invoice.date}</td>
            <td className="px-6 py-4 font-medium">${invoice.amount.toLocaleString()}</td>
            <td className="px-6 py-4">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[invoice.status]}`}>
                {invoice.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
