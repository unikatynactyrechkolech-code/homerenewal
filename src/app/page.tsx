import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// Bez middlewaru: kořen přesměrujeme na výchozí jazyk.
// Jazyk si pak uživatel mění přepínačem v hlavičce.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
