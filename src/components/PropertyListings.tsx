"use client";

import { useTranslations } from "next-intl";
import { Home } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export default function PropertyListings() {
  const t = useTranslations("listings");

  return (
    <FadeIn>
      <div className="bg-white border border-border/50 rounded-2xl p-12 sm:p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <Home className="w-7 h-7 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-3">
          {t("empty.title")}
        </h3>
        <p className="text-muted max-w-xl mx-auto leading-relaxed">
          {t("empty.description")}
        </p>
      </div>
    </FadeIn>
  );
}
