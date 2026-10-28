import { Geist, Geist_Mono } from "next/font/google";
import { ChromeGate } from "@/components/site/chrome-gate";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteCta } from "@/components/site/site-cta";
import { SpotlightTracker } from "@/components/effects/spotlight-tracker";
import { THEME_SCRIPT } from "@/components/site/theme-toggle";
import { MotionProvider } from "@/components/motion/motion-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationLd, websiteLd } from "@/lib/seo";
import { company } from "@/data/company";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Transformer Components, Protection & Insulation`,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  applicationName: company.name,
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_PK",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1420" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <MotionProvider>
          <TooltipProvider>
            <ChromeGate
              top={<SiteHeader />}
              bottom={
                <>
                  <SiteCta />
                  <SiteFooter />
                  <SpotlightTracker />
                </>
              }
            >
              {children}
            </ChromeGate>
          </TooltipProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
