import { useEffect, useState } from "react";
import { Sparkles, AlertTriangle, Info, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

type AdviceItem = {
  title: string;
  description: string;
  type: "warning" | "info";
};

export const ReportsPage = () => {
  const { user } = useAuth();

  const [advice, setAdvice] = useState<AdviceItem[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const [note, setNote] = useState("");
  const [generatedDesc, setGeneratedDesc] = useState("");
  const [loadingDesc, setLoadingDesc] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAdvice = async () => {
      try {
        setLoadingAdvice(true);

        const res = await fetch(
          `https://neto.runasp.net/api/Ai/financial-advice/${user.id}`,
        );

        const data = await res.json();
        const parsed = JSON.parse(data.advice);

        setAdvice(parsed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAdvice(false);
      }
    };

    fetchAdvice();
  }, [user]);

  const handleGenerate = async () => {
    if (!note.trim()) return;

    try {
      setLoadingDesc(true);
      setGeneratedDesc("");

      const res = await fetch(
        "https://neto.runasp.net/api/Ai/generate-invoice-desc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note }),
        },
      );

      const data = await res.json();
      setGeneratedDesc(data.description);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDesc(false);
    }
  };

  return (
    <section className="space-y-8 animate-[fadeIn_.35s_ease]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            AI Reports
          </h2>
          <p className="text-lg text-slate-500 mt-2">
            Intelligent insights crafted for your financial growth
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-emerald-400/10 backdrop-blur">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm text-primary font-medium">AI Powered</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.section
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-panel-border bg-white/80 backdrop-blur-xl p-6 shadow-lg flex flex-col"
        >
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="text-primary" />
            <h3 className="text-3xl font-semibold">Financial Insights</h3>
          </div>

          {loadingAdvice ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 animate-pulse">
              Thinking...
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[500px]">
              {advice.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl p-4 border shadow-sm transition ${
                    item.type === "warning"
                      ? "bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200"
                      : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.type === "warning" ? (
                      <AlertTriangle className="text-rose-600" size={18} />
                    ) : (
                      <Info className="text-blue-600" size={18} />
                    )}
                    <p className="font-semibold text-slate-800">{item.title}</p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-panel-border bg-white/80 backdrop-blur-xl p-6 shadow-lg flex flex-col"
        >
          <div className="flex items-center gap-2 mb-5">
            <Wand2 className="text-primary" />
            <h3 className="text-3xl font-semibold">AI Description Generator</h3>
          </div>

          <textarea
            placeholder="Describe the work..."
            className="w-full rounded-xl border border-panel-border p-4 mb-4 focus:ring-2 focus:ring-primary outline-none transition"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleGenerate}
            disabled={loadingDesc}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emerald-400 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            <Sparkles size={16} />
            {loadingDesc ? "Generating..." : "Generate"}
          </motion.button>

          <div className="mt-6 flex-1">
            {generatedDesc ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-surface-bg p-4 border border-panel-border shadow-inner"
              >
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {generatedDesc}
                </p>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 text-sm">
                AI output will appear here ✨
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </section>
  );
};
