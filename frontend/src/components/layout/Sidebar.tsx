import { BarChart3, HandCoins, LayoutDashboard, ReceiptText, WalletCards } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/income', label: 'Income', icon: WalletCards },
  { to: '/invoice-generator', label: 'Invoices', icon: ReceiptText },
  { to: '/expenses', label: 'Expenses', icon: HandCoins },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

export const Sidebar = () => {
  const { user } = useAuth()
  const fallbackAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name ?? 'Neto User')}`

  return (
    <aside className="flex h-full w-56 flex-col justify-between bg-primary-dark px-4 py-6 text-slate-100">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Neto</h1>
          <p className="text-xs text-slate-300">Financial Mastery</p>
        </div>
        <nav className="space-y-2">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `group relative block ${isActive ? 'translate-x-1' : ''}`}
            >
              {({ isActive }) => (
                <div
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#032A43] text-white shadow-[inset_0_0_0_1px_rgba(14,138,104,0.25)]'
                      : 'text-slate-300 hover:translate-x-1 hover:bg-[#062E48]'
                  }`}
                >
                  <span
                    className={`absolute -left-4 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Icon size={16} />
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="space-y-4 border-t border-white/10 pt-4">
        <NavLink
          to="/pricing"
          className="block w-full rounded-lg bg-[#052C46] py-2 text-center text-sm font-medium text-emerald-300 transition hover:-translate-y-0.5 hover:brightness-110"
        >
          Upgrade to Pro
        </NavLink>
        <div className="flex items-center gap-3 rounded-xl bg-[#031C2F] px-3 py-3">
          <img
            src={user?.avatarUrl ?? fallbackAvatar}
            alt={user?.name ?? 'User avatar'}
            className="h-10 w-10 rounded-full border border-white/20 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? 'osama'}</p>
            <p className="truncate text-xs text-slate-300">{user?.email ?? 'osama@salamhack.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
