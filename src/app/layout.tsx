import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { portfolio } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-plex", display: "swap" });

const title = `${portfolio.name} | Full-Stack Developer`;
const description = "Full-Stack Developer and Backend Engineer. A selection of work in web applications, backend services, and real-time collaboration by Abid Farhan Abdullah.";
const siteUrl = portfolio.siteUrl ? new URL(portfolio.siteUrl) : undefined;

export const metadata: Metadata = {
  title,
  description,
  ...(siteUrl && {
    metadataBase: siteUrl,
    alternates: { canonical: "/" },
  }),
  authors: [{ name: portfolio.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: `${portfolio.name} | Portfolio`,
    title,
    description,
    ...(siteUrl && { url: siteUrl }),
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${mono.variable}`}><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
