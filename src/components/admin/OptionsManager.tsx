"use client";

import { useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";

type Option = {
  id: string;
  kind: string;
  value: string;
  label: string;
  color: string | null;
  sort_order: number;
};

const KINDS: { value: string; label: string; hint: string }[] = [
  { value: "type", label: "Typy nemovitostí", hint: "Byt, Dům, Komerční prostor…" },
  { value: "rooms", label: "Dispozice", hint: "1+kk, 2+1, 3+kk, 4+1…" },
  { value: "status", label: "Stavy", hint: "K prodeji, Rezervováno, Prodáno…" },
];

export default function OptionsManager({
  options,
  onClose,
  onChanged,
}: {
  options: Option[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [activeKind, setActiveKind] = useState<string>("type");
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#c8a97e");
  const [saving, setSaving] = useState(false);

  const list = options
    .filter((o) => o.kind === activeKind)
    .sort((a, b) => a.sort_order - b.sort_order);

  function slugify(s: string): string {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  async function add() {
    if (!newLabel.trim()) return;
    setSaving(true);
    await fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: activeKind,
        value: slugify(newLabel),
        label: newLabel.trim(),
        color: activeKind === "status" ? newColor : null,
        sort_order: list.length + 1,
      }),
    });
    setSaving(false);
    setNewLabel("");
    onChanged();
  }

  async function update(o: Option, patch: Partial<Option>) {
    await fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...o, ...patch }),
    });
    onChanged();
  }

  async function remove(o: Option) {
    if (!confirm(`Smazat "${o.label}"? Inzeráty s touto hodnotou ji ztratí.`)) return;
    await fetch(`/api/options?id=${o.id}`, { method: "DELETE" });
    onChanged();
  }

  return (
    <div
      className="hr-editor-panel fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#c8a97e]">
            Kategorie & stavy
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="flex gap-2 border-b border-border/50">
            {KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() => setActiveKind(k.value)}
                className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 ${
                  activeKind === k.value
                    ? "border-[#c8a97e] text-primary"
                    : "border-transparent text-gray-500 hover:text-primary"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">
            {KINDS.find((k) => k.value === activeKind)?.hint}
          </p>
        </div>

        <div className="p-6 space-y-2 max-h-[55vh] overflow-y-auto">
          {list.length === 0 && (
            <div className="text-center py-8 text-sm text-muted">
              Zatím tu nic není. Přidej první níže.
            </div>
          )}
          {list.map((o) => (
            <div
              key={o.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {activeKind === "status" && (
                <input
                  type="color"
                  value={o.color ?? "#1a1a1a"}
                  onChange={(e) => update(o, { color: e.target.value })}
                  className="w-9 h-9 rounded border border-gray-300 cursor-pointer shrink-0"
                />
              )}
              <input
                type="text"
                value={o.label}
                onChange={(e) => update(o, { label: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#c8a97e]"
              />
              <code className="text-xs text-gray-400 font-mono shrink-0">
                {o.value}
              </code>
              <button
                type="button"
                onClick={() => remove(o)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-border/50 bg-surface">
          <div className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Přidat nový
          </div>
          <div className="flex gap-2">
            {activeKind === "status" && (
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-11 h-10 rounded border border-gray-300 cursor-pointer"
              />
            )}
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder={activeKind === "type" ? "Např. Chata" : "Např. Zlevněno"}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#c8a97e]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
            />
            <button
              type="button"
              onClick={add}
              disabled={saving || !newLabel.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a97e] hover:bg-[#b89569] disabled:opacity-50 text-white rounded transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Přidat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
