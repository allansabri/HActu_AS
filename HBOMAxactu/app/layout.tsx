import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const maxSans = localFont({
  src: [
    {
      path: "../public/font/MaxSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/max_sans_demi.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font/max_sans_demi.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/font/max_sans_bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/font/max_sans_bold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/font/max_sans_bold.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-max-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HBO Max Actu - Actualité HBO, Max et Warner Bros. Discovery",
    template: "%s | HBO Max Actu"
  },
  description:
    "Actualités, coulisses, Top 10 France, productions à venir et bandes-annonces autour de HBO, Max et Warner Bros. Discovery en France.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "HBO Max Actu",
    description: "Le média français dédié à HBO, Max et Warner Bros. Discovery.",
    images: ["/max-reference-bg.png"],
    locale: "fr_FR",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${maxSans.variable} font-sans`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
