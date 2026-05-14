"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { key: "sell", href: "/chci-prodat", hrefEn: "/sell" },
  { key: "buy", href: "/chci-koupit", hrefEn: "/buy" },
  { key: "renovations", href: "/rekonstrukce", hrefEn: "/renovations" },
  { key: "about", href: "/o-nas", hrefEn: "/about" },
  { key: "contact", href: "/kontakt", hrefEn: "/contact" },
];

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detekuj adminsky top bar
  const [adminBarHeight, setAdminBarHeight] = useState(0);

  useEffect(() => {
    function measure() {
      // AdminBar přidává div.h-12 (48px) jako spacer
      const spacer = document.querySelector<HTMLElement>('[aria-hidden="true"].h-12');
      setAdminBarHeight(spacer ? spacer.offsetHeight : 0);
      setScrolled(window.scrollY > 10);
    }
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Zavři při změně route
  useEffect(() => { close(); }, [pathname, close]);

  // Zamkni scroll body — přes CSS třídu, ne inline style (spolehlivější na iOS)
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("menu-open");
    } else {
      document.documentElement.classList.remove("menu-open");
    }
    return () => document.documentElement.classList.remove("menu-open");
  }, [isOpen]);

  const getHref = (link: (typeof navLinks)[0]) =>
    `/${locale}${locale === "cs" ? link.href : link.hrefEn}`;

  const switchLocale = locale === "cs" ? "en" : "cs";
  const switchPath = pathname.replace(`/${locale}`, `/${switchLocale}`);

  const onLight = scrolled || isOpen;

  return (
    <>
      {/* ─── HEADER BAR ─── */}
      <header
        style={{ top: adminBarHeight }}
        className={`fixed left-0 right-0 z-[200] transition-all duration-500 ${
          onLight
            ? "bg-white/97 backdrop-blur-md shadow-sm border-b border-black/8"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href={`/${locale}`} className="shrink-0" onClick={close}>
              {/* Tmavé logo na bílém headeru, bílé (invertované) na průhledném */}
              <Image
                src="/logo.png"
                alt="Home Renewal"
                width={120}
                height={30}
                priority
                className={`h-6 sm:h-7 w-auto transition-all duration-300 ${
                  onLight ? "brightness-0" : "brightness-0 invert"
                }`}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={getHref(link)}
                  className={`text-[13px] font-medium uppercase tracking-widest transition-colors duration-300 ${
                    scrolled
                      ? "text-primary/70 hover:text-primary"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <Link
                href={switchPath}
                className={`hidden sm:flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                  onLight
                    ? "text-primary/60 hover:text-primary"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {switchLocale.toUpperCase()}
              </Link>

              {/* Burger — pouze mobil */}
              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded-full gap-[6px] focus:outline-none"
                aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
                aria-expanded={isOpen}
              >
                <span
                  className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
                    onLight ? "bg-primary" : "bg-white"
                  } ${isOpen ? "rotate-45 translate-y-[4px]" : ""}`}
                />
                <span
                  className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
                    onLight ? "bg-primary" : "bg-white"
                  } ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MOBILE MENU OVERLAY ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            // Umíst menu přesně pod header — top = adminBar + headerHeight
            style={{ top: adminBarHeight + 64 }}
            className="lg:hidden fixed left-0 right-0 bottom-0 z-[199] bg-white overflow-y-auto"
          >
            <nav className="flex flex-col px-6 pt-6 pb-10 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.2 }}
                >
                  <Link
                    href={getHref(link)}
                    onClick={close}
                    className="block py-4 text-2xl font-bold text-primary hover:text-accent transition-colors border-b border-black/5 last:border-0"
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}

              {/* Jazykový přepínač v menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-6"
              >
                <Link
                  href={switchPath}
                  onClick={close}
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {switchLocale === "cs" ? "Česky" : "English"}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

