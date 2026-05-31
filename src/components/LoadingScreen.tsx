"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("hr_loaded") === "1") return;
    setShouldRender(true);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hr_loaded", "1");
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const cleanup = setTimeout(() => setShouldRender(false), 600);
      return () => clearTimeout(cleanup);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/logo-color.png"
              alt="Home Renewal"
              width={220}
              height={55}
              priority
              className="brightness-0 invert h-12 w-auto"
            />
          </motion.div>

          <motion.div
            className="mt-10 h-[1px] bg-accent/30 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="h-full bg-accent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
