import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Quoi sur HBO Max - Actualité HBO, Max et Warner Bros. Discovery",
    template: "%s | Quoi sur HBO Max"
  },
  description:
    "Actualités, coulisses, Top 10 France, productions à venir et bandes-annonces autour de HBO, Max et Warner Bros. Discovery en France.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Quoi sur HBO Max",
    description: "Le média français dédié à HBO, Max et Warner Bros. Discovery.",
    images: ["/max-reference-bg.png"],
    locale: "fr_FR",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
