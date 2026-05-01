import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-primary-dark px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-24 pb-10"
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 138, 104, 0.25), transparent 50%)`,
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-semibold leading-tight text-white md:text-7xl">
            Manage faster.
            <br />
            Save better.
            <br />
            <span className="text-emerald-300">With Neto.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Manage your money 10x faster with smart insights, easy budgeting,
            and clean tracking across income, expenses, and invoices.
          </p>

          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition"
          >
            Start Managing Your Money
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.button>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-800 p-6">
              {/* STATS */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Income", value: "$12.6k" },
                  { label: "Expenses", value: "$4.2k" },
                  { label: "Net Profit", value: "$8.4k", highlight: true },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-xl p-4 ${
                      item.highlight ? "bg-primary/30" : "bg-slate-700/60"
                    }`}
                  >
                    <p className="text-xs text-slate-300">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* CHART */}
              <div className="mt-6 h-36 rounded-xl bg-slate-800/80 p-3">
                <div className="flex h-full items-end gap-2">
                  {[38, 44, 72, 66, 49, 58].map((height, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.08 }}
                      className={`w-full rounded-t ${
                        idx >= 2 && idx <= 3 ? "bg-primary" : "bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* floating glow */}
          <div className="absolute -inset-2 -z-10 rounded-3xl bg-primary/20 blur-2xl opacity-40" />
        </motion.div>
      </div>
    </section>
  );
}
