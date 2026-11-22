import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Practice } from "@/components/practice";
import { PageMasthead } from "@/components/page-masthead";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Latihan",
  description: "Latihan singkat mengenali pesan penipuan, dengan umpan balik yang jelas.",
};

export default function PracticePage() {
  return (
    <>
      <PageMasthead
        index="03"
        eyebrow="Latihan adaptif"
        title={
          <>
            Kenali polanya. Jangan hafalkan{" "}
            <span className="italic text-orange">jawabannya.</span>
          </>
        }
        lede="Satu pesan setiap kali. Setiap jawaban memberi aturan yang bisa dipakai lagi, dan tingkat kesulitan menyesuaikan diri."
        aside={
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">2–3 menit</Badge>
            <Badge variant="outline">Tanpa skor yang memalukan</Badge>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-forest-700 underline underline-offset-4"
            >
              Ukur sebelum & sesudah <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        }
      />
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16">
        <Practice />
      </div>
    </>
  );
}
