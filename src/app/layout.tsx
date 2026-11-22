import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "VetShield 305 — pemeriksa pesan penipuan",
  description:
    "Periksa pesan yang mencurigakan, pahami tandanya, dan latih kebiasaan aman. Dibuat untuk veteran, lansia, dan keluarga mereka.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">
        <a href="#main" className="skip-link">
          Langsung ke isi utama
        </a>
        <header className="border-b border-shield-100 bg-paper/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-shield-900 no-underline">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-shield-700 text-lg font-bold text-white"
              >
                V
              </span>
              <span className="font-serif text-xl font-bold tracking-tight">VetShield 305</span>
            </Link>
            <nav aria-label="Navigasi utama">
              <ul className="flex list-none items-center gap-1 text-[15px] font-medium">
                <li>
                  <Link
                    href="/"
                    className="rounded-md px-3 py-2 text-shield-900 no-underline hover:bg-shield-50"
                  >
                    Periksa pesan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/practice"
                    className="rounded-md px-3 py-2 text-shield-900 no-underline hover:bg-shield-50"
                  >
                    Latihan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/assessment"
                    className="rounded-md px-3 py-2 text-shield-900 no-underline hover:bg-shield-50"
                  >
                    Tes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="rounded-md px-3 py-2 text-shield-900 no-underline hover:bg-shield-50"
                  >
                    Data
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main id="main" className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-shield-100 px-4 py-8 text-[14px] text-shield-900/80">
          <div className="mx-auto max-w-5xl space-y-2">
            <p>
              VetShield 305 adalah alat edukasi keamanan, bukan nasihat hukum, medis, atau
              keuangan. Selalu verifikasi lewat saluran resmi.
            </p>
            <p>
              Tidak ada teks pesan mentah yang disimpan. Hanya hash dan cuplikan teredaksi,
              maksimal 7 hari.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
