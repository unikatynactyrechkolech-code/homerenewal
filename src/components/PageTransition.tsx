"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import HouseLogo from "./HouseLogo";

/**
 * Page transition overlay that triggers on route changes.
 * Shows a brief curtain with a small house icon while the
 * new page loads underneath. No flicker, no frame skips.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPathname = useRef(pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip transition on very first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousPathname.current = pathname;
      return;
    }

    // Only animate on actual route changes
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    // Schedule state update to avoid synchronous setState in effect
    const rafId = requestAnimationFrame(() => {
      setIsTransitioning(true);
      window.scrollTo({ top: 0 });
    });

    // Slide the curtain away after it covers the screen
    const revealTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 850);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(revealTimer);
    };
  }, [pathname]);

  return (
    <>
      {children}

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="page-transition"
            className="fixed inset-0 z-[9998] flex items-center justify-center"
          >
            {/* Dark curtain slides in from bottom */}
            <motion.div
              className="absolute inset-0 bg-primary"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            {/* Small house icon in center */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.25,
                delay: 0.15,
                ease: "easeOut",
              }}
            >
              <HouseLogo size={50} strokeColor="#c8a97e" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
