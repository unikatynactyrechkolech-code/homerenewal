"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HouseLogo from "./HouseLogo";

/**
 * Full-screen loading screen shown on first page load.
 * Draws the house logo, shows the brand name, then fades out smoothly.
 */
export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Wait for the draw animation to complete, then start exit
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  // Remove from DOM after exit animation
  useEffect(() => {
    if (!isLoading) {
      const cleanup = setTimeout(() => {
        setShouldRender(false);
      }, 800);
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
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary"
        >
          {/* House drawing animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <HouseLogo size={100} strokeColor="#c8a97e" />
          </motion.div>

          {/* Brand name appears after house is drawn */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
            className="mt-8"
          >
            <span className="text-2xl font-bold tracking-tight text-white">
              HOME<span className="text-accent font-light">RENEWAL</span>
            </span>
          </motion.div>

          {/* Subtle loading bar */}
          <motion.div
            className="mt-8 h-[1px] bg-accent/30 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="h-full bg-accent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1,
                delay: 0.5,
                repeat: 1,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
