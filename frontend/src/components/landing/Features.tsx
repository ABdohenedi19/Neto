import { motion } from 'framer-motion'
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Real-Time Expense Tracking',
    description:
      'Track every transaction instantly and stay in control of your finances without lifting a finger.',
    icon: ArrowPathIcon,
  },
  {
    name: 'AI-Powered Budgeting',
    description:
      'Let AI analyze your habits and create smarter budgets that actually work for your lifestyle.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Actionable Financial Insights',
    description:
      'Turn your financial data into clear insights that help you spend better and save faster.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Bank-Level Security',
    description:
      'We use advanced encryption to keep your data safe, private, and fully under your control.',
    icon: LockClosedIcon,
  },
]

export default function Features() {
  return (
    <section className="bg-surface-bg py-28" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            Everything you need to manage your finances
          </p>
          <p className="mt-6 text-lg text-slate-600">
            Powerful tools for budgeting, expense tracking, invoicing, and financial planning, all designed for freelancers and small teams.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="mx-auto mt-20 max-w-5xl">
          <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl border border-panel-border bg-white p-6 pl-16 shadow-sm transition"
              >
                <dt className="text-base font-semibold text-slate-900">
                  <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  {feature.name}
                </dt>

                <dd className="mt-2 text-base text-slate-600">
                  {feature.description}
                </dd>

                {/* subtle glow on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100" />
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}