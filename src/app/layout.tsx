import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vetshield-305.vercel.app"),
  title: {
    default: "VetShield 305 — periksa pesan penipuan tanpa panik",
    template: "%s — VetShield 305",
  },
  description:
    "Periksa pesan yang mencurigakan, pahami tandanya, dan latih kebiasaan aman. Dibuat untuk veteran, lansia, dan keluarga mereka.",
  openGraph: {
    title: "VetShield 305",
    description:
      "Berhenti, periksa, dan bertindak lewat saluran resmi. Tiga langkah aman, tanpa kepastian palsu.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const dark = localStorage.getItem('vetshield-theme-v2') === 'dark'; document.documentElement.classList.toggle('dark', dark); document.documentElement.style.colorScheme = dark ? 'dark' : 'light'; } catch {} })();`,
          }}
        />
        <a href="#main" className="skip-link">
          Langsung ke isi utama
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
