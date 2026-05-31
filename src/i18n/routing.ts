import { defineRouting } from "next-intl/routing";

/**
 * Bez middleware — jazyk si uživatel volí sám přepínačem v hlavičce.
 * Obě jazykové mutace používají stejné (české) slugy, takže URL fungují
 * i bez přepisování cest middlewarem: /cs/chci-prodat, /en/chci-prodat …
 */
export const routing = defineRouting({
  locales: ["cs", "en"],
  defaultLocale: "cs",
});
