"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function KontaktPage() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("title")}
        description={t("description")}
      />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <FadeIn>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        {t("info.address")}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <a
                        href={`tel:${t("info.phone")}`}
                        className="font-semibold text-primary hover:text-accent transition-colors"
                      >
                        {t("info.phone")}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <a
                        href={`mailto:${t("info.email")}`}
                        className="font-semibold text-primary hover:text-accent transition-colors"
                      >
                        {t("info.email")}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">
                        {t("info.hours")}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.2}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        {t("form.name")}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3.5 bg-surface rounded-xl border border-border/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        {t("form.email")}
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3.5 bg-surface rounded-xl border border-border/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        {t("form.phone")}
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3.5 bg-surface rounded-xl border border-border/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        {t("form.service")}
                      </label>
                      <select className="w-full px-4 py-3.5 bg-surface rounded-xl border border-border/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm text-muted">
                        <option value="">{t("form.selectService")}</option>
                        <option value="renovation">
                          {t("form.serviceOptions.renovation")}
                        </option>
                        <option value="realEstate">
                          {t("form.serviceOptions.realEstate")}
                        </option>
                        <option value="concrete">
                          {t("form.serviceOptions.concrete")}
                        </option>
                        <option value="developer">
                          {t("form.serviceOptions.developer")}
                        </option>
                        <option value="other">
                          {t("form.serviceOptions.other")}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      {t("form.message")}
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full px-4 py-3.5 bg-surface rounded-xl border border-border/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white px-10 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-300"
                  >
                    {t("form.submit")}
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {submitted && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {t("form.success")}
                      </span>
                    </div>
                  )}
                </form>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
