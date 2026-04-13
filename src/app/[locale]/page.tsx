"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Home,
  Landmark,
  Layers,
} from "lucide-react";

/* ─── Fade-in wrapper ─── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION – full-screen video background
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Video Background */}
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

      {/* Content */}
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
              href={`/${locale}${locale === "cs" ? "/reference" : "/references"}`}
              className="inline-flex items-center justify-center border border-white/30 hover:border-white text-white px-5 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
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
   SERVICES SECTION
   ═══════════════════════════════════════════════════════════════ */
function ServicesSection() {
  const t = useTranslations("services");
  const locale = useLocale();

  const services = [
    {
      icon: Home,
      titleKey: "renovation.title" as const,
      descKey: "renovation.description" as const,
      ctaKey: "renovation.cta" as const,
      href: locale === "cs" ? "/rekonstrukce" : "/renovations",
      color: "from-amber-500/10 to-orange-500/10",
    },
    {
      icon: Landmark,
      titleKey: "realEstate.title" as const,
      descKey: "realEstate.description" as const,
      ctaKey: "realEstate.cta" as const,
      href: locale === "cs" ? "/reality" : "/real-estate",
      color: "from-blue-500/10 to-indigo-500/10",
    },
    {
      icon: Building2,
      titleKey: "developers.title" as const,
      descKey: "developers.description" as const,
      ctaKey: "developers.cta" as const,
      href: locale === "cs" ? "/developeri" : "/developers",
      color: "from-emerald-500/10 to-teal-500/10",
    },
    {
      icon: Layers,
      titleKey: "concreteScreeds.title" as const,
      descKey: "concreteScreeds.description" as const,
      ctaKey: "concreteScreeds.cta" as const,
      href: locale === "cs" ? "/betonove-sterky" : "/concrete-screeds",
      color: "from-gray-500/10 to-stone-500/10",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <FadeIn key={service.titleKey} delay={i * 0.1}>
              <Link href={`/${locale}${service.href}`}>
                <div
                  className={`group relative p-10 bg-gradient-to-br ${service.color} rounded-2xl border border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 cursor-pointer h-full`}
                >
                  <service.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-muted leading-relaxed mb-6">
                    {t(service.descKey)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all">
                    {t(service.ctaKey)}
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
   ABOUT / STATS SECTION
   ═══════════════════════════════════════════════════════════════ */
function AboutSection() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-32 bg-surface">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="relative pl-8 border-l-2 border-accent">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-8 leading-tight">
              {t("title")}
            </h2>
            <p className="text-muted text-lg leading-relaxed max-w-2xl">
              {t("description")}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCESS SECTION
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
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary text-center">
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
   REFERENCES PREVIEW SECTION
   ═══════════════════════════════════════════════════════════════ */
function ReferencesPreview() {
  const t = useTranslations("references");
  const locale = useLocale();

  const projects = [
    {
      title: "Rekonstrukce bytu Praha 1",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      category: "Byty",
    },
    {
      title: "Rodinný dům Černošice",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      category: "Domy",
    },
    {
      title: "Loft Praha 7",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      category: "Byty",
    },
  ];

  return (
    <section className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                {t("title")}
              </h2>
              <div className="w-16 h-[2px] bg-accent mt-4" />
            </div>
            <Link
              href={`/${locale}${locale === "cs" ? "/reference" : "/references"}`}
              className="group inline-flex items-center gap-2 text-accent text-sm font-medium hover:gap-3 transition-all shrink-0"
            >
              {t("cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-white text-xl font-bold">
                    {project.title}
                  </h3>
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
   CTA SECTION
   ═══════════════════════════════════════════════════════════════ */
function CTASection() {
  const t = useTranslations("cta");
  const locale = useLocale();

  return (
    <section className="py-32 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t("title")}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}${locale === "cs" ? "/kontakt" : "/contact"}`}
              className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-10 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
            >
              {t("button")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`mailto:${t("email")}`}
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              {t("email")}
            </a>
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
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <ReferencesPreview />
      <CTASection />
    </>
  );
}
