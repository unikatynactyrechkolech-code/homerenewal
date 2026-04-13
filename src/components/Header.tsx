"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { key: "renovations", href: "/rekonstrukce", hrefEn: "/renovations" },
  { key: "realEstate", href: "/reality", hrefEn: "/real-estate" },
  { key: "developers", href: "/developeri", hrefEn: "/developers" },
  { key: "references", href: "/reference", hrefEn: "/references" },
  { key: "concreteScreeds", href: "/betonove-sterky", hrefEn: "/concrete-screeds" },
  { key: "contact", href: "/kontakt", hrefEn: "/contact" },
];

/* ── Custom 2-line burger that morphs into X ── */
function BurgerButton({
  isOpen,
  onClick,
  color,
}: {
  isOpen: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden relative z-[60] w-8 h-8 flex flex-col items-center justify-center gap-[7px]"
      aria-label="Menu"
    >
      <span
        className={`block w-6 h-[2px] rounded-full transition-all duration-300 origin-center ${color} ${
          isOpen ? "rotate-45 translate-y-[4.5px]" : ""
        }`}
      />
      <span
        className={`block w-6 h-[2px] rounded-full transition-all duration-300 origin-center ${color} ${
          isOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
        }`}
      />
    </button>
  );
}

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getHref = (link: (typeof navLinks)[0]) => {
    return `/${locale}${locale === "cs" ? link.href : link.hrefEn}`;
  };

  const switchLocale = locale === "cs" ? "en" : "cs";
  const switchPath = pathname.replace(`/${locale}`, `/${switchLocale}`);

  const barColor = isOpen
    ? "bg-primary"
    : scrolled
      ? "bg-primary"
      : "bg-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="relative z-[60]">
            <span
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                isOpen || scrolled ? "text-primary" : "text-white"
              }`}
            >
              HOME<span className="text-accent font-light">RENEWAL</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={getHref(link)}
                className={`text-[13px] font-medium uppercase tracking-widest transition-colors duration-300 hover:text-accent ${
                  scrolled
                    ? "text-primary/70 hover:text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <Link
              href={switchPath}
              className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 relative z-[60] ${
                isOpen || scrolled
                  ? "text-primary/60 hover:text-primary"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {switchLocale.toUpperCase()}
            </Link>

            {/* Mobile burger */}
            <BurgerButton
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              color={barColor}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-white z-[55] flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link
                    href={getHref(link)}
                    onClick={() => setIsOpen(false)}
                    className="text-xl sm:text-2xl font-semibold text-primary hover:text-accent transition-colors uppercase tracking-wider"
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
