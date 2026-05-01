import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("osama");
  const [email, setEmail] = useState("osama@salamhack.com");
  const [password, setPassword] = useState("12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) return;

    try {
      setLoading(true);
      setError("");

      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg px-6 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200 blur-3xl" />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={onSubmit}
        className="relative w-full max-w-md space-y-5 rounded-3xl border border-panel-border bg-white p-10 shadow-xl"
      >
        <div className="flex justify-center">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/favicon.svg"
            alt="logo"
            className="h-12 w-12"
          />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to Neto
          </p>
        </div>

        {/* NAME */}
        <label className="block space-y-2 text-sm">
          <span className="text-slate-600">Full name</span>
          <input
            className="w-full rounded-xl border border-panel-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        {/* EMAIL */}
        <label className="block space-y-2 text-sm">
          <span className="text-slate-600">Email address</span>
          <input
            type="email"
            className="w-full rounded-xl border border-panel-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="text-slate-600">Password</span>
          <input
            type="password"
            className="w-full rounded-xl border border-panel-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 text-center"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 font-medium text-white shadow-md transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </motion.button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Get started free
          </Link>
        </p>
      </motion.form>
    </div>
  );
};