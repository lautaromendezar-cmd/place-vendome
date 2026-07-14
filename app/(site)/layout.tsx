import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { getSiteContent } from "@/lib/sanity/content";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();

  return {
    // TODO: reemplazar por el dominio final cuando esté (hoy: dominio de Vercel)
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://place-vendome.vercel.app",
    ),
    title: site.meta.title,
    description: site.meta.description,
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: site.brand.name,
      title: site.meta.title,
      description: site.meta.description,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${site.brand.name} — Liniers, Buenos Aires`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.meta.title,
      description: site.meta.description,
      images: ["/og-image.jpg"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${jost.variable}`}>
        {children}
      </body>
    </html>
  );
}
