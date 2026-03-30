"use client";

import { useState, useEffect } from "react";
import { Program, ProgramType, ProgramStatus, DEFAULT_PROGRAMS } from "@/lib/programs";
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, X } from "lucide-react";

const PROGRAM_TYPES: ProgramType[] = ["Residency", "Study Club", "Event"];
const PROGRAM_STATUSES: ProgramStatus[] = ["Open", "Closed", "Waitlist", "Completed"];

const STATUS_COLORS: Record<ProgramStatus, string> = {
  Open: "bg-emerald-100 text-emerald-700",
  Closed: "bg-rose-100 text-rose-700",
  Waitlist: "bg-amber-100 text-amber-700",
  Completed: "bg-gray-100 text-gray-600",
};

const TYPE_COLORS: Record<ProgramType, string> = {
  Residency: "bg-primary/10 text-primary",
  "Study Club": "bg-secondary/10 text-secondary",
  Event: "bg-accent/10 text-accent",
};

const EMPTY_FORM: Omit<Program, "id"> = {
  title: "",
  type: "Study Club",
  startDate: "",
  endDate: "",
  duration: "",
  capacity: "Limited seats",
  location: "",
  status: "Open",
  description: "",
  price: "",
  ceCredits: "",
  moduleDates: [],
  timelineDates: "",
  isVisible: true,
};

