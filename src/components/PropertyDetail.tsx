"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  ZoomIn,
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

/** Hook — touch swipe, vrací { onTouchStart, onTouchEnd } */
function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef<number | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      startX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (startX.current === null) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      if (Math.abs(dx) > 40) dx < 0 ? onLeft() : onRight();
      startX.current = null;
    },
  };
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

  // Index aktivní fotky v karuselu
  const [current, setCurrent] = useState(0);
  // Index pro lightbox (null = zavřeno)
  const [lightbox, setLightbox] = useState<number | null>(null);

  const statusOpt = allOptions.find((o) => o.kind === "status" && o.value === p.status);
  const typeOpt = allOptions.find((o) => o.kind === "type" && o.value === p.type);
  const roomsOpt = allOptions.find((o) => o.kind === "rooms" && o.value === p.rooms);

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + allImages.length) % allImages.length),
    [allImages.length],
  );
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % allImages.length),
    [allImages.length],
  );

  const prevLb = useCallback(
    () => setLightbox((i) => (i == null ? 0 : (i - 1 + allImages.length) % allImages.length)),
    [allImages.length],
  );
  const nextLb = useCallback(
    () => setLightbox((i) => (i == null ? 0 : (i + 1) % allImages.length)),
    [allImages.length],
  );

  // Klávesnice v lightboxu
  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prevLb();
      else if (e.key === "ArrowRight") nextLb();
      else if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prevLb, nextLb]);

  const carouselSwipe = useSwipe(next, prev);
  const lightboxSwipe = useSwipe(nextLb, prevLb);

  return (
    <div className="min-h-screen bg-surface">
      {/* Back — pt musí přeskočit fixed header (80px) + případný AdminBar (48px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32">
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
          <div className="lg:col-span-2 space-y-4">

            {/* ── KARUSEL ── */}
            <FadeIn>
              <div
                className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 select-none"
                {...carouselSwipe}
              >
                {allImages.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={allImages[current]}
                    alt={p.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-16 h-16 text-gray-200" />
                  </div>
                )}

                {/* Status badge */}
                <span
                  className="absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full text-white pointer-events-none"
                  style={{ background: statusOpt?.color ?? "#c8a97e" }}
                >
                  {statusOpt?.label ?? p.status}
                </span>

                {p.featured && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/90 text-primary backdrop-blur pointer-events-none">
                    Doporučujeme
                  </span>
                )}

                {/* Šipky karuselu */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
                      aria-label="Předchozí"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
                      aria-label="Další"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Counter + zoom */}
                {allImages.length > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {allImages.length > 1 && (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-black/60 text-white rounded-full backdrop-blur">
                        {current + 1} / {allImages.length}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setLightbox(current)}
                      className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
                      aria-label="Zvětšit"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Dots indikátor (jen pokud není moc fotek) */}
                {allImages.length > 1 && allImages.length <= 10 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
                    {allImages.map((_, i) => (
                      <span
                        key={i}
                        className={`block w-1.5 h-1.5 rounded-full transition-all ${
                          i === current ? "bg-white scale-125" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Thumbnaily */}
            {allImages.length > 1 && (
              <FadeIn delay={0.08}>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {allImages.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrent(i)}
                      className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition ring-2 ${
                        i === current
                          ? "ring-[#c8a97e] opacity-100"
                          : "ring-transparent opacity-60 hover:opacity-100"
                      }`}
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
              <FadeIn delay={0.12}>
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

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/96 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          {...lightboxSwipe}
        >
          {/* Zavřít */}
          <button
            type="button"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
            onClick={() => setLightbox(null)}
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {allImages.length > 1 && (
            <button
              type="button"
              className="absolute left-3 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
              onClick={(e) => { e.stopPropagation(); prevLb(); }}
              aria-label="Předchozí"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Obrázek */}
          <div
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={lightbox}
              src={allImages[lightbox]}
              alt=""
              className="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Next */}
          {allImages.length > 1 && (
            <button
              type="button"
              className="absolute right-3 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
              onClick={(e) => { e.stopPropagation(); nextLb(); }}
              aria-label="Další"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Counter + thumbs */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 pb-5">
            <span className="text-white/60 text-sm">
              {lightbox + 1} / {allImages.length}
            </span>
            {allImages.length > 1 && allImages.length <= 12 && (
              <div className="flex gap-1.5 overflow-x-auto max-w-[90vw] px-4">
                {allImages.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                    className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden transition ring-2 ${
                      i === lightbox ? "ring-[#c8a97e] opacity-100" : "ring-transparent opacity-40 hover:opacity-80"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
