import { CheckCircle2 } from 'lucide-react'

const freeFeatures = ['Up to 3 active clients', 'Basic income tracking', 'Monthly expense reports', 'Custom invoice branding']
const proFeatures = [
  'Unlimited active clients',
  'Advanced predictive analytics',
  'Custom branded invoicing',
  'Tax estimation tools',
  'Priority 24/7 support',
]

export const PricingSection = ({ id, className = '' }: { id?: string; className?: string }) => (
  <section id={id} className={`space-y-8 ${className}`}>
    <header className="text-center">
      <h2 className="text-6xl font-semibold text-slate-900">Pricing that grows with you</h2>
      <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
        Choose the plan that fits your freelance journey. Simple, transparent pricing for professionals who value mastery.
      </p>
    </header>

    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <article className="rounded-2xl border border-panel-border bg-white p-6 shadow-panel transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Essential</p>
        <h3 className="mt-1 text-5xl font-semibold text-slate-900">Free</h3>
        <p className="mt-2 text-slate-600">Perfect for getting started and organizing your first clients.</p>
        <p className="mt-5 text-6xl font-bold text-slate-900">
          $0<span className="text-lg font-medium text-slate-500">/mo</span>
        </p>
        <ul className="mt-5 space-y-3">
          {freeFeatures.map((feature, index) => (
            <li key={feature} className={`flex items-center gap-2 text-sm ${index === freeFeatures.length - 1 ? 'text-slate-300' : 'text-slate-700'}`}>
              <CheckCircle2 size={16} className={index === freeFeatures.length - 1 ? 'text-slate-300' : 'text-primary'} />
              {feature}
            </li>
          ))}
        </ul>
        <button className="mt-8 w-full rounded-xl border border-panel-border py-3 text-sm font-medium transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50">
          Get Started
        </button>
      </article>

      <article className="relative rounded-2xl border-2 border-primary bg-white p-6 shadow-lg shadow-primary/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Professional</p>
        <h3 className="mt-1 text-5xl font-semibold text-slate-900">Pro</h3>
        <p className="mt-2 text-slate-600">Full financial suite designed for high-growth freelancers.</p>
        <p className="mt-5 text-6xl font-bold text-slate-900">
          $9<span className="text-lg font-medium text-slate-500">/mo</span>
        </p>
        <ul className="mt-5 space-y-3">
          {proFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 size={16} className="text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <button className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-105">
          Upgrade to Pro
        </button>
      </article>
    </div>

    <section className="rounded-2xl bg-gradient-to-r from-[#08122d] to-[#0f1b45] p-8 text-white transition duration-300 hover:shadow-xl">
      <h3 className="text-5xl font-semibold">Scale with confidence</h3>
      <p className="mt-3 max-w-xl text-slate-300">
        Pro users save an average of 4 hours per week on bookkeeping. Join 2,000+ freelancers managing their growth on Neto.
      </p>
    </section>
  </section>
)
