"use client";

import { useState } from "react";
import {
  X,
  Save,
  Eye,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import EditableImage from "./EditableImage";
import SelectWithAdd from "./SelectWithAdd";

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

type Option = {
  id: string;
  kind: string;
  value: string;
  label: string;
  color: string | null;
  sort_order: number;
};

export default function PropertyEditor({
  property,
  types,
  statuses,
  rooms,
  allOptions,
  onClose,
  onSaved,
  onOptionsChanged,
}: {
  property: Property;
  types: Option[];
  statuses: Option[];
  rooms: Option[];
  allOptions: Option[];
  onClose: () => void;
  onSaved: () => void;
  onOptionsChanged: () => void | Promise<void>;
}) {
  const [p, setP] = useState<Property>(property);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [preview, setPreview] = useState(false);
  const [newImg, setNewImg] = useState("");

  function update<K extends keyof Property>(k: K, v: Property[K]) {
    setP((prev) => ({ ...prev, [k]: v }));
  }

  function addGalleryUrl() {
    const url = newImg.trim();
    if (!url) return;
    update("gallery", [...p.gallery, url]);
    setNewImg("");
  }

  function removeGallery(i: number) {
    update(
      "gallery",
      p.gallery.filter((_, idx) => idx !== i),
    );
  }

  function moveGallery(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= p.gallery.length) return;
    const next = [...p.gallery];
    [next[i], next[j]] = [next[j], next[i]];
    update("gallery", next);
  }

  async function save() {
    console.log("[PropertyEditor] save() start", { id: p.id, title: p.title });
    setSaveError(null);

    // Validace
    const title = p.title.trim();
    if (!title) {
      setSaveError("Vyplň, prosím, název inzerátu.");
      return;
    }

    // Sanitizace payloadu
    const payload = {
      ...(p.id ? { id: p.id } : {}),
      title,
      location: p.location?.trim() || null,
      price_czk: p.price_czk == null || Number.isNaN(p.price_czk) ? null : Number(p.price_czk),
      size_m2: p.size_m2 == null || Number.isNaN(p.size_m2) ? null : Number(p.size_m2),
      rooms: p.rooms?.trim() || null,
      type: p.type?.trim() || null,
      status: p.status || "active",
      description: p.description?.trim() || null,
      cover_image: p.cover_image?.trim() || null,
      gallery: (p.gallery ?? []).filter((u) => typeof u === "string" && u.trim().length > 0),
      featured: !!p.featured,
      sort_order: Number.isFinite(p.sort_order) ? Number(p.sort_order) : 0,
      slug: p.slug?.trim() || null,
    };
    console.log("[PropertyEditor] payload:", payload);

    setSaving(true);
    try {
      const r = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[PropertyEditor] response status:", r.status);
      if (r.status === 401) {
        setSaveError(
          "Vypršela ti admin session. Klikni na ikonu zámku v patce a přihlaš se znovu.",
        );
        return;
      }
      const j = await r.json().catch(() => ({}));
      console.log("[PropertyEditor] response body:", j);
      if (!r.ok) {
        setSaveError(j.error ?? `Uložení selhalo (HTTP ${r.status})`);
        return;
      }
      console.log("[PropertyEditor] save OK, calling onSaved()");
      // Vizuální potvrzení — i kdyby onSaved žnějaký důvod nezavřel modal,
      // uživatel uvidí že se uložilo.
      setSaveOk(true);
      onSaved();
    } catch (e) {
      console.error("[PropertyEditor] save error:", e);
      setSaveError((e as Error).message ?? "Síťová chyba při ukládání.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="hr-editor-panel fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c8a97e]">
              {p.id ? "Úprava inzerátu" : "Nový inzerát"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {saveError && (
              <span
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 border border-red-400/40 text-red-200 max-w-[280px] truncate"
                title={saveError}
              >
                ⚠ {saveError}
              </span>
            )}
            {saveOk && !saveError && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-200">
                ✓ Uloženo
              </span>
            )}
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              {preview ? "Editor" : "Náhled"}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c8a97e] hover:bg-[#b89569] disabled:opacity-50 text-white transition"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Ukládám…" : "Uložit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        {preview ? (
          <PreviewCard p={p} statuses={statuses} types={types} />
        ) : (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {saveOk && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <span className="font-semibold">✓ Uloženo do databáze.</span>
              </div>
            )}
            {saveError && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                <span className="font-semibold shrink-0">Chyba:</span>
                <span>{saveError}</span>
              </div>
            )}
            {/* Hlavní info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Název *">
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={inputCls}
                  placeholder="Byt 3+kk po rekonstrukci, Praha 7"
                />
              </Field>
              <Field label="Lokalita">
                <input
                  type="text"
                  value={p.location ?? ""}
                  onChange={(e) => update("location", e.target.value)}
                  className={inputCls}
                  placeholder="Praha 7 — Holešovice"
                />
              </Field>
              <Field label="Cena (Kč)">
                <input
                  type="number"
                  value={p.price_czk ?? ""}
                  onChange={(e) =>
                    update("price_czk", e.target.value ? Number(e.target.value) : null)
                  }
                  className={inputCls}
                  placeholder="9890000"
                />
              </Field>
              <Field label="Plocha (m²)">
                <input
                  type="number"
                  value={p.size_m2 ?? ""}
                  onChange={(e) =>
                    update("size_m2", e.target.value ? Number(e.target.value) : null)
                  }
                  className={inputCls}
                  placeholder="78"
                />
              </Field>
              <Field label="Dispozice">
                <SelectWithAdd
                  kind="rooms"
                  options={allOptions}
                  value={p.rooms}
                  onChange={(v) => update("rooms", v || null)}
                  onOptionsChanged={onOptionsChanged}
                  placeholder="— vyber dispozici —"
                />
              </Field>
              <Field label="Typ nemovitosti">
                <SelectWithAdd
                  kind="type"
                  options={allOptions}
                  value={p.type}
                  onChange={(v) => update("type", v || null)}
                  onOptionsChanged={onOptionsChanged}
                  placeholder="— vyber typ —"
                />
              </Field>
              <Field label="Stav">
                <SelectWithAdd
                  kind="status"
                  options={
                    statuses.length === 0
                      ? [
                          { id: "_a", kind: "status", value: "active", label: "Aktivní", color: "#c8a97e", sort_order: 1 },
                          { id: "_r", kind: "status", value: "reserved", label: "Rezervováno", color: "#f59e0b", sort_order: 2 },
                          { id: "_s", kind: "status", value: "sold", label: "Prodáno", color: "#6b7280", sort_order: 3 },
                          { id: "_h", kind: "status", value: "hidden", label: "Skryté", color: "#1a1a1a", sort_order: 4 },
                        ]
                      : allOptions
                  }
                  value={p.status}
                  onChange={(v) => update("status", v || "active")}
                  onOptionsChanged={onOptionsChanged}
                  placeholder="— vyber stav —"
                  allowEmpty={false}
                  withColor
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  type="text"
                  value={p.slug ?? ""}
                  onChange={(e) => update("slug", e.target.value || null)}
                  className={inputCls + " font-mono text-xs"}
                  placeholder="byt-3kk-praha-7"
                />
              </Field>
            </div>

            <Field label="Popis">
              <textarea
                value={p.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
                rows={5}
                className={inputCls + " resize-y"}
                placeholder="Detailní popis nemovitosti…"
              />
            </Field>

            {/* Cover */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Hlavní obrázek
              </label>
              {p.cover_image ? (
                <div className="relative group rounded-lg overflow-hidden border border-border/50 mb-2">
                  <EditableImage
                    src={p.cover_image}
                    className="w-full max-h-72"
                    onChange={(url) => update("cover_image", url)}
                  >
                    <button
                      type="button"
                      onClick={() => update("cover_image", null)}
                      className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 text-xs bg-black/70 hover:bg-black text-white rounded"
                    >
                      <Trash2 className="w-3 h-3" /> Odebrat
                    </button>
                  </EditableImage>
                </div>
              ) : (
                <ImageUploader
                  multiple={false}
                  onUploaded={(urls) => urls[0] && update("cover_image", urls[0])}
                />
              )}
              <details className="mt-2">
                <summary className="text-xs text-muted cursor-pointer hover:text-primary">
                  Nebo vlož URL ručně
                </summary>
                <input
                  type="url"
                  value={p.cover_image ?? ""}
                  onChange={(e) => update("cover_image", e.target.value || null)}
                  className={inputCls + " font-mono text-xs mt-2"}
                  placeholder="https://…"
                />
              </details>
            </div>

            {/* Galerie */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Galerie ({p.gallery.length})
              </label>

              <ImageUploader
                onUploaded={(urls) => update("gallery", [...p.gallery, ...urls])}
                className="mb-3"
              />

              {p.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {p.gallery.map((url, i) => (
                    <div
                      key={i}
                      className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border/50 bg-gray-100"
                    >
                      <EditableImage
                        src={url}
                        className="w-full h-full"
                        onChange={(newUrl) => {
                          const next = [...p.gallery];
                          next[i] = newUrl;
                          update("gallery", next);
                        }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => moveGallery(i, -1)}
                            disabled={i === 0}
                            className="px-2 py-1 text-xs bg-white/90 rounded disabled:opacity-30"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() => moveGallery(i, 1)}
                            disabled={i === p.gallery.length - 1}
                            className="px-2 py-1 text-xs bg-white/90 rounded disabled:opacity-30"
                          >
                            →
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGallery(i)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 rounded text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </EditableImage>
                    </div>
                  ))}
                </div>
              )}

              <details>
                <summary className="text-xs text-muted cursor-pointer hover:text-primary">
                  Nebo vlož URL ručně
                </summary>
                <div className="flex gap-2 mt-2">
                  <input
                    type="url"
                    value={newImg}
                    onChange={(e) => setNewImg(e.target.value)}
                    className={inputCls + " flex-1 font-mono text-xs"}
                    placeholder="https://… (URL obrázku)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addGalleryUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addGalleryUrl}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a] text-white rounded hover:bg-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Přidat
                  </button>
                </div>
              </details>
            </div>

            {/* Flags */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.featured}
                  onChange={(e) => update("featured", e.target.checked)}
                  className="accent-[#c8a97e] w-4 h-4"
                />
                <Star className="w-4 h-4 text-[#c8a97e]" />
                <span className="text-sm text-primary">Doporučujeme</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#c8a97e] focus:ring-2 focus:ring-[#c8a97e]/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function PreviewCard({
  p,
  statuses,
  types,
}: {
  p: Property;
  statuses: Option[];
  types: Option[];
}) {
  const status = statuses.find((s) => s.value === p.status);
  const type = types.find((t) => t.value === p.type);

  return (
    <div className="p-8 bg-surface">
      <div className="text-center text-xs text-muted mb-6 uppercase tracking-wider">
        ↓ Takhle inzerát uvidí návštěvník webu ↓
      </div>
      <div className="max-w-md mx-auto">
        <article className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-lg">
          <div className="relative aspect-[4/3] bg-gray-100">
            {p.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.cover_image}
                alt={p.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ImageIcon className="w-12 h-12" />
              </div>
            )}
            {status && (
              <span
                className="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white"
                style={{ background: status.color ?? "#1a1a1a" }}
              >
                {status.label}
              </span>
            )}
            {p.featured && (
              <span className="absolute top-4 right-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-white/90 text-primary backdrop-blur">
                Doporučujeme
              </span>
            )}
          </div>
          <div className="p-6">
            {p.location && (
              <div className="text-xs text-muted mb-2">{p.location}</div>
            )}
            <h3 className="text-lg font-bold text-primary mb-3 leading-snug">
              {p.title || "(bez názvu)"}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted mb-4">
              {type && <span>{type.label}</span>}
              {p.rooms && <span>· {p.rooms}</span>}
              {p.size_m2 && <span>· {p.size_m2} m²</span>}
            </div>
            {p.description && (
              <p className="text-sm text-muted mb-4 line-clamp-3">
                {p.description}
              </p>
            )}
            <div className="pt-4 border-t border-border/50">
              <span className="text-xl font-bold text-primary">
                {p.price_czk
                  ? new Intl.NumberFormat("cs-CZ", {
                      style: "currency",
                      currency: "CZK",
                      maximumFractionDigits: 0,
                    }).format(p.price_czk)
                  : "Cena na vyžádání"}
              </span>
            </div>
          </div>
        </article>

        {p.gallery.length > 0 && (
          <div className="mt-6">
            <div className="text-xs text-muted uppercase tracking-wider mb-2">
              Galerie ({p.gallery.length})
            </div>
            <div className="grid grid-cols-3 gap-2">
              {p.gallery.slice(0, 6).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
