"use client";

import { useEffect, useState } from "react";
import { Home, MapPin, Maximize2, BedDouble, Settings, Plus } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import { useEditor } from "@/components/admin/EditorProvider";

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
  featured: boolean;
  slug: string | null;
};

type Option = {
  kind: string;
  value: string;
  label: string;
  color: string | null;
};

function formatCzk(v: number | null): string {
  if (!v) return "Cena na vyžádání";
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(v);
}

export default function PropertyListings({ limit }: { limit?: number }) {
  const t = useTranslations("listings");
  const locale = useLocale();
  const { isAdmin } = useEditor();
  const [items, setItems] = useState<Property[] | null>(null);
  const [statuses, setStatuses] = useState<Option[]>([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((d) => setItems(d.data ?? []))
      .catch(() => setItems([]));
    fetch("/api/options?kind=status")
      .then((r) => r.json())
      .then((d) => setStatuses(d.data ?? []))
      .catch(() => {});
  }, []);

  if (items === null) {
    return (
      <>
        <AdminInlineBar isAdmin={isAdmin} locale={locale} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border border-border/50 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-gray-100" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <AdminInlineBar isAdmin={isAdmin} locale={locale} />
        <FadeIn>
          <div className="bg-white border border-border/50 rounded-2xl p-12 sm:p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Home className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">
              {t("empty.title")}
            </h3>
            <p className="text-muted max-w-xl mx-auto leading-relaxed">
              {t("empty.description")}
            </p>
          </div>
        </FadeIn>
      </>
    );
  }

  const visible = limit ? items.slice(0, limit) : items;

  return (
    <>
      <AdminInlineBar isAdmin={isAdmin} locale={locale} count={items.length} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {visible.map((p, i) => {
        const s = statuses.find((x) => x.value === p.status);
        const href = `/${locale}/nemovitosti/${p.slug ?? p.id}`;
        return (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="hr-lift group bg-white border border-border/50 rounded-2xl overflow-hidden"
          >
            <Link href={href} className="block">
            <div className="hr-img-zoom relative aspect-[4/3] bg-gray-100">
              {p.cover_image ? (
                <img
                  src={p.cover_image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-10 h-10 text-gray-300" />
                </div>
              )}
              <span
                className="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white"
                style={{ background: s?.color ?? "#c8a97e" }}
              >
                {s?.label ?? p.status}
              </span>
              {p.featured && (
                <span className="absolute top-4 right-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-white/90 text-primary backdrop-blur">
                  Doporučujeme
                </span>
              )}
            </div>
            <div className="p-6">
              {p.location && (
                <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{p.location}</span>
                </div>
              )}
              <h3 className="text-lg font-bold text-primary mb-3 leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                {p.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-muted mb-4">
                {p.rooms && (
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5" />
                    {p.rooms}
                  </span>
                )}
                {p.size_m2 && (
                  <span className="inline-flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    {p.size_m2} m²
                  </span>
                )}
              </div>
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  {formatCzk(p.price_czk)}
                </span>
                <span className="text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition">
                  Detail →
                </span>
              </div>
            </div>
            </Link>
          </motion.article>
        );
      })}
      </div>
    </>
  );
}

function AdminInlineBar({
  isAdmin,
  locale,
  count,
}: {
  isAdmin: boolean;
  locale: string;
  count?: number;
}) {
  if (!isAdmin) return null;
  return (
    <div className="hr-editor-panel mb-8 flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white rounded-2xl border border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#c8a97e]/20 flex items-center justify-center">
          <Home className="w-5 h-5 text-[#c8a97e]" />
        </div>
        <div>
          <div className="text-sm font-semibold">Sekce inzerátů</div>
          <div className="text-xs text-white/50">
            {typeof count === "number"
              ? `${count} inzerát${count === 1 ? "" : count >= 2 && count <= 4 ? "y" : "ů"} v databázi`
              : "Spravuj výpis nemovitostí"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/${locale}/admin?new=1`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c8a97e] hover:bg-[#b89569] text-white transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Nový inzerát
        </Link>
        <Link
          href={`/${locale}/admin`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition"
        >
          <Settings className="w-3.5 h-3.5" />
          Správa inzerátů
        </Link>
      </div>
    </div>
  );
}
