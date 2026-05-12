"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  BedDouble,
  Home,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
} from "lucide-react";
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
  gallery: string[];
  featured: boolean;
  sort_order: number;
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

export default function PropertyDetail({
  property: p,
  allOptions,
  locale,
}: {
  property: Property;
  allOptions: Option[];
  locale: string;
}) {
  const allImages = [
    ...(p.cover_image ? [p.cover_image] : []),
    ...p.gallery.filter((u) => u !== p.cover_image),
  ];

  const [lightbox, setLightbox] = useState<number | null>(null);

  const statusOpt = allOptions.find((o) => o.kind === "status" && o.value === p.status);
  const typeOpt = allOptions.find((o) => o.kind === "type" && o.value === p.type);
  const roomsOpt = allOptions.find((o) => o.kind === "rooms" && o.value === p.rooms);

  function prevImg() {
    setLightbox((i) => (i == null ? 0 : (i - 1 + allImages.length) % allImages.length));
  }
  function nextImg() {
    setLightbox((i) => (i == null ? 0 : (i + 1) % allImages.length));
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href={`/${locale}/chci-koupit`}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na inzeráty
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT — fotky + popis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero foto */}
            <FadeIn>
              <div
                className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
                onClick={() => setLightbox(0)}
              >
                {allImages[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={allImages[0]}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-16 h-16 text-gray-200" />
                  </div>
                )}
                {/* Status badge */}
                <span
                  className="absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full text-white"
                  style={{ background: statusOpt?.color ?? "#c8a97e" }}
                >
                  {statusOpt?.label ?? p.status}
                </span>
                {p.featured && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/90 text-primary backdrop-blur">
                    Doporučujeme
                  </span>
                )}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 text-xs font-semibold bg-black/60 text-white rounded-full backdrop-blur">
                    1 / {allImages.length}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Galerie thumbů */}
            {allImages.length > 1 && (
              <FadeIn delay={0.1}>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {allImages.slice(1).map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightbox(i + 1)}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#c8a97e]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </FadeIn>
            )}

            {/* Popis */}
            {p.description && (
              <FadeIn delay={0.15}>
                <div className="bg-white rounded-2xl border border-border/50 p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-primary mb-4">Popis nemovitosti</h2>
                  <p className="text-muted leading-relaxed whitespace-pre-line">
                    {p.description}
                  </p>
                </div>
              </FadeIn>
            )}
          </div>

          {/* RIGHT — info box */}
          <div className="space-y-5">
            {/* Cena + název */}
            <FadeIn>
              <div className="bg-white rounded-2xl border border-border/50 p-6">
                <h1 className="text-xl sm:text-2xl font-bold text-primary leading-snug mb-2">
                  {p.title}
                </h1>
                {p.location && (
                  <div className="flex items-center gap-1.5 text-sm text-muted mb-5">
                    <MapPin className="w-4 h-4 text-[#c8a97e] shrink-0" />
                    {p.location}
                  </div>
                )}
                <div className="text-3xl font-black text-primary mb-1">
                  {formatCzk(p.price_czk)}
                </div>
                {p.price_czk && p.size_m2 && (
                  <div className="text-sm text-muted">
                    {formatCzk(Math.round(p.price_czk / p.size_m2))} / m²
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Parametry */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl border border-border/50 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
                  Parametry
                </h2>
                <dl className="space-y-3">
                  {(typeOpt || p.type) && (
                    <div className="flex items-center justify-between text-sm">
                      <dt className="flex items-center gap-2 text-muted">
                        <Home className="w-4 h-4" /> Typ
                      </dt>
                      <dd className="font-medium text-primary">
                        {typeOpt?.label ?? p.type}
                      </dd>
                    </div>
                  )}
                  {(roomsOpt || p.rooms) && (
                    <div className="flex items-center justify-between text-sm">
                      <dt className="flex items-center gap-2 text-muted">
                        <BedDouble className="w-4 h-4" /> Dispozice
                      </dt>
                      <dd className="font-medium text-primary">
                        {roomsOpt?.label ?? p.rooms}
                      </dd>
                    </div>
                  )}
                  {p.size_m2 && (
                    <div className="flex items-center justify-between text-sm">
                      <dt className="flex items-center gap-2 text-muted">
                        <Maximize2 className="w-4 h-4" /> Plocha
                      </dt>
                      <dd className="font-medium text-primary">{p.size_m2} m²</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <dt className="flex items-center gap-2 text-muted">
                      <Tag className="w-4 h-4" /> Stav
                    </dt>
                    <dd>
                      <span
                        className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                        style={{ background: statusOpt?.color ?? "#c8a97e" }}
                      >
                        {statusOpt?.label ?? p.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </FadeIn>

            {/* Kontakt */}
            <FadeIn delay={0.15}>
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 text-white">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
                  Máte zájem?
                </h2>
                <p className="text-white/80 text-sm leading-relaxed mb-5">
                  Kontaktujte nás — rádi vám připravíme prohlídku nebo zodpovíme dotazy.
                </p>
                <div className="space-y-2">
                  <Link
                    href="tel:+420000000000"
                    className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition"
                  >
                    <Phone className="w-4 h-4 text-[#c8a97e]" />
                    +420 000 000 000
                  </Link>
                  <Link
                    href="mailto:info@homerenewal.cz"
                    className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition"
                  >
                    <Mail className="w-4 h-4 text-[#c8a97e]" />
                    info@homerenewal.cz
                  </Link>
                </div>
                <Link
                  href={`/${locale}/kontakt`}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#c8a97e] hover:bg-[#b89569] text-white text-sm font-semibold rounded-xl transition"
                >
                  Napsat zprávu
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Zavřít */}
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          {/* Prev */}
          {allImages.length > 1 && (
            <button
              type="button"
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              onClick={(e) => { e.stopPropagation(); prevImg(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[90vh] flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[lightbox]}
              alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
          {/* Next */}
          {allImages.length > 1 && (
            <button
              type="button"
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              onClick={(e) => { e.stopPropagation(); nextImg(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightbox + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
