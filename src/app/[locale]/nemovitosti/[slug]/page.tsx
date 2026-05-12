import { notFound } from "next/navigation";
import Link from "next/link";
import { getPropertyBySlugOrId, listProperties } from "@/lib/properties";
import { listOptions } from "@/lib/options";
import PropertyDetail from "@/components/PropertyDetail";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const props = await listProperties();
  return props.flatMap((p) => {
    const slugs = [];
    if (p.slug) slugs.push({ slug: p.slug });
    slugs.push({ slug: p.id });
    return slugs;
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const p = await getPropertyBySlugOrId(slug);
  if (!p) return { title: "Nemovitost nenalezena" };
  return {
    title: `${p.title} | Home Renewal`,
    description: p.description ?? `${p.title}${p.location ? `, ${p.location}` : ""}`,
    openGraph: {
      title: p.title,
      description: p.description ?? "",
      images: p.cover_image ? [{ url: p.cover_image }] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [property, allOptions] = await Promise.all([
    getPropertyBySlugOrId(slug),
    listOptions(),
  ]);

  if (!property) notFound();

  return <PropertyDetail property={property} allOptions={allOptions} locale={locale} />;
}