function generateId() {
  return `program-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ProgramsManagementTab() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<Program, "id">>(EMPTY_FORM);
  const [moduleDatesInput, setModuleDatesInput] = useState("");

  useEffect(() => {
    fetch("/api/admin/programs", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setPrograms(Array.isArray(data.programs) ? data.programs : DEFAULT_PROGRAMS);
      })
      .catch(() => setPrograms(DEFAULT_PROGRAMS))
      .finally(() => setLoading(false));
  }, []);

  const showMessage = (text: string, ok: boolean) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 4000);
  };

  const saveAll = async (updated: Program[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ programs: updated }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      setPrograms(updated);
      showMessage("Programs saved successfully!", true);
    } catch (err: unknown) {
      showMessage(err instanceof Error ? err.message : "Failed to save programs", false);
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModuleDatesInput("");
    setEditingId(null);
    setIsAdding(true);
  };

  const openEdit = (program: Program) => {
    setForm({ ...program });
    setModuleDatesInput((program.moduleDates ?? []).join("\n"));
    setEditingId(program.id);
    setIsAdding(false);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModuleDatesInput("");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const moduleDates = moduleDatesInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const programData: Program = {
      ...form,
      id: editingId ?? generateId(),
      moduleDates: moduleDates.length > 0 ? moduleDates : undefined,
      endDate: form.endDate || undefined,
      price: form.price || undefined,
      ceCredits: form.ceCredits || undefined,
      timelineDates: form.timelineDates || undefined,
    };

    let updated: Program[];
    if (editingId) {
      updated = programs.map((p) => (p.id === editingId ? programData : p));
    } else {
      updated = [...programs, programData];
    }

    await saveAll(updated);
    closeForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this program? This cannot be undone.")) return;
    await saveAll(programs.filter((p) => p.id !== id));
  };

  const toggleVisibility = async (id: string) => {
    await saveAll(programs.map((p) => (p.id === id ? { ...p, isVisible: !p.isVisible } : p)));
  };

  const cycleStatus = async (id: string) => {
    const current = programs.find((p) => p.id === id)!;
    const next: ProgramStatus =
      current.status === "Open"
        ? "Waitlist"
        : current.status === "Waitlist"
        ? "Closed"
        : current.status === "Closed"
        ? "Completed"
        : "Open";
    await saveAll(programs.map((p) => (p.id === id ? { ...p, status: next } : p)));
  };

  const moveUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...programs];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    await saveAll(updated);
  };

  const moveDown = async (idx: number) => {
    if (idx === programs.length - 1) return;
    const updated = [...programs];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    await saveAll(updated);
  };

  const isFormOpen = isAdding || editingId !== null;

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium ${
            message.ok
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add / Edit Form */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-secondary-200 shadow-soft p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-900">
              {editingId ? "Edit Program" : "Add New Program"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="p-2 rounded-lg hover:bg-secondary-50 text-secondary-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Type *</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  {PROGRAM_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Status *</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  {PROGRAM_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Start Date *</label>
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. June 14, 2026"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">End Date</label>
                <input
                  name="endDate"
                  value={form.endDate ?? ""}
                  onChange={handleFormChange}
                  placeholder="e.g. July 12, 2026"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Duration *</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. 1 day (8:00 AM – 5:00 PM)"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Capacity *</label>
                <input
                  name="capacity"
                  value={form.capacity}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Limited seats"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Coquitlam City Dentist"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Price</label>
                <input
                  name="price"
                  value={form.price ?? ""}
                  onChange={handleFormChange}
                  placeholder="e.g. $4,999 CAD"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">CE Credits</label>
                <input
                  name="ceCredits"
                  value={form.ceCredits ?? ""}
                  onChange={handleFormChange}
                  placeholder="e.g. 36 CE Credits"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Timeline Dates <span className="text-secondary-400 font-normal">(displayed in calendar)</span>
                </label>
                <input
                  name="timelineDates"
                  value={form.timelineDates ?? ""}
                  onChange={handleFormChange}
                  placeholder="e.g. April 11 – July 12, 2026"
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="isVisible"
                  name="isVisible"
                  checked={form.isVisible}
                  onChange={handleFormChange}
                  className="w-4 h-4 rounded border-secondary-300 text-primary-600"
                />
                <label htmlFor="isVisible" className="text-sm font-medium text-secondary-700">
                  Visible on schedule page
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Module Dates{" "}
                  <span className="text-secondary-400 font-normal">
                    (one per line: Residency module dates or Study Club session dates)
                  </span>
                </label>
                <textarea
                  value={moduleDatesInput}
                  onChange={(e) => setModuleDatesInput(e.target.value)}
                  rows={4}
                  placeholder={"Module 1: April 11-12, 2026\nModule 2: May 2-3, 2026\n\nFor Study Club, add session dates one per line.\n(Optional) Append \" [completed]\" to mark completed items."}
                  className="w-full border border-secondary-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : editingId ? "Update Program" : "Add Program"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-2.5 text-sm font-semibold border-2 border-secondary-200 text-secondary-600 hover:bg-secondary-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programs List */}
      <div className="bg-white rounded-2xl border border-secondary-200 shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">Programs</h2>
            <p className="text-xs text-secondary-500 mt-0.5">
              {programs.length} program{programs.length !== 1 ? "s" : ""} · drag rows or use arrows to reorder
            </p>
          </div>
          <button
            onClick={openAdd}
            disabled={isFormOpen || saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary-900 text-white rounded-xl hover:bg-secondary-800 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Program
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-secondary-400">
            <svg className="animate-spin h-6 w-6 mx-auto mb-3 text-primary-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading programs…
          </div>
        ) : programs.length === 0 ? (
          <div className="p-12 text-center text-secondary-400">
            <p className="text-lg mb-1">No programs yet.</p>
            <p className="text-sm">Add your first program above.</p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-100">
            {programs.map((program, idx) => (
              <div
                key={program.id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                  !program.isVisible ? "opacity-50" : ""
                } ${editingId === program.id ? "bg-primary-50/40" : "hover:bg-secondary-50/50"}`}
              >
                {/* Order buttons */}
                <div className="flex flex-col gap-0.5 flex-shrink-0 mt-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0 || saving}
                    className="p-1 rounded hover:bg-secondary-100 text-secondary-400 disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === programs.length - 1 || saving}
                    className="p-1 rounded hover:bg-secondary-100 text-secondary-400 disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[program.type]}`}>
                      {program.type}
                    </span>
                    <button
                      onClick={() => cycleStatus(program.id)}
                      disabled={saving}
                      title="Click to cycle status"
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${STATUS_COLORS[program.status]}`}
                    >
                      {program.status}
                    </button>
                    {!program.isVisible && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Hidden
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-secondary-900 text-sm sm:text-base truncate">
                    {program.title}
                  </h3>
                  <p className="text-xs text-secondary-500 mt-0.5">
                    {program.startDate}
                    {program.endDate && program.endDate !== program.startDate
                      ? ` – ${program.endDate}`
                      : ""}
                    {" · "}
                    {program.location}
                    {program.price ? ` · ${program.price}` : ""}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleVisibility(program.id)}
                    disabled={saving}
                    title={program.isVisible ? "Hide from schedule" : "Show on schedule"}
                    className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-400 hover:text-secondary-700 transition-colors disabled:opacity-50"
                  >
                    {program.isVisible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(program)}
                    disabled={saving}
                    className="p-2 rounded-lg hover:bg-primary-50 text-secondary-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    disabled={saving}
                    className="p-2 rounded-lg hover:bg-red-50 text-secondary-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {saving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-xs w-full mx-4 shadow-2xl text-center">
            <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="font-semibold text-secondary-900">Saving programs…</p>
            <p className="text-sm text-secondary-500 mt-1">Publishing to Contentful</p>
          </div>
        </div>
      )}
    </div>
  );
}
