import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "N";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex items-center justify-between border-b border-panel-border bg-white px-6 py-3"
    >
      {/* LEFT: LOGO */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="flex cursor-pointer items-center gap-2"
      >
        <img
          src="/favicon.svg"
          alt="Neto logo"
          className="h-8 w-8 object-contain"
        />
        <span className="text-lg font-semibold text-slate-800">Neto</span>
      </motion.div>

      {/* RIGHT: USER */}
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-slate-800">
            {user?.name ?? "User"}
          </p>
          <p className="text-xs text-slate-500">
            {user?.email ?? "user@email.com"}
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.08 }}
          className="flex h-10 w-10 items-center justify-center rounded-full 
                     bg-gradient-to-br from-primary to-emerald-500 
                     text-white font-semibold shadow-md"
        >
          {initials}
        </motion.div>
      </div>
    </motion.header>
  );
};