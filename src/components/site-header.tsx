"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Periksa" },
  { href: "/practice", label: "Latihan" },
  { href: "/assessment", label: "Tes" },
  { href: "/dashboard", label: "Data" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[80px] max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
        <Brand />

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-xl border border-line bg-paper/90 p-1 shadow-sm">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-4 py-2 text-[13px] font-semibold no-underline transition-colors",
                      active
                        ? "bg-forest text-paper"
                        : "text-forest/70 hover:bg-forest-50 hover:text-forest-900",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/#analyzer">
              Periksa pesan
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper text-forest md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "overflow-hidden border-t border-forest/10 bg-cream transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav aria-label="Navigasi seluler" className="px-5 py-5">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-line bg-paper px-3 py-2">
            <span className="text-[13px] font-semibold text-forest">Mode tampilan</span>
            <ThemeToggle />
          </div>
          <ul className="space-y-1">
            {NAV.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 rounded-xl px-2 py-3 no-underline hover:bg-forest-50"
                >
                  <span className="font-mono text-[11px] text-forest/60">0{index + 1}</span>
                  <span className="font-display text-2xl font-semibold text-forest-900">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-4 w-full" size="lg">
            <Link href="/#analyzer" onClick={() => setOpen(false)}>
              Periksa pesan sekarang
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
