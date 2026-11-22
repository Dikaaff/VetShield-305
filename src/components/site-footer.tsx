import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

const LINKS: {
  title: string;
  items: { href: string; label: string; external?: boolean }[];
}[] = [
  {
    title: "Produk",
    items: [
      { href: "/#analyzer", label: "Pemeriksa pesan" },
      { href: "/practice", label: "Latihan adaptif" },
      { href: "/assessment", label: "Tes pre/post" },
      { href: "/dashboard", label: "Dashboard data" },
    ],
  },
  {
    title: "Sumber",
    items: [
      { href: "https://github.com/Dikaaff/VetShield-305", label: "Repositori", external: true },
      { href: "/api/health", label: "Status layanan", external: true },
      { href: "https://github.com/Dikaaff/VetShield-305/blob/main/docs/07-knowledge.md", label: "Metodologi", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-forest-900 text-cream">
      <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
        <div className="grid grid-cols-1 gap-10 border-b border-cream/15 pb-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="eyebrow text-cream/65">Satu pesan. Tiga langkah.</p>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.98]">
              Jangan putuskan <span className="italic text-lime">sendirian.</span>
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-cream/65">
              Tempel pesan yang meragukan. Anda akan mendapat alasan yang bisa dibaca,
              tiga tindakan aman, dan sumber yang bisa diperiksa.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Button asChild size="lg" variant="accent" className="group">
              <Link href="/#analyzer">
                Mulai pemeriksaan
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
            <p className="text-[13px] text-cream/65">Gratis · tanpa akun · tanpa teks mentah disimpan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Brand inverted />
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-cream/70">
              Alat edukasi keamanan untuk veteran, lansia, dan keluarga mereka. Bukan
              nasihat hukum, medis, atau keuangan.
            </p>
            <p className="mt-4 max-w-sm rounded-xl border border-cream/15 bg-cream/5 p-3 text-[13px] leading-relaxed text-cream/60">
              Tidak ada teks pesan mentah yang disimpan. Hanya hash dan cuplikan yang
              disamarkan, maksimal 7 hari.
            </p>
          </div>

          {LINKS.map((group) => (
            <div key={group.title}>
              <p className="eyebrow text-cream/60">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer noopener" : undefined}
                        className="link-underline text-[15px] text-cream/75 no-underline hover:text-cream"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="link-underline text-[15px] text-cream/75 no-underline hover:text-cream"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-cream/15 pt-6 text-[13px] text-cream/60 sm:flex-row sm:items-center">
          <p>© 2026 VetShield 305. Dibuat untuk 305 Veterans Hackathon.</p>
          <p>
            Dikembangkan oleh{" "}
            <a
              href="https://github.com/Dikaaff"
              target="_blank"
              rel="noreferrer noopener"
              className="text-cream/70 underline underline-offset-4"
            >
              Dikaaff
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
