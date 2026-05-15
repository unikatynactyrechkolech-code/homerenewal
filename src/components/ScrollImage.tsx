"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * ScrollImage — obrázek se scroll-driven parallax + zoom + reveal efektem.
 *
 * - Při příchodu do viewportu se odhalí (clip-path) + jemně přiblíží.
 * - Při scrollu se obsah uvnitř pohybuje pomaleji (parallax).
 * - Volitelně náklon (`tilt`) pro asymetrické grid layouty.
 */
export default function ScrollImage({
  src,
  alt = "",
  className = "",
  innerClassName = "",
  parallax = 60,
  scale = 1.15,
  tilt = 0,
  badge,
  grayscale = false,
  rounded = "rounded-2xl",
}: {
  src: string;
  alt?: string;
  className?: string;
  innerClassName?: string;
  /** Kolik px se obrázek posune během průchodu viewportem. */
  parallax?: number;
  /** Maximální měřítko obrázku v dolní fázi (1 = bez zoomu). */
  scale?: number;
  /** Drobný náklon ve stupních. */
  tilt?: number;
  badge?: { label: string; tone?: "light" | "accent" };
  grayscale?: boolean;
  rounded?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [scale, 1, scale * 0.98]);

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 24, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden ${rounded} ${className}`}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale: s }}
        className={`w-full h-full object-cover will-change-transform ${
          grayscale ? "grayscale-[35%]" : ""
        } ${innerClassName}`}
      />
      {badge && (
        <figcaption
          className={`absolute top-3 left-3 inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${
            badge.tone === "accent"
              ? "bg-[#c8a97e] text-white"
              : "bg-white/90 text-[#1a1a1a]"
          }`}
        >
          {badge.label}
        </figcaption>
      )}
    </motion.figure>
  );
}
