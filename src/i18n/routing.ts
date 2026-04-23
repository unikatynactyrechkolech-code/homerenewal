import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en"],
  defaultLocale: "cs",
  pathnames: {
    "/": "/",
    "/chci-prodat": {
      cs: "/chci-prodat",
      en: "/sell",
    },
    "/chci-koupit": {
      cs: "/chci-koupit",
      en: "/buy",
    },
    "/rekonstrukce": {
      cs: "/rekonstrukce",
      en: "/renovations",
    },
    "/o-nas": {
      cs: "/o-nas",
      en: "/about",
    },
    "/kontakt": {
      cs: "/kontakt",
      en: "/contact",
    },
    "/betonove-sterky": {
      cs: "/betonove-sterky",
      en: "/concrete-screeds",
    },
  },
});
