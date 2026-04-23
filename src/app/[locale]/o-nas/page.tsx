"use client";

import { useTranslations } from "next-intl";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { Award, Shield, Sparkles, ExternalLink } from "lucide-react";

export default function ONasPage() {
  const t = useTranslations("about");

  const values = [
    { icon: Sparkles, key: "quality" },
    { icon: Shield, key: "transparency" },
    { icon: Award, key: "responsibility" },
  ] as const;

  const stats = ["stat1", "stat2", "stat3", "stat4"] as const;

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
      />

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="relative pl-8 border-l-2 border-accent">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 leading-tight">
                {t("story.title")}
              </h2>
              <div className="space-y-6 text-muted text-lg leading-relaxed max-w-3xl">
                <p>{t("story.p1")}</p>
                <p>{t("story.p2")}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeIn key={s} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-accent mb-3">
                    {t(`stats.${s}.value`)}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted">
                    {t(`stats.${s}.label`)}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-16 text-center">
              {t("values.title")}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <FadeIn key={v.key} delay={i * 0.1}>
                <div className="group p-10 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                    <v.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {t(`values.${v.key}.title`)}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {t(`values.${v.key}.description`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pazderka Management partnership */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
              {t("partner.label")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("partner.title")}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("partner.description")}
            </p>
            <a
              href="https://pazderkamanagement.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-10 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
            >
              {t("partner.cta")}
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
