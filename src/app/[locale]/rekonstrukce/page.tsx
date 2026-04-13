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
} from "lucide-react";

export default function RekonstrukcePage() {
  const t = useTranslations("renovations");
  const locale = useLocale();

  const types = [
    {
      icon: Home,
      title: t("types.apartments.title"),
      desc: t("types.apartments.description"),
    },
    {
      icon: Building,
      title: t("types.houses.title"),
      desc: t("types.houses.description"),
    },
    {
      icon: Store,
      title: t("types.commercial.title"),
      desc: t("types.commercial.description"),
    },
    {
      icon: LayoutGrid,
      title: t("types.attic.title"),
      desc: t("types.attic.description"),
    },
  ];

  const works: string[] = t.raw("works.items");

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80"
      />

      {/* Types of renovations */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-16 text-center">
              {t("types.title")}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {types.map((type, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group p-8 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 h-full">
                  <type.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {type.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {type.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Work types */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-10">
                  {t("works.title")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {works.map((work, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted">{work}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80"
                  alt="Renovation work"
                  className="w-full h-full object-cover"
                />
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
