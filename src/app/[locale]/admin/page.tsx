"use client";

import { useEffect, useState } from "react";
import { useEditor } from "@/components/admin/EditorProvider";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Star,
  StarOff,
  RefreshCw,
} from "lucide-react";

type Property = {
  id: string;
  title: string;
  location: string | null;
  price_czk: number | null;
  size_m2: number | null;
  rooms: string | null;
  type: string | null;
  status: string;
  description: string | null;
  cover_image: string | null;
  gallery: string[];
  featured: boolean;
  sort_order: number;
  slug: string | null;
};

const EMPTY: Property = {
  id: "",
  title: "",
  location: "",
  price_czk: null,
  size_m2: null,
  rooms: "",
  type: "apartment",
  status: "active",
  description: "",
  cover_image: "",
  gallery: [],
  featured: false,
  sort_order: 0,
  slug: null,
};

export default function AdminPage() {
  const { isAdmin, dbConfigured } = useEditor();
  const [items, setItems] = useState<Property[] | null>(null);
  const [editing, setEditing] = useState<Property | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch("/api/properties?all=1").then((r) => r.json());
    setItems(r.data ?? []);
  }

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  async function save() {
    if (!editing) return;
    setBusy(true);
    await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        id: editing.id || undefined,
        price_czk: editing.price_czk ? Number(editing.price_czk) : null,
        size_m2: editing.size_m2 ? Number(editing.size_m2) : null,
        sort_order: Number(editing.sort_order ?? 0),
      }),
    });
    setBusy(false);
    setEditing(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Opravdu smazat tento inzerát?")) return;
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    await load();
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 bg-surface">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-border/50 p-10 text-center">
          <h1 className="text-2xl font-bold text-primary mb-3">Administrace</h1>
          <p className="text-muted text-sm">
            Pro vstup do administrace se přihlas přes ikonu zámku v pravém
            dolním rohu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em]">
              Administrace
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mt-2">
              Inzeráty nemovitostí
            </h1>
            <p className="text-muted text-sm mt-2">
              Inzeráty se zobrazují na hlavní stránce a v sekci „Chci koupit".
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-white border border-border hover:border-accent text-primary rounded transition"
            >
              <RefreshCw className="w-4 h-4" />
              Obnovit
            </button>
            <button
              onClick={() =>
                setEditing({ ...EMPTY, sort_order: (items?.length ?? 0) + 1 })
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-accent hover:bg-accent-dark text-white rounded transition"
            >
              <Plus className="w-4 h-4" />
              Nový inzerát
            </button>
          </div>
        </header>

        {!dbConfigured && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <strong>Pozor:</strong> proměnná <code>DATABASE_URL</code> není
            nastavená. Inzeráty se nedají uložit, dokud se DB nepřipojí.
          </div>
        )}

        {/* Tabulka */}
        <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Pořadí</th>
                  <th className="px-4 py-3 text-left">Foto</th>
                  <th className="px-4 py-3 text-left">Název</th>
                  <th className="px-4 py-3 text-left">Lokalita</th>
                  <th className="px-4 py-3 text-right">Cena</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Top</th>
                  <th className="px-4 py-3 text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items === null ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-muted"
                    >
                      Načítám…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-muted"
                    >
                      Zatím nejsou žádné inzeráty. Vytvoř první kliknutím na
                      „Nový inzerát".
                    </td>
                  </tr>
                ) : (
                  items.map((p) => (
                    <tr key={p.id} className="hover:bg-surface/50">
                      <td className="px-4 py-3 text-sm text-muted">
                        {p.sort_order}
                      </td>
                      <td className="px-4 py-3">
                        {p.cover_image ? (
                          <img
                            src={p.cover_image}
                            alt=""
                            className="w-14 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-primary max-w-xs">
                        {p.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {p.location ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-primary text-right">
                        {p.price_czk
                          ? new Intl.NumberFormat("cs-CZ").format(
                              p.price_czk,
                            ) + " Kč"
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-primary">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.featured ? (
                          <Star className="w-4 h-4 text-accent inline" />
                        ) : (
                          <StarOff className="w-4 h-4 text-gray-300 inline" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => setEditing(p)}
                            className="p-2 rounded hover:bg-accent/10 text-primary"
                            title="Upravit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => remove(p.id)}
                            className="p-2 rounded hover:bg-red-50 text-red-600"
                            title="Smazat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Editor modal */}
      {editing && (
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center p-6 overflow-y-auto"
          onClick={() => !busy && setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-primary">
                {editing.id ? "Upravit inzerát" : "Nový inzerát"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="p-2 hover:bg-surface rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Název *" full>
                <input
                  className="hr-input"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                />
              </Field>
              <Field label="Lokalita">
                <input
                  className="hr-input"
                  value={editing.location ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, location: e.target.value })
                  }
                />
              </Field>
              <Field label="Dispozice (např. 3+kk)">
                <input
                  className="hr-input"
                  value={editing.rooms ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, rooms: e.target.value })
                  }
                />
              </Field>
              <Field label="Plocha (m²)">
                <input
                  type="number"
                  className="hr-input"
                  value={editing.size_m2 ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      size_m2: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </Field>
              <Field label="Cena (Kč)">
                <input
                  type="number"
                  className="hr-input"
                  value={editing.price_czk ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      price_czk: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </Field>
              <Field label="Typ">
                <select
                  className="hr-input"
                  value={editing.type ?? "apartment"}
                  onChange={(e) =>
                    setEditing({ ...editing, type: e.target.value })
                  }
                >
                  <option value="apartment">Byt</option>
                  <option value="house">Dům</option>
                  <option value="commercial">Komerční prostor</option>
                  <option value="land">Pozemek</option>
                </select>
              </Field>
              <Field label="Status">
                <select
                  className="hr-input"
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value })
                  }
                >
                  <option value="active">Aktivní (k prodeji)</option>
                  <option value="reserved">Rezervováno</option>
                  <option value="sold">Prodáno</option>
                  <option value="hidden">Skrytý</option>
                </select>
              </Field>
              <Field label="Pořadí (menší = výše)">
                <input
                  type="number"
                  className="hr-input"
                  value={editing.sort_order}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      sort_order: Number(e.target.value),
                    })
                  }
                />
              </Field>
              <Field label="URL hlavní fotky" full>
                <input
                  className="hr-input"
                  value={editing.cover_image ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, cover_image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                />
                {editing.cover_image && (
                  <img
                    src={editing.cover_image}
                    alt=""
                    className="mt-2 w-full max-w-xs aspect-[4/3] object-cover rounded-lg border border-border"
                  />
                )}
              </Field>
              <Field label="Popis" full>
                <textarea
                  rows={4}
                  className="hr-input"
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </Field>
              <Field label="" full>
                <label className="inline-flex items-center gap-2 text-sm text-primary">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) =>
                      setEditing({ ...editing, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-accent"
                  />
                  Doporučujeme (zobrazí badge)
                </label>
              </Field>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-surface">
              <button
                onClick={() => setEditing(null)}
                disabled={busy}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Zrušit
              </button>
              <button
                onClick={save}
                disabled={busy || !editing.title}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-accent hover:bg-accent-dark disabled:opacity-50 text-white rounded transition"
              >
                <Save className="w-4 h-4" />
                {busy ? "Ukládám…" : "Uložit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .hr-input {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-primary);
          background: white;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .hr-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(200, 169, 126, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      {label && (
        <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
