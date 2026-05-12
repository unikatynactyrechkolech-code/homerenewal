"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useEditor } from "@/components/admin/EditorProvider";
import PropertyEditor from "@/components/admin/PropertyEditor";
import OptionsManager from "@/components/admin/OptionsManager";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  GripVertical,
  Eye,
  Settings2,
  ArrowLeft,
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

type Option = {
  id: string;
  kind: string;
  value: string;
  label: string;
  color: string | null;
  sort_order: number;
};

export default function AdminPage() {
  const { isAdmin } = useEditor();
  const sp = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const [items, setItems] = useState<Property[] | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [editing, setEditing] = useState<Property | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [reordering, setReordering] = useState(false);

  /* Načti */
  const refresh = useCallback(async () => {
    const [p, o] = await Promise.all([
      fetch("/api/properties?all=1").then((r) => r.json()),
      fetch("/api/options").then((r) => r.json()),
    ]);
    setItems(p.data ?? []);
    setOptions(o.data ?? []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /* ?new=1 → otevřít editor pro nový inzerát */
  useEffect(() => {
    if (sp.get("new") === "1" && !editing) {
      setEditing(emptyProperty());
      router.replace(`/${locale}/admin`);
    }
  }, [sp, editing, router, locale]);

  const types = useMemo(() => options.filter((o) => o.kind === "type"), [options]);
  const statuses = useMemo(
    () => options.filter((o) => o.kind === "status"),
    [options],
  );

  /* DnD */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id || !items) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);
    setReordering(true);
    await fetch("/api/properties/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((i) => i.id) }),
    });
    setReordering(false);
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto mb-6 flex items-center justify-center">
            <Settings2 className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-3">
            Přístup pouze pro administrátory
          </h1>
          <p className="text-muted mb-6">
            Klikni na ikonu zámku v pravém dolním rohu webu a přihlaš se.
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět na web
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="text-xs text-muted hover:text-primary inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Zpět na web
            </Link>
            <span className="text-muted">/</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              Správa inzerátů
            </h1>
            {reordering && (
              <span className="text-xs text-amber-600 animate-pulse">
                Ukládám pořadí…
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOptions(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-border text-primary hover:bg-gray-50 rounded-full transition"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Kategorie & stavy
            </button>
            <button
              type="button"
              onClick={() => setEditing(emptyProperty())}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1a1a1a] hover:bg-black text-white rounded-full transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Nový inzerát
            </button>
          </div>
        </div>

        {items === null ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-2xl animate-pulse border border-border/50"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-border/50 rounded-2xl p-12 text-center">
            <p className="text-muted mb-6">Zatím tu nejsou žádné inzeráty.</p>
            <button
              type="button"
              onClick={() => setEditing(emptyProperty())}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-accent hover:bg-accent-dark text-white rounded-full transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Vytvořit první inzerát
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map((p) => (
                  <SortableRow
                    key={p.id}
                    p={p}
                    statuses={statuses}
                    types={types}
                    onEdit={() => setEditing(p)}
                    onDelete={async () => {
                      if (!confirm(`Smazat "${p.title}"?`)) return;
                      await fetch(`/api/properties/${p.id}`, { method: "DELETE" });
                      refresh();
                    }}
                    onToggleFeatured={async () => {
                      await fetch("/api/properties", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...p, featured: !p.featured }),
                      });
                      refresh();
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Editor modal */}
      {editing && (
        <PropertyEditor
          property={editing}
          types={types}
          statuses={statuses}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}

      {/* Options manager */}
      {showOptions && (
        <OptionsManager
          options={options}
          onClose={() => setShowOptions(false)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}

function emptyProperty(): Property {
  return {
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
}

function SortableRow({
  p,
  types,
  statuses,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  p: Property;
  types: Option[];
  statuses: Option[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: p.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const status = statuses.find((s) => s.value === p.status);
  const type = types.find((t) => t.value === p.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white border border-border/50 rounded-2xl flex items-stretch overflow-hidden hover:shadow-md transition"
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="px-2 flex items-center text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        title="Přetáhnout pro změnu pořadí"
        aria-label="Přesunout"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Thumbnail */}
      <div className="w-24 sm:w-32 shrink-0 bg-gray-100">
        {p.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            bez fotky
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-primary truncate">
                {p.title || <span className="text-gray-400">(bez názvu)</span>}
              </h3>
              {p.featured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#c8a97e]/15 text-[#c8a97e]">
                  <Star className="w-3 h-3 fill-current" /> Doporučeno
                </span>
              )}
              {status && (
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                  style={{ background: status.color ?? "#1a1a1a" }}
                >
                  {status.label}
                </span>
              )}
              {type && (
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {type.label}
                </span>
              )}
            </div>
            {p.location && (
              <div className="text-xs text-muted mt-1 truncate">{p.location}</div>
            )}
            <div className="text-sm text-primary mt-2 font-semibold">
              {p.price_czk
                ? new Intl.NumberFormat("cs-CZ", {
                    style: "currency",
                    currency: "CZK",
                    maximumFractionDigits: 0,
                  }).format(p.price_czk)
                : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-2 sm:px-3 border-l border-border/50">
        <button
          type="button"
          onClick={onToggleFeatured}
          className={`p-2 rounded-lg transition ${
            p.featured
              ? "text-[#c8a97e] hover:bg-[#c8a97e]/10"
              : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
          }`}
          title={p.featured ? "Zrušit doporučené" : "Označit jako doporučené"}
        >
          <Star className={`w-4 h-4 ${p.featured ? "fill-current" : ""}`} />
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 transition"
          title="Upravit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Smazat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
