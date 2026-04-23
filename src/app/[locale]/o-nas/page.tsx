"use client";

import { useTranslations } from "next-intl";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { ExternalLink } from "lucide-react";

export default function ONasPage() {
  const t = useTranslations("about");

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
