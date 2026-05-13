import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Renewal",
  description: "Pémium rekonstrukce, realitní služby a betonové stěrky",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
