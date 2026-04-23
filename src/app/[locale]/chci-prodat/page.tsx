"use client";

import { useTranslations } from "next-intl";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";
import { Minus, Star } from "lucide-react";

type Variant = "a" | "b" | "c";
type RowKey = "money" | "renovation" | "marketing" | "legal";

const ROW_KEYS: RowKey[] = ["money", "renovation", "marketing", "legal"];

export default function ChciProdatPage() {
  const t = useTranslations("sell");

  const variants: Array<{
    key: Variant;
    highlighted: boolean;
  }> = [
    { key: "a", highlighted: true },
    { key: "b", highlighted: true },
    { key: "c", highlighted: false },
  ];

  /** Render value cell — turns a "—" into a soft minus icon, "Žádné/None" into a check. */
  const renderValue = (value: string) => {
    if (value === "—") {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted/10 text-muted/60">
          <Minus className="w-3.5 h-3.5" />
        </span>
      );
    }
    return <span className="text-sm text-primary font-medium">{value}</span>;
  };

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80"
      />

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="relative pl-8 border-l-2 border-accent">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
                {t("intro.title")}
              </h2>
              <p className="text-muted text-lg leading-relaxed max-w-3xl">
                {t("intro.description")}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Variants comparison */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                {t("variants.title")}
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                {t("variants.description")}
              </p>
            </div>
          </FadeIn>

          {/* Cards (mobile + desktop) */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {variants.map((v) => (
                <div
                  key={v.key}
                  className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 ${
                    v.highlighted
                      ? "border-accent shadow-xl shadow-accent/10"
                      : "border-border/50"
                  }`}
                >
                  {v.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-accent text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                      <Star className="w-3 h-3" />
                      {t("variants.recommended")}
                    </span>
                  )}
                  <span className="block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-3">
                    {t(`variants.${v.key}.name`)}
                  </span>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {t(`variants.${v.key}.subtitle`)}
                  </h3>
                  <p className="text-muted text-sm mb-6">
                    {t(`variants.${v.key}.tagline`)}
                  </p>
                  <a
                    href="#sell-form"
                    className={`inline-flex w-full items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                      v.highlighted
                        ? "bg-accent hover:bg-accent-dark text-white"
                        : "border border-primary/20 text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {t(`variants.${v.key}.cta`)}
                  </a>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Comparison table */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
              {/* Header row */}
              <div className="hidden md:grid grid-cols-4 bg-primary text-white">
                <div className="p-5 text-xs font-semibold uppercase tracking-wider text-white/60">
                  {t("variants.featureColumn")}
                </div>
                {variants.map((v) => (
                  <div
                    key={v.key}
                    className={`p-5 text-center text-xs font-semibold uppercase tracking-wider ${
                      v.highlighted ? "bg-accent text-white" : "text-white/80"
                    }`}
                  >
                    {t(`variants.${v.key}.subtitle`)}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {ROW_KEYS.map((rowKey, idx) => (
                <div
                  key={rowKey}
                  className={`grid grid-cols-1 md:grid-cols-4 ${
                    idx % 2 === 1 ? "bg-surface" : "bg-white"
                  }`}
                >
                  <div className="p-5 text-sm font-semibold text-primary border-b md:border-b-0 md:border-r border-border/50">
                    {t(`variants.rows.${rowKey}.label`)}
                  </div>
                  {variants.map((v) => (
                    <div
                      key={v.key}
                      className={`flex items-center justify-between md:justify-center gap-3 p-5 border-b md:border-b-0 md:border-r border-border/50 last:border-r-0 ${
                        v.highlighted ? "md:bg-accent/5" : ""
                      }`}
                    >
                      <span className="md:hidden text-xs font-medium text-muted uppercase tracking-wider">
                        {t(`variants.${v.key}.subtitle`)}
                      </span>
                      {renderValue(t(`variants.rows.${rowKey}.${v.key}`))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-16 text-center">
              {t("process.title")}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n, i) => (
              <FadeIn key={n} delay={i * 0.1}>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                      {n}
                    </div>
                    <div className="flex-1 h-[1px] bg-border" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {t(`process.step${n}.title`)}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {t(`process.step${n}.description`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="sell-form" className="py-24 bg-surface scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                {t("form.title")}
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                {t("form.description")}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-white rounded-2xl border border-border/50 p-8 sm:p-12 shadow-sm">
              <ContactForm defaultService="sellA" />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
