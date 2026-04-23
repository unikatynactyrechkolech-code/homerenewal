"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import PropertyListings from "@/components/PropertyListings";
import { ArrowRight, Check } from "lucide-react";

const beforeAfter = [
  {
    before:
      "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900&q=80",
    after:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  },
  {
    before:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&q=80",
    after:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
  },
  {
    before:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
    after:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
  },
];

export default function ChciKoupitPage() {
  const t = useTranslations("buy");
  const locale = useLocale();
  const points: string[] = t.raw("financing.points");

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80"
      />

      {/* Listings */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="mb-14 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                {t("listings.title")}
              </h2>
              <p className="text-muted text-lg">{t("listings.description")}</p>
            </div>
          </FadeIn>
          <PropertyListings />
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
                {t("beforeAfter.label")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                {t("beforeAfter.title")}
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                {t("beforeAfter.description")}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {beforeAfter.map((pair, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="grid grid-cols-2 gap-3">
                  <figure className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    <img
                      src={pair.before}
                      alt="Before"
                      className="w-full h-full object-cover grayscale-[40%]"
                    />
                    <figcaption className="absolute top-3 left-3 inline-block bg-white/90 text-primary text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {t("beforeAfter.before")}
                    </figcaption>
                  </figure>
                  <figure className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    <img
                      src={pair.after}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                    <figcaption className="absolute top-3 left-3 inline-block bg-accent text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {t("beforeAfter.after")}
                    </figcaption>
                  </figure>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                {t("process.title")}
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                {t("process.description")}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((n, i) => (
              <FadeIn key={n} delay={i * 0.1}>
                <div className="relative">
                  <span className="text-7xl font-black text-accent/20 leading-none">
                    0{n}
                  </span>
                  <h3 className="text-lg font-bold text-primary mb-3 mt-3">
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

      {/* Financing */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&q=80"
                  alt="Financing"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div>
                <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
                  {t("financing.label")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
                  {t("financing.title")}
                </h2>
                <p className="text-muted text-lg leading-relaxed mb-8">
                  {t("financing.description")}
                </p>
                <ul className="space-y-3 mb-10">
                  {points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-primary">{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}${locale === "cs" ? "/kontakt" : "/contact"}`}
                  className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-8 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
                >
                  {t("financing.cta")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
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
