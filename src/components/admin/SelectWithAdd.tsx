"use client";

import { useState } from "react";
import { Plus, Loader2, Check, X as XIcon } from "lucide-react";

type Option = {
  id: string;
  kind: string;
  value: string;
  label: string;
  color: string | null;
  sort_order: number;
};

/**
 * Dropdown s možností přidat vlastní hodnotu, která se okamžitě uloží
 * do tabulky property_options přes /api/options a propíše do listu.
 */
export default function SelectWithAdd({
  kind,
  options,
  value,
  onChange,
  onOptionsChanged,
  placeholder = "— vyber —",
  className = "",
  allowEmpty = true,
  withColor = false,
}: {
  kind: string;
  options: Option[];
  value: string | null;
  onChange: (v: string) => void;
  /** Volá se po přidání nové hodnoty – rodič refreshne list options. */
  onOptionsChanged: () => void | Promise<void>;
  placeholder?: string;
  className?: string;
  allowEmpty?: boolean;
  withColor?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#c8a97e");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function slugify(s: string): string {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  async function add() {
    const label = newLabel.trim();
    if (!label) return;
    const value = slugify(label);
    if (!value) {
      setErr("Hodnota musí obsahovat aspoň jedno písmeno nebo číslici.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          value,
          label,
          color: withColor ? newColor : null,
          sort_order: options.filter((o) => o.kind === kind).length + 1,
        }),
      });
      if (r.status === 401) {
        setErr("Vypršela admin session. Přihlaš se znovu.");
        return;
      }
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(j.error ?? `Přidání selhalo (HTTP ${r.status})`);
        return;
      }
      await onOptionsChanged();
      onChange(value);
      setNewLabel("");
      setAdding(false);
    } catch (e) {
      setErr((e as Error).message ?? "Síťová chyba.");
    } finally {
      setBusy(false);
    }
  }

  const items = options
    .filter((o) => o.kind === kind)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (adding) {
    return (
      <div className={"space-y-2 " + className}>
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
              if (e.key === "Escape") {
                setAdding(false);
                setNewLabel("");
                setErr(null);
              }
            }}
            placeholder="Nová hodnota…"
            className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#c8a97e] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a97e]/30"
            disabled={busy}
          />
          {withColor && (
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-12 h-[42px] rounded-md border border-border cursor-pointer"
              disabled={busy}
              title="Barva"
            />
          )}
          <button
            type="button"
            onClick={add}
            disabled={busy || !newLabel.trim()}
            className="inline-flex items-center justify-center px-3 bg-[#c8a97e] hover:bg-[#b89569] disabled:opacity-50 text-white rounded-md"
            title="Uložit"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setNewLabel("");
              setErr(null);
            }}
            disabled={busy}
            className="inline-flex items-center justify-center px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md"
            title="Zrušit"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        {err && <div className="text-xs text-red-600">{err}</div>}
      </div>
    );
  }

  return (
    <div className={"flex gap-2 " + className}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a97e]/30"
      >
        {allowEmpty && <option value="">{placeholder}</option>}
        {items.map((o) => (
          <option key={o.id} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-dashed border-[#c8a97e] text-[#c8a97e] hover:bg-[#c8a97e]/5 rounded-md whitespace-nowrap"
        title="Přidat vlastní hodnotu"
      >
        <Plus className="w-3.5 h-3.5" />
        Vlastní
      </button>
    </div>
  );
}
