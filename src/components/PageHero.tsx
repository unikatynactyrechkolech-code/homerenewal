"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteImage from "./SiteImage";

interface PageHeroProps {
  label: string;
  title: string;
  description: string;
  image?: string;
  /** Stabilní klíč pro editaci hero obrázku z adminu. */
  imageEditKey?: string;
  /** Volitelné CTA tlačítko v hero sekci. */
  ctaLabel?: string;
  ctaHref?: string;
}

export default function PageHero({
  label,
  title,
  description,
  image,
  imageEditKey,
  ctaLabel,
  ctaHref,
}: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section
      ref={ref}
      className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden"
    >
      {/* Background s parallaxem */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 will-change-transform"
      >
        {image ? (
          <>
            {imageEditKey ? (
              <SiteImage
                editKey={imageEditKey}
                defaultSrc={image}
                alt=""
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-primary/80" />
          </>
        ) : (
          <div className="w-full h-full bg-primary" />
        )}
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-[1]" />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-block text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            {label}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/60 text-lg max-w-2xl leading-relaxed"
        >
          {description}
        </motion.p>

        {ctaLabel && ctaHref && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10"
          >
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-8 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
