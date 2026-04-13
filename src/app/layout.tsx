import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Renewal",
  description: "Prémiové rekonstrukce, realitní služby a betonové stěrky",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
