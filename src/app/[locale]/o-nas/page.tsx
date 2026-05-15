"use client";

import { useTranslations } from "next-intl";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { ExternalLink, Tag, Hammer, Search, Layers } from "lucide-react";

type WhatItem = { title: string; description: string };

export default function ONasPage() {
  const t = useTranslations("about");

  const whatItems: WhatItem[] = t.raw("what.items");
  const whatIcons = [Tag, Hammer, Search, Layers];

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
        imageEditKey="o-nas/hero"
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

      {/* What we do */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
                {t("what.title")}
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatItems.map((item, i) => {
              const Icon = whatIcons[i] ?? Tag;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group p-8 bg-white rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 h-full flex gap-5">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pazderka Management partnership */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("partner.title")}
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
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
