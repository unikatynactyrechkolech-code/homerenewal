"use client";

import { motion, useScroll, useTransform, useMotionValue, useAnimationFrame } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Tag, Search, Hammer } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import NewsletterForm from "@/components/NewsletterForm";
import PropertyListings from "@/components/PropertyListings";
import ContactForm from "@/components/ContactForm";

/* Parallax pouze na desktopu — mobil nespouštět scroll efekty */
function useIsDesktop() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setOk(mq.matches);
    const h = (e: MediaQueryListEvent) => setOk(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return ok;
}

/* -- Marquee --------------------------------------------------------- */
const MARQUEE_ITEMS = [
  "NAKUP", "PRODEJ", "REKONSTRUKCE", "PREMIUMOVE NEMOVITOSTI",
  "BETONOVE STERKY", "HOME RENEWAL", "BEZ STAROSTI",
];

function Marquee() {
  const x = useMotionValue(0);
  const total = MARQUEE_ITEMS.length * 280;

  useAnimationFrame((_, delta) => {
    x.set((x.get() - delta * 0.04) % total);
  });

  return (
    <div className="overflow-hidden border-y border-border/60 bg-white py-5 select-none">
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 mr-10 text-xs font-semibold tracking-[0.3em] text-primary/30">
            {item}
            <span className="inline-block w-1 h-1 rounded-full bg-accent shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* -- Counter ---------------------------------------------------------- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* == HERO ============================================================= */
function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isDesktop = useIsDesktop();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      <motion.div style={isDesktop ? { y: videoY, scale: videoScale } : {}} className="absolute inset-0 will-change-transform">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover" poster="/images/hero-poster.jpg">
          <source src="https://videos.pexels.com/video-files/7578544/7578544-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay absolute inset-0" />
      </motion.div>



      <motion.div style={isDesktop ? { y: textY, opacity: textOpacity } : {}} className="relative z-10 w-full px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[1.05] mb-10 max-w-5xl uppercase tracking-tight"
        >
          {t("title")}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex gap-3 sm:gap-4"
        >
          <Link href={`/${locale}/kontakt`}
            className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white px-5 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300">
            {t("cta")}
          </Link>
          <Link href={`/${locale}/chci-koupit`}
            className="inline-flex items-center justify-center border border-white/30 hover:border-white text-white px-5 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300">
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}

/* == STATS ============================================================ */
function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const stats = [
    { num: 120, suffix: "+", label: "Uspesnych projektu" },
    { num: 98, suffix: "%", label: "Spokojenych klientu" },
    { num: 15, suffix: "+", label: "Let zkusenosti" },
    { num: 850, suffix: "M+", label: "Kc v transakcich" },
  ];
  return (
    <section ref={ref} className="relative py-24 bg-primary overflow-hidden">
      <motion.div style={{ x: bgX }} className="absolute inset-0 opacity-[0.03]" aria-hidden>
        <div className="absolute inset-0"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#c8a97e 0,#c8a97e 1px,transparent 0,transparent 50%)", backgroundSize: "40px 40px" }} />
      </motion.div>
      <motion.div animate={{ scale: [1,1.15,1], opacity: [0.06,0.12,0.06] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent blur-3xl" />
      <motion.div animate={{ scale: [1,1.2,1], opacity: [0.04,0.08,0.04] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-accent blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <div className="text-center lg:px-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums">
                  <Counter to={s.num} suffix={s.suffix} />
                </div>
                <div className="text-sm text-white/40 uppercase tracking-widest">{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* == SEKCE ============================================================ */
function SectionsSection() {
  const t = useTranslations("sections");
  const locale = useLocale();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const blobY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const sections = [
    { icon: Tag, titleKey: "sell.title" as const, descKey: "sell.description" as const, ctaKey: "sell.cta" as const, href: "/chci-prodat" },
    { icon: Search, titleKey: "buy.title" as const, descKey: "buy.description" as const, ctaKey: "buy.cta" as const, href: "/chci-koupit" },
    { icon: Hammer, titleKey: "renovate.title" as const, descKey: "renovate.description" as const, ctaKey: "renovate.cta" as const, href: "/rekonstrukce" },
  ];
  return (
    <section ref={ref} className="py-32 bg-white relative overflow-hidden">
      <motion.div style={isDesktop ? { y: blobY } : {}}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/4 blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-20 text-center">{t("title")}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, i) => (
            <FadeIn key={section.titleKey} delay={i * 0.12}>
              <Link href={`/${locale}${section.href}`} className="block h-full group">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative p-10 rounded-2xl border border-border/50 hover:border-accent/40 bg-white hover:shadow-xl hover:shadow-accent/5 cursor-pointer h-full transition-shadow duration-500"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/4 group-hover:to-transparent transition-all duration-500" />
                  <section.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                  <h3 className="text-xl font-bold text-primary mb-4 relative z-10">{t(section.titleKey)}</h3>
                  <p className="text-muted leading-relaxed mb-6 relative z-10">{t(section.descKey)}</p>
                  <span className="inline-flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all relative z-10">
                    {t(section.ctaKey)} <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* == PROCESS ========================================================== */
function ProcessSection() {
  const t = useTranslations("process");
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineW = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);
  const blobY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const steps = [
    { num: "01", title: t("step1.title"), desc: t("step1.description") },
    { num: "02", title: t("step2.title"), desc: t("step2.description") },
    { num: "03", title: t("step3.title"), desc: t("step3.description") },
    { num: "04", title: t("step4.title"), desc: t("step4.description") },
  ];
  return (
    <section ref={ref} className="py-32 bg-surface relative overflow-hidden">
      <motion.div style={isDesktop ? { y: blobY } : {}}
        className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl translate-x-1/3 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">{t("title")}</h2>
            <div className="w-16 h-[2px] bg-accent mx-auto mt-6" />
          </div>
        </FadeIn>
        <div className="relative hidden lg:flex justify-between px-[12.5%] mb-8">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border/60" />
          <motion.div style={isDesktop ? { width: lineW } : { width: "100%" }} className="absolute top-1/2 left-0 h-[1px] bg-accent origin-left" />
          {steps.map((s, i) => (
            <motion.div key={s.num}
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
              className="w-3 h-3 rounded-full bg-accent ring-4 ring-surface relative z-10" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-4">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.15}>
              <div>
                <motion.span className="text-8xl font-black text-navy/70 leading-none block"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
                  {step.num}
                </motion.span>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* == LISTINGS ========================================================= */
function ListingsSection() {
  const t = useTranslations("listings");
  const locale = useLocale();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const blobY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section ref={ref} className="py-32 bg-white relative overflow-hidden">
      <motion.div style={isDesktop ? { y: blobY } : {}}
        className="absolute left-1/2 bottom-0 w-[700px] h-[400px] rounded-full bg-accent/4 blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">{t("title")}</h2>
              <div className="w-16 h-[2px] bg-accent mt-4" />
              <p className="text-muted text-lg mt-6 max-w-xl">{t("description")}</p>
            </div>
            <Link href={`/${locale}/chci-koupit`}
              className="group inline-flex items-center gap-2 text-accent text-sm font-medium hover:gap-3 transition-all shrink-0">
              {t("viewAll")} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
        <PropertyListings />
      </div>
    </section>
  );
}

/* == NEWSLETTER ======================================================= */
function NewsletterSection() {
  const t = useTranslations("newsletter");
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const orbY1 = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  return (
    <section ref={ref} className="py-32 bg-primary relative overflow-hidden">
      <motion.div style={isDesktop ? { y: orbY1 } : {}} className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <motion.div style={isDesktop ? { y: orbY2 } : {}} className="absolute bottom-0 left-0 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/4 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{t("title")}</h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">{t("description")}</p>
          <NewsletterForm />
        </FadeIn>
      </div>
    </section>
  );
}

/* == KONTAKT ========================================================== */
function HomeContactSection() {
  const t = useTranslations("homeContact");
  return (
    <section id="contact" className="py-32 bg-surface relative overflow-hidden">
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-10 top-20 w-40 h-40 rounded-full border border-accent/10 pointer-events-none hidden lg:block" />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">{t("title")}</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">{t("description")}</p>
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

/* == PAGE ============================================================= */
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
