"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Tag,
  Search,
  Hammer,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import NewsletterForm from "@/components/NewsletterForm";
import PropertyListings from "@/components/PropertyListings";
import ContactForm from "@/components/ContactForm";

/* ═══════════════════════════════════════════════════════════════
   HERO – full-screen video background
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
        >
          <source
            src="https://videos.pexels.com/video-files/7578544/7578544-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-6">
              {t("subtitle")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-8"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 leading-relaxed"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex gap-3 sm:gap-4"
          >
            <Link
              href={`/${locale}${locale === "cs" ? "/kontakt" : "/contact"}`}
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white px-5 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300"
            >
              {t("cta")}
            </Link>
            <Link
              href={`/${locale}${locale === "cs" ? "/chci-koupit" : "/buy"}`}
              className="inline-flex items-center justify-center border border-white/30 hover:border-white text-white px-5 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SEKCE – Sell / Buy / Renovate
   ═══════════════════════════════════════════════════════════════ */
function SectionsSection() {
  const t = useTranslations("sections");
  const locale = useLocale();

  const sections = [
    {
      icon: Tag,
      titleKey: "sell.title" as const,
      descKey: "sell.description" as const,
      ctaKey: "sell.cta" as const,
      href: locale === "cs" ? "/chci-prodat" : "/sell",
      color: "from-amber-500/10 to-orange-500/10",
    },
    {
      icon: Search,
      titleKey: "buy.title" as const,
      descKey: "buy.description" as const,
      ctaKey: "buy.cta" as const,
      href: locale === "cs" ? "/chci-koupit" : "/buy",
      color: "from-blue-500/10 to-indigo-500/10",
    },
    {
      icon: Hammer,
      titleKey: "renovate.title" as const,
      descKey: "renovate.description" as const,
      ctaKey: "renovate.cta" as const,
      href: locale === "cs" ? "/rekonstrukce" : "/renovations",
      color: "from-emerald-500/10 to-teal-500/10",
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent text-xs font-semibold uppercase tracking-[0.3em]">
                {t("label")}
              </span>
              <div className="h-[1px] w-12 bg-accent" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
              {t("title")}
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, i) => (
            <FadeIn key={section.titleKey} delay={i * 0.1}>
              <Link href={`/${locale}${section.href}`}>
                <div
                  className={`group relative p-10 bg-gradient-to-br ${section.color} rounded-2xl border border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 cursor-pointer h-full`}
                >
                  <section.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {t(section.titleKey)}
                  </h3>
                  <p className="text-muted leading-relaxed mb-6">
                    {t(section.descKey)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all">
                    {t(section.ctaKey)}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCESS
   ═══════════════════════════════════════════════════════════════ */
function ProcessSection() {
  const t = useTranslations("process");

  const steps = [
    { num: "01", title: t("step1.title"), desc: t("step1.description") },
    { num: "02", title: t("step2.title"), desc: t("step2.description") },
    { num: "03", title: t("step3.title"), desc: t("step3.description") },
    { num: "04", title: t("step4.title"), desc: t("step4.description") },
  ];

  return (
    <section className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="mb-20 text-center">
            <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
              {t("label")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
              {t("title")}
            </h2>
            <div className="w-16 h-[2px] bg-accent mx-auto mt-6" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.15}>
              <div className="relative">
                <span className="text-8xl font-black text-navy/15 leading-none">
                  {step.num}
                </span>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AKTUÁLNÍ NABÍDKA NEMOVITOSTÍ
   ═══════════════════════════════════════════════════════════════ */
function ListingsSection() {
  const t = useTranslations("listings");
  const locale = useLocale();

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
                {t("label")}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                {t("title")}
              </h2>
              <div className="w-16 h-[2px] bg-accent mt-4" />
              <p className="text-muted text-lg mt-6 max-w-xl">
                {t("description")}
              </p>
            </div>
            <Link
              href={`/${locale}${locale === "cs" ? "/chci-koupit" : "/buy"}`}
              className="group inline-flex items-center gap-2 text-accent text-sm font-medium hover:gap-3 transition-all shrink-0"
            >
              {t("viewAll")}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        <PropertyListings />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEWSLETTER
   ═══════════════════════════════════════════════════════════════ */
function NewsletterSection() {
  const t = useTranslations("newsletter");

  return (
    <section className="py-32 bg-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <FadeIn>
          <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            {t("label")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t("title")}
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {t("description")}
          </p>
          <NewsletterForm />
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KONTAKTNÍ FORMULÁŘ
   ═══════════════════════════════════════════════════════════════ */
function HomeContactSection() {
  const t = useTranslations("homeContact");

  return (
    <section id="contact" className="py-32 bg-surface">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
              {t("label")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
              {t("title")}
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="bg-white rounded-2xl border border-border/50 p-8 sm:p-12 shadow-sm">
            <ContactForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionsSection />
      <ProcessSection />
      <ListingsSection />
      <NewsletterSection />
      <HomeContactSection />
    </>
  );
}
