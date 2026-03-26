import type { Metadata, Viewport } from "next";
import { Space_Mono, Press_Start_2P, Syne, DM_Sans } from "next/font/google";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// next/font automatically:
//  • Self-hosts fonts (zero network round-trips to Google)
//  • Inlines @font-face in <head> (no render-blocking <link>)
//  • Sets display:swap so text shows instantly in fallback font
//  • Generates size-adjust to prevent CLS on font swap

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  preload: true,   // preloaded — used in Navbar and code snippets above fold
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
  preload: false,  // only used in logo pixel text — not above fold critical
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
  preload: true,   // used in hero headline — above fold
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,  // body font, non-critical for initial paint
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Rishabh Tiwari — Full Stack Developer",
  description:
    "Full Stack Developer specialising in React, Next.js and Node.js. Building fast, scalable and beautiful web applications.",
  keywords: [
    "Rishabh Tiwari",
    "Full Stack Developer",
    "React Developer",
    "Next.js",
    "Node.js",
    "Portfolio",
    "Web Developer India",
  ],
  authors: [{ name: "Rishabh Tiwari" }],
  creator: "Rishabh Tiwari",

  // Open Graph (for link previews on WhatsApp, Slack, LinkedIn etc.)
  openGraph: {
    title: "Rishabh Tiwari — Full Stack Developer",
    description: "Building fast, scalable and beautiful web applications.",
    url: "https://rishabhdev.com",   // ← replace with your domain
    siteName: "Rishabh Tiwari",
    locale: "en_US",
    type: "website",
  },

  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "Rishabh Tiwari — Full Stack Developer",
    description: "Building fast, scalable and beautiful web applications.",
    creator: "@rishabh",            // ← replace with your handle
  },

  // Tell crawlers not to translate the page
  other: {
    "google": "notranslate",
  },

  // Canonical URL
  alternates: {
    canonical: "https://rishabhdev.com",  // ← replace with your domain
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ─── Viewport ─────────────────────────────────────────────────────────────────
// Separated from metadata as required by Next.js 14+
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // Accent colour for browser chrome on mobile (Android)
  themeColor: "#0a0a0c",
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Font CSS variables available everywhere via var(--font-*)
      className={`
        ${spaceMono.variable}
        ${pressStart.variable}
        ${syne.variable}
        ${dmSans.variable}
      `}
    >
      <head>
        {/*
          DNS prefetch for Spline CDN — browser starts DNS lookup
          before the lazy-loaded Spline component requests the scene file.
          This shaves ~100-300ms off the Spline load time.
        */}
        <link rel="dns-prefetch" href="//prod.spline.design" />
        <link rel="preconnect" href="https://prod.spline.design" />
      </head>
      <body
        className="bg-bg-primary text-text-primary antialiased"
        // Prevent FOUC flash on slow connections
        style={{ visibility: "visible" }}
      >
        {children}
      </body>
    </html>
  );
}