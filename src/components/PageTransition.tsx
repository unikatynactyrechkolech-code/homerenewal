"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousPathname.current = pathname;
      return;
    }

    const prev = previousPathname.current;
    if (prev === pathname) return;
    previousPathname.current = pathname;

    const isDetailNav =
      prev.includes("/nemovitosti/") || pathname.includes("/nemovitosti/");

    const prevSeg = prev.split("/").filter(Boolean);
    const nextSeg = pathname.split("/").filter(Boolean);
    const sameSection =
      prevSeg.length >= 2 && nextSeg.length >= 2 && prevSeg[1] === nextSeg[1];

    if (isDetailNav || sameSection) {
      window.scrollTo({ top: 0 });
      return;
    }

    const rafId = requestAnimationFrame(() => {
      setIsTransitioning(true);
      window.scrollTo({ top: 0 });
    });
    const revealTimer = setTimeout(() => setIsTransitioning(false), 500);

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
            <motion.div
              className="absolute inset-0 bg-brand"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
            >
              <Image
                src="/logo-color.png"
                alt="Home Renewal"
                width={176}
                height={44}
                className="brightness-0 invert h-10 w-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
