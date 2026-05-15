"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SiteImage from "@/components/SiteImage";
import { FadeIn } from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";
import { ArrowRight, Check, ChevronDown, Minus, Star } from "lucide-react";
import { useState } from "react";

type Variant = "a" | "b" | "c";
type RowKey = "money" | "renovation" | "marketing" | "legal";

const ROW_KEYS: RowKey[] = ["money", "renovation", "marketing", "legal"];

type FaqItem = { question: string; answer: string };
type CrossPromoBullets = string[];
type VariantBullets = string[];

export default function ChciProdatPage() {
  const t = useTranslations("sell");
  const locale = useLocale();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const variants: Array<{ key: Variant; highlighted: boolean }> = [
    { key: "a", highlighted: true },
    { key: "b", highlighted: true },
    { key: "c", highlighted: false },
  ];

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

  const faqItems: FaqItem[] = t.raw("faq.items");
  const crossPromoBullets: CrossPromoBullets = t.raw("crossPromo.bullets");

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80"
        imageEditKey="chci-prodat/hero"
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

      {/* Variant cards with bullets */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {variants.map((v, i) => {
              const bullets: VariantBullets = t.raw(
                `variants.${v.key}.bullets`,
              );
              return (
                <FadeIn key={v.key} delay={i * 0.1}>
                  <div
                    className={`relative bg-white rounded-2xl p-8 border h-full flex flex-col transition-all duration-300 ${
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
                                        <h3 className="text-2xl font-bold text-primary mb-2">
                      {t(`variants.${v.key}.subtitle`)}
                    </h3>
                    <p className="text-muted text-sm mb-6">
                      {t(`variants.${v.key}.tagline`)}
                    </p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-sm text-primary leading-relaxed">
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
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
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                {t("variants.title")}
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
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
      <section className="py-24 bg-surface">
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

      {/* Cross-promo: Hledáte zároveň nový domov? */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-primary">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 lg:p-16 flex flex-col justify-center">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                    {t("crossPromo.title")}
                  </h2>
                  <p className="text-white/70 text-lg mb-8 leading-relaxed">
                    {t("crossPromo.description")}
                  </p>
                  <ul className="space-y-3 mb-10">
                    {crossPromoBullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm text-white/80">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}${locale === "cs" ? "/chci-koupit" : "/buy"}`}
                    className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-8 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300 self-start"
                  >
                    {t("crossPromo.cta")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px]">
                  <SiteImage
                    editKey="chci-prodat/cross-promo"
                    defaultSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
                    alt=""
                    className="absolute inset-0"
                    imgClassName="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/40 lg:to-primary/10" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
                {t("faq.title")}
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-3">
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-surface/50 transition-colors"
                    >
                      <span className="text-base sm:text-lg font-semibold text-primary">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-muted leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="sell-form" className="py-24 bg-white scroll-mt-20">
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
            <div className="bg-surface rounded-2xl border border-border/50 p-8 sm:p-12">
              <ContactForm defaultService="sellA" />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
