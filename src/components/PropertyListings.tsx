"use client";

import { useTranslations } from "next-intl";
import { MapPin, Maximize2, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const items = [
  {
    key: "item1",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  },
  {
    key: "item2",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
  },
  {
    key: "item3",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
  },
] as const;

export default function PropertyListings() {
  const t = useTranslations("listings");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <FadeIn key={item.key} delay={i * 0.1}>
          <article className="group cursor-pointer h-full bg-white border border-border/50 rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.image}
                alt={t(`items.${item.key}.title`)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 inline-block bg-accent text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                {t(`items.${item.key}.status`)}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                {t(`items.${item.key}.title`)}
              </h3>
              <div className="flex items-center gap-4 text-muted text-xs mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {t(`items.${item.key}.location`)}
                </span>
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" />
                  {t(`items.${item.key}.area`)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-primary font-bold">
                  {t(`items.${item.key}.price`)}
                </span>
                <span className="inline-flex items-center gap-1 text-accent text-xs font-medium uppercase tracking-wider group-hover:gap-2 transition-all">
                  {t("viewDetail")}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
