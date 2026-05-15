"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  // Trigger dříve (margin 0 namísto -80) a kratší duration → reaguje rychleji při rychlém scrollu.
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  // Cap delay na 0.18s, aby se kaskáda nehromadila při rychlém scrollu.
  const safeDelay = Math.min(delay, 0.18);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: safeDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
