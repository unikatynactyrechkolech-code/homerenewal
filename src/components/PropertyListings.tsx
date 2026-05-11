"use client";

import { useEffect, useState } from "react";
import { Home, MapPin, Maximize2, BedDouble } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";

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
};

function formatCzk(v: number | null): string {
  if (!v) return "Cena na vyžádání";
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(v);
}

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  active: { label: "K prodeji", className: "bg-accent text-white" },
  reserved: { label: "Rezervováno", className: "bg-amber-500 text-white" },
  sold: { label: "Prodáno", className: "bg-gray-500 text-white" },
};

export default function PropertyListings({ limit }: { limit?: number }) {
  const t = useTranslations("listings");
  const [items, setItems] = useState<Property[] | null>(null);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((d) => setItems(d.data ?? []))
      .catch(() => setItems([]));
  }, []);

  if (items === null) {
    return (
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
    );
  }

  if (items.length === 0) {
    return (
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
    );
  }

  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {visible.map((p, i) => {
        const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.active;
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
                className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${s.className}`}
              >
                {s.label}
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
              <h3 className="text-lg font-bold text-primary mb-3 leading-snug line-clamp-2">
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
              <div className="pt-4 border-t border-border/50">
                <span className="text-xl font-bold text-primary">
                  {formatCzk(p.price_czk)}
                </span>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
