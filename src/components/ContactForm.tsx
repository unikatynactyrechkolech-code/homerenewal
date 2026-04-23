"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle } from "lucide-react";

interface ContactFormProps {
  /** Pre-select a service option (matches keys in contact.form.serviceOptions). */
  defaultService?:
    | "sellA"
    | "sellB"
    | "sellC"
    | "buy"
    | "renovation"
    | "concrete"
    | "other";
  /** Visual variant. "light" = default white card, "dark" = on dark background. */
  variant?: "light" | "dark";
}

export default function ContactForm({
  defaultService = "other",
  variant = "light",
}: ContactFormProps) {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const isDark = variant === "dark";
  const labelClass = isDark
    ? "block text-sm font-medium text-white/80 mb-2"
    : "block text-sm font-medium text-primary mb-2";
  const fieldClass = isDark
    ? "w-full px-4 py-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm text-white placeholder-white/40"
    : "w-full px-4 py-3.5 bg-surface rounded-xl border border-border/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm";
  const consentClass = isDark ? "text-xs text-white/40" : "text-xs text-muted";

  const options: Array<{
    value: ContactFormProps["defaultService"];
    label: string;
  }> = [
    { value: "sellA", label: t("serviceOptions.sellA") },
    { value: "sellB", label: t("serviceOptions.sellB") },
    { value: "sellC", label: t("serviceOptions.sellC") },
    { value: "buy", label: t("serviceOptions.buy") },
    { value: "renovation", label: t("serviceOptions.renovation") },
    { value: "concrete", label: t("serviceOptions.concrete") },
    { value: "other", label: t("serviceOptions.other") },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t("name")}</label>
          <input type="text" required className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>{t("email")}</label>
          <input type="email" required className={fieldClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>{t("phone")}</label>
          <input type="tel" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>{t("service")}</label>
          <select defaultValue={defaultService} className={fieldClass}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-primary">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>{t("message")}</label>
        <textarea rows={5} required className={`${fieldClass} resize-none`} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent-dark text-white px-10 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
        >
          {t("submit")}
          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className={consentClass}>{t("consent")}</p>
      </div>

      {submitted && (
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{t("success")}</span>
        </div>
      )}
    </form>
  );
}
