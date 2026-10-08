import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Inter, JetBrains_Mono, Syne } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";
import Background from "@/components/canvas/Background";
import Cursor from "@/components/fx/Cursor";
import Preloader from "@/components/fx/Preloader";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Terminal from "@/components/fx/Terminal";
import { DATA } from "@/data/resume";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["500", "600", "700", "800"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const thai = IBM_Plex_Sans_Thai({ subsets: ["thai"], variable: "--font-thai", weight: ["400", "500", "600"] });

const description = `${DATA.role} at Orange Cap Innovative. ${DATA.motto}.`;

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: { default: `${DATA.name} — ${DATA.role}`, template: `%s | ${DATA.name}` },
  description,
  keywords: [
    "Kittikun Buntoyut",
    "Software Engineer",
    "Full Stack Developer",
    "AI Agent",
    "Next.js",
    "TypeScript",
    "Three.js",
    "Kasetsart University",
    "Thailand Developer",
    "Portfolio",
  ],
  authors: [{ name: DATA.name, url: DATA.url }],
  creator: DATA.name,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: DATA.url,
    title: DATA.name,
    description,
    siteName: DATA.name,
  },
  twitter: { card: "summary_large_image", title: DATA.name, description, creator: "@prokittikun" },
  alternates: { canonical: DATA.url },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${syne.variable} ${jetbrains.variable} ${thai.variable}`}>
      <body className="min-h-dvh font-sans">
        {/* Hide the intro preloader before first paint on repeat visits in this session. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("kb-loaded"))document.documentElement.classList.add("kb-skip")}catch(e){}`,
          }}
        />
        <Script
          id="clarity-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/wi541f6xey";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script");`,
          }}
        />
        <SmoothScroll>
          <Background />
          <Preloader />
          <Nav />
          {children}
          <Terminal />
          <Cursor />
          <div className="grain" aria-hidden />
        </SmoothScroll>
      </body>
    </html>
  );
}
