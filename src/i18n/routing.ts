import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en"],
  defaultLocale: "cs",
  pathnames: {
    "/": "/",
    "/rekonstrukce": {
      cs: "/rekonstrukce",
      en: "/renovations",
    },
    "/reality": {
      cs: "/reality",
      en: "/real-estate",
    },
    "/developeri": {
      cs: "/developeri",
      en: "/developers",
    },
    "/reference": {
      cs: "/reference",
      en: "/references",
    },
    "/betonove-sterky": {
      cs: "/betonove-sterky",
      en: "/concrete-screeds",
    },
    "/kontakt": {
      cs: "/kontakt",
      en: "/contact",
    },
  },
});
