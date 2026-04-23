"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder={t("placeholder")}
          className="flex-1 px-5 py-4 bg-white/5 border border-white/15 text-white placeholder-white/50 rounded-full outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
        />
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-4 text-sm font-medium uppercase tracking-wider rounded-full transition-all duration-300"
        >
          {t("button")}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <p className="text-xs text-white/40 mt-4 text-center">{t("consent")}</p>

      {submitted && (
        <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{t("success")}</span>
        </div>
      )}
    </form>
  );
}
