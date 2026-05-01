import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinance } from "../context/FinanceContext";
import type { ProjectResponse } from "../types/finance";

export const ProjectsPage = ({ onClose }: { onClose: () => void }) => {
  const { projects, addProject, updateProject, receiveProject } = useFinance();

  const [form, setForm] = useState({
    name: "",
    clientName: "",
    amount: "",
    date: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) =>
    `${p.name} ${p.clientName}`.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      clientName: form.clientName,
      amount: Number(form.amount),
      date: new Date(form.date).toISOString(),
    };

    if (editingId) {
      await updateProject(editingId, payload);
    } else {
      await addProject(payload);
    }

    setForm({ name: "", clientName: "", amount: "", date: "" });
    setEditingId(null);
  };

  const handleEdit = (p: ProjectResponse) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      clientName: p.clientName,
      amount: String(p.amount),
      date: p.date.slice(0, 10),
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 p-4 border rounded-2xl shadow-sm">
            <input
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded-xl"
            />
            <input
              placeholder="Client Name"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="border p-2 rounded-xl"
            />
            <input
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border p-2 rounded-xl"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border p-2 rounded-xl"
            />

            <button
              onClick={handleSubmit}
              className="col-span-2 mt-2 bg-black text-white py-2 rounded-xl hover:opacity-90 transition"
            >
              {editingId ? "Update Project" : "Add Project"}
            </button>
          </div>

          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full border p-3 rounded-xl"
          />

          <div className="max-h-72 overflow-y-auto space-y-3">
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="border rounded-2xl p-4 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-sm text-gray-500">
                      {p.clientName}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-medium">
                      ${p.amount.toLocaleString()}
                    </p>

                    <button
                      onClick={() => handleEdit(p)}
                      className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      disabled={p.status === "Received"}
                      onClick={() => receiveProject(p.id)}
                      className="text-sm px-3 py-1 rounded-lg bg-green-600 text-white disabled:opacity-50"
                    >
                      {p.status === "Received"
                        ? "Received"
                        : "Mark Received"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};