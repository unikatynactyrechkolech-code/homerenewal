"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type Props = {
  children: ReactNode;
  /** Sílu posunu (px) — kolik se obsah posune během viewportu */
  offset?: number;
  /** Kterou osu posouvat */
  axis?: "y" | "x";
  /** Volitelné dodatečné className */
  className?: string;
};

/**
 * Wrapper, který posouvá svůj obsah pomalu při scrollování — vytváří
 * dojem hloubky a "draho" působícího layoutu. Použij na obrázky.
 */
export default function Parallax({
  children,
  offset = 80,
  axis = "y",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const transform: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    [-offset, offset],
  );

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div
        style={axis === "y" ? { y: transform } : { x: transform }}
        className="will-change-transform h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
