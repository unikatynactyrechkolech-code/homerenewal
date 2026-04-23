"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import {
  ArrowRight,
  Home,
  Building,
  Store,
  LayoutGrid,
  CheckCircle2,
  Layers,
} from "lucide-react";

export default function RekonstrukcePage() {
  const t = useTranslations("renovations");
  const locale = useLocale();

  const types = [
    { icon: Home, key: "apartments" },
    { icon: Building, key: "houses" },
    { icon: Store, key: "commercial" },
    { icon: LayoutGrid, key: "attic" },
  ] as const;

  const standards: string[] = t.raw("standards.items");

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80"
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

      {/* Types */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-16 text-center">
              {t("types.title")}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {types.map((type, i) => (
              <FadeIn key={type.key} delay={i * 0.1}>
                <div className="group p-8 rounded-2xl bg-white border border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 h-full">
                  <type.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {t(`types.${type.key}.title`)}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {t(`types.${type.key}.description`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
                  {t("standards.title")}
                </h2>
                <p className="text-muted text-lg mb-10 leading-relaxed">
                  {t("standards.description")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {standards.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-primary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=900&q=80"
                  alt="Renovation work"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>
          </div>
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
                <div className="relative bg-white p-8 rounded-2xl border border-border/50 h-full">
                  <span className="text-6xl font-black text-accent/20 leading-none block mb-4">
                    0{n}
                  </span>
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

      {/* Concrete screeds spotlight */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-primary">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px]">
                  <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80"
                    alt="Concrete screeds"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/40 lg:to-primary/10" />
                </div>
                <div className="p-10 lg:p-16 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
                    <Layers className="w-4 h-4" />
                    {t("concreteScreeds.label")}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                    {t("concreteScreeds.title")}
                  </h2>
                  <p className="text-white/70 text-lg mb-10 leading-relaxed">
                    {t("concreteScreeds.description")}
                  </p>
                  <Link
                    href={`/${locale}${locale === "cs" ? "/betonove-sterky" : "/concrete-screeds"}`}
                    className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-8 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300 self-start"
                  >
                    {t("concreteScreeds.cta")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>
            <Link
              href={`/${locale}${locale === "cs" ? "/kontakt" : "/contact"}`}
              className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-10 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
            >
              {t("cta.button")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
