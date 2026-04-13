"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, Lightbulb, Hammer, Megaphone } from "lucide-react";

export default function DeveloperiPage() {
  const t = useTranslations("developers");
  const locale = useLocale();

  const services = [
    {
      icon: Lightbulb,
      title: t("services.consulting.title"),
      desc: t("services.consulting.description"),
    },
    {
      icon: Hammer,
      title: t("services.realization.title"),
      desc: t("services.realization.description"),
    },
    {
      icon: Megaphone,
      title: t("services.marketing.title"),
      desc: t("services.marketing.description"),
    },
  ];

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
      />

      {/* Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="group relative p-10 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                    <service.icon className="w-7 h-7 text-accent" />
                  </div>
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

      {/* Feature image */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
                alt="Development project"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
                <div className="max-w-lg p-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {t("hero.title")}
                  </h2>
                  <p className="text-white/70 leading-relaxed">
                    {t("hero.description")}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
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
