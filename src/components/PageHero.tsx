"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  label: string;
  title: string;
  description: string;
  image?: string;
}

export default function PageHero({ label, title, description, image }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {image ? (
          <>
            <img src={image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/80" />
          </>
        ) : (
          <div className="w-full h-full bg-primary" />
        )}
        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
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
      </div>
    </section>
  );
}
