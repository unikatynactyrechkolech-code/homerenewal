"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PageHero from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { MapPin, Clock } from "lucide-react";

const projectImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
];

export default function ReferencePage() {
  const t = useTranslations("referencesPage");
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    { key: "all", label: t("categories.all") },
    { key: "apartments", label: t("categories.apartments") },
    { key: "houses", label: t("categories.houses") },
    { key: "commercial", label: t("categories.commercial") },
    { key: "concrete", label: t("categories.concrete") },
  ];

  const projects = [
    { ...JSON.parse(JSON.stringify({ title: t("projects.project1.title"), category: "apartments", area: t("projects.project1.area"), duration: t("projects.project1.duration") })), image: projectImages[0] },
    { ...JSON.parse(JSON.stringify({ title: t("projects.project2.title"), category: "houses", area: t("projects.project2.area"), duration: t("projects.project2.duration") })), image: projectImages[1] },
    { ...JSON.parse(JSON.stringify({ title: t("projects.project3.title"), category: "apartments", area: t("projects.project3.area"), duration: t("projects.project3.duration") })), image: projectImages[2] },
    { ...JSON.parse(JSON.stringify({ title: t("projects.project4.title"), category: "concrete", area: t("projects.project4.area"), duration: t("projects.project4.duration") })), image: projectImages[3] },
    { ...JSON.parse(JSON.stringify({ title: t("projects.project5.title"), category: "commercial", area: t("projects.project5.area"), duration: t("projects.project5.duration") })), image: projectImages[4] },
    { ...JSON.parse(JSON.stringify({ title: t("projects.project6.title"), category: "apartments", area: t("projects.project6.area"), duration: t("projects.project6.duration") })), image: projectImages[5] },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <PageHero
        label={t("hero.label")}
        title={t("hero.title")}
        description={t("hero.description")}
        image="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=80"
      />

      {/* Filters */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveFilter(cat.key)}
                  className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                    activeFilter === cat.key
                      ? "bg-primary text-white"
                      : "bg-surface text-muted hover:bg-surface-dark"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <FadeIn key={`${project.title}-${i}`} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-muted text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {project.duration}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
