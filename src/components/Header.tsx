"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { key: "sell", href: "/chci-prodat" },
  { key: "buy", href: "/chci-koupit" },
  { key: "renovations", href: "/rekonstrukce" },
  { key: "about", href: "/o-nas" },
  { key: "contact", href: "/kontakt" },
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

  // Skryj header na detailu nemovitosti — immersive view
  const hideHeader = /\/nemovitosti\//.test(pathname || "");
  if (hideHeader) return null;

  const getHref = (link: (typeof navLinks)[0]) =>
    `/${locale}${link.href}`;

  const switchLocale = locale === "cs" ? "en" : "cs";
  const switchPath = pathname.replace(`/${locale}`, `/${switchLocale}`);

  // Průhledný header (kvůli hero videu) je jen na úvodní stránce.
  // Všechny ostatní podstránky mají bílý pruh už od začátku.
  const isHome = /^\/(cs|en)\/?$/.test(pathname || "");
  const onLight = scrolled || isOpen || !isHome;

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
              {/* Tmavě modré logo — viditelné od začátku: na průhledném i bílém headeru. */}
              <Image
                src="/logo-color.png"
                alt="Home Renewal"
                width={132}
                height={33}
                priority
                className="h-6 sm:h-7 w-auto transition-all duration-300"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={getHref(link)}
                  data-no-override
                  className={`text-[13px] font-medium uppercase tracking-widest transition-colors duration-300 ${
                    onLight
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
                scroll={false}
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

      {/* ─── MOBILE MENU OVERLAY (Apple-style fullscreen) ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ top: adminBarHeight + 64 }}
            className="lg:hidden fixed left-0 right-0 bottom-0 z-[199] bg-white overflow-y-auto"
          >
            <nav className="h-full min-h-full flex flex-col px-8 py-10">
              {/* Hlavn\u00ed navigace \u2014 rovnom\u011brn\u011b roztaz\u011bn\u00e1 p\u0159es st\u0159ed */}
              <ul className="flex-1 flex flex-col justify-evenly items-center text-center">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + 0.05 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    <Link
                      href={getHref(link)}
                      onClick={close}
                      className="block py-3 text-3xl sm:text-4xl font-semibold text-primary hover:text-accent active:text-accent transition-colors tracking-tight"
                    >
                      {t(link.key)}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Spodn\u00ed lajna \u2014 jazyk + kontakt */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="shrink-0 pt-8 border-t border-black/5 flex items-center justify-between"
              >
                <Link
                  href={switchPath}
                  scroll={false}
                  onClick={close}
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {switchLocale === "cs" ? "Česky" : "English"}
                </Link>
                <a
                  href="mailto:info@homerenewal.cz"
                  className="text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  info@homerenewal.cz
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

