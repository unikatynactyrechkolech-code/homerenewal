"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, Minus, Shield, Palette, Sparkles } from "lucide-react";

export default function BetonoveSterkyPage() {
  const t = useTranslations("concreteScreeds");
  const locale = useLocale();

  const benefits = [
    {
      icon: Minus,
      title: t("benefits.seamless.title"),
      desc: t("benefits.seamless.description"),
    },
    {
      icon: Shield,
      title: t("benefits.durable.title"),
      desc: t("benefits.durable.description"),
    },
    {
      icon: Palette,
      title: t("benefits.design.title"),
      desc: t("benefits.design.description"),
    },
    {
      icon: Sparkles,
      title: t("benefits.maintenance.title"),
      desc: t("benefits.maintenance.description"),
    },
  ];

  const applications: string[] = t.raw("applications.items");

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1600&q=80"
      />

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-16 text-center">
              {t("benefits.title")}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group text-center p-8 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 h-full">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80"
                    alt="Concrete screeds"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80"
                    alt="Concrete screeds"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80"
                    alt="Concrete screeds"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80"
                    alt="Concrete screeds"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8">
                  {t("applications.title")}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-primary border border-border/50 hover:border-accent/50 transition-colors cursor-default"
                    >
                      {app}
                    </span>
                  ))}
                </div>
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
