"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, TrendingUp, Search, BarChart3, Settings } from "lucide-react";

export default function RealityPage() {
  const t = useTranslations("realEstate");
  const locale = useLocale();

  const services = [
    {
      icon: TrendingUp,
      title: t("services.sale.title"),
      desc: t("services.sale.description"),
    },
    {
      icon: Search,
      title: t("services.purchase.title"),
      desc: t("services.purchase.description"),
    },
    {
      icon: BarChart3,
      title: t("services.valuation.title"),
      desc: t("services.valuation.description"),
    },
    {
      icon: Settings,
      title: t("services.management.title"),
      desc: t("services.management.description"),
    },
  ];

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80"
      />

      {/* Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group relative p-10 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 h-full">
                  <service.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {service.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{service.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Visual section */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80"
                  alt="Real Estate"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div>
                <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4 block">
                  {t("hero.label")}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
                  {t("hero.title")}
                </h2>
                <p className="text-muted text-lg leading-relaxed mb-8">
                  {t("hero.description")}
                </p>
                <Link
                  href={`/${locale}${locale === "cs" ? "/kontakt" : "/contact"}`}
                  className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-8 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
                >
                  {t("cta.button")}
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
