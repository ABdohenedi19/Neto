import { Download, Play } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useFinance } from "../context/FinanceContext";

const toApiDate = (date: string) => `${date}T00:00:00Z`;

export const InvoiceGeneratorPage = () => {
  const { user } = useAuth();
  const { createProjectInvoice, projects } = useFinance();
  const invoicePreviewRef = useRef<HTMLElement | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [createdInvoiceNumber, setCreatedInvoiceNumber] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectHasInvoice, setProjectHasInvoice] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [createError, setCreateError] = useState("");
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const dueDateIso = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const [form, setForm] = useState({
    clientName: "Acme Corp",
    invoiceDate: todayIso,
    dueDate: dueDateIso,
    reference: "Q3 Marketing Campaign",
    description: "Brand Identity Design",
    qty: 1,
    rate: 3500,
    notes:
      "Thank you for your business. Please process payment within 30 days.",
  });

  const total = useMemo(() => form.qty * form.rate, [form.qty, form.rate]);
  const invoiceId = useMemo(
    () =>
      `INV-${new Date(form.invoiceDate).getFullYear()}-04${String(form.qty).padStart(2, "0")}`,
    [form.invoiceDate, form.qty],
  );
  const visibleInvoiceId = createdInvoiceNumber || invoiceId;

  const updateForm = (next: Partial<typeof form>) => {
    setCreatedInvoiceNumber("");
    setCreateMessage("");
    setCreateError("");
    setForm((prev) => ({ ...prev, ...next }));
  };

  const handleDownloadPdf = async () => {
    if (!invoicePreviewRef.current) return;
    try {
      setIsDownloadingPdf(true);
      const canvas = await html2canvas(invoicePreviewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const imageWidth = pageWidth - 20;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      pdf.addImage(imageData, "PNG", 10, 10, imageWidth, imageHeight);
      pdf.save(`${visibleInvoiceId}.pdf`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };
  const checkProjectInvoiceExists = async (projectId: string) => {
    if (!user) return false;

    const res = await fetch(
      `https://neto.runasp.net/api/Invoice/${user.id}/project/${projectId}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      },
    );

    if (res.status === 200) return true;
    if (res.status === 404) return false;

    return false;
  };
  const handleCreateInvoice = async () => {
    const clientName = form.clientName.trim();
    const projectName = form.reference.trim();
    const description = form.description.trim();

    if (!clientName || !projectName || !description || total <= 0) {
      setCreateError(
        "Add a client, project reference, description, and amount before creating the invoice.",
      );
      return;
    }

    const existingProject = projects.find(
      (p) => p.name.toLowerCase() === projectName.toLowerCase(),
    );

    if (!existingProject) {
      setCreateError("This project does not exist. Please create it first.");
      return;
    }

    try {
      setIsCreatingInvoice(true);
      setCreateError("");

      const invoice = await createProjectInvoice(existingProject.id, {
        clientName,
        description,
        amount: total,
        dueDate: toApiDate(form.dueDate),
      });

      if (invoice?.invoiceNumber) {
        setCreatedInvoiceNumber(invoice.invoiceNumber);
        setCreateMessage(
          `${invoice.invoiceNumber} created and linked to project.`,
        );
      } else {
        setCreateMessage("Invoice created successfully.");
      }
    } catch {
      setCreateError(
        "Could not create the invoice. Please check the backend connection.",
      );
    } finally {
      setIsCreatingInvoice(false);
    }
  };
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-panel-border bg-white p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Live Preview
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-2 rounded-lg border border-panel-border px-4 py-2 text-sm text-slate-700 disabled:opacity-50"
          >
            <Download size={16} />
            {isDownloadingPdf ? "Downloading..." : "Download PDF"}
          </button>
          <button
            onClick={handleCreateInvoice}
            disabled={
              isCreatingInvoice || !selectedProjectId || projectHasInvoice
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            <Play size={14} />
            {isCreatingInvoice ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-panel-border bg-white p-6">
          <h2 className="text-4xl font-semibold text-slate-900">
            Create Invoice
          </h2>
          <p className="text-slate-600">Draft a new invoice for your client.</p>

          <label className="block space-y-2 text-sm">
            <span>Client Name</span>
            <input
              className="w-full rounded-xl border border-panel-border px-4 py-3"
              value={form.clientName}
              onChange={(event) =>
                updateForm({ clientName: event.target.value })
              }
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-2 text-sm">
              <span>Invoice Date</span>
              <input
                type="date"
                className="w-full rounded-xl border border-panel-border px-4 py-3"
                value={form.invoiceDate}
                onChange={(event) =>
                  updateForm({ invoiceDate: event.target.value })
                }
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Due Date</span>
              <input
                type="date"
                className="w-full rounded-xl border border-panel-border px-4 py-3"
                value={form.dueDate}
                onChange={(event) =>
                  updateForm({ dueDate: event.target.value })
                }
              />
            </label>
          </div>
          <label className="block space-y-2 text-sm">
            <span>Project Reference</span>

            <select
              value={selectedProjectId}
              onChange={async (e) => {
                const projectId = e.target.value;

                setSelectedProjectId(projectId);

                const project = projects.find((p) => p.id === projectId);
                if (!project) return;

                updateForm({
                  reference: project.name,
                  clientName: project.clientName ?? "",
                  qty: 1,
                });

                const exists = await checkProjectInvoiceExists(projectId);
                setProjectHasInvoice(exists);
              }}
              className="w-full rounded-xl border border-panel-border px-4 py-3"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2 text-sm">
            <span>Description</span>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-panel-border px-4 py-3"
              value={form.description}
              onChange={(event) =>
                updateForm({ description: event.target.value })
              }
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-2 text-sm">
              <span>Qty/Hrs</span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-panel-border px-4 py-3"
                value={form.qty}
                onChange={(event) =>
                  updateForm({ qty: Number(event.target.value) })
                }
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Rate</span>
              <input
                type="number"
                className="w-full rounded-xl border border-panel-border px-4 py-3"
                value={form.rate}
                onChange={(event) =>
                  updateForm({ rate: Number(event.target.value) })
                }
              />
            </label>
          </div>
          {createMessage && (
            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {createMessage}
            </p>
          )}
          {createError && (
            <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {createError}
            </p>
          )}
        </div>

        <article
          ref={invoicePreviewRef}
          className="rounded-2xl border border-panel-border bg-white p-8"
        >
          <div className="mb-8 flex items-start justify-between border-b border-panel-border pb-6">
            <div>
              <h3 className="text-4xl font-bold">Neto</h3>
              <p className="text-slate-500">{user?.name ?? "Freelancer"}</p>
              <p className="text-slate-500">
                {user?.email ?? "hello@neto.com"}
              </p>
            </div>
            <div className="text-right text-slate-500">
              <p className="text-2xl font-semibold text-slate-800">INVOICE</p>
              <p>{visibleInvoiceId}</p>
              <p>Date: {form.invoiceDate}</p>
              <p>Due: {form.dueDate}</p>
            </div>
          </div>
          <div className="mb-5 rounded-lg bg-surface-bg p-3 text-sm text-slate-700">
            <p>
              <span className="font-medium">Created by:</span>{" "}
              {user?.name ?? "Freelancer"}
            </p>
            <p>
              <span className="font-medium">Creator email:</span>{" "}
              {user?.email ?? "hello@neto.com"}
            </p>
          </div>
          <p className="mb-4 text-slate-500">Bill To</p>
          <p className="text-2xl font-semibold">{form.clientName}</p>
          <div className="mt-8 border-y border-panel-border py-4">
            <div className="grid grid-cols-4 text-sm text-slate-500">
              <span>Description</span>
              <span>Qty</span>
              <span>Rate</span>
              <span className="text-right">Amount</span>
            </div>
            <div className="mt-3 grid grid-cols-4 text-sm">
              <span>{form.description}</span>
              <span>{form.qty}</span>
              <span>${form.rate.toLocaleString()}</span>
              <span className="text-right font-semibold">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-right">
            <p>Subtotal: ${total.toLocaleString()}</p>
            <p>Tax (0%): $0.00</p>
            <p className="text-2xl font-semibold">
              Total ${total.toLocaleString()}
            </p>
          </div>
          <p className="mt-8 rounded-xl bg-surface-bg p-4 text-sm text-slate-600">
            {form.notes}
          </p>
        </article>
      </div>
    </section>
  );
};
