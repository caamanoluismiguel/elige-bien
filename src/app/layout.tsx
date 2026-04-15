import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { SITE_CONFIG } from "@/lib/campus-config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.brand} XP`,
    template: `%s | ${SITE_CONFIG.brand} XP`,
  },
  description:
    "Dos tests. Descubre como piensas y que tipo de arquitecto serias.",
  metadataBase: new URL(SITE_CONFIG.domain),
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: `${SITE_CONFIG.brand} XP`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
