import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";
import { PageMasthead } from "@/components/page-masthead";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Data",
  description: "Statistik pemakaian, akurasi latihan, dan kualitas analisis.",
};

export default function DashboardPage() {
  return (
    <>
      <PageMasthead
        index="04"
        eyebrow="Transparansi"
        title={
          <>
            Angka yang kami berani <span className="italic text-orange">tunjukkan.</span>
          </>
        }
        lede="Termasuk saat datanya belum cukup. Panel yang tidak layak dipercaya akan mengatakan demikian, bukan menampilkan nol yang menyamar sebagai bukti."
        aside={
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Sumber: pemakaian alat</Badge>
            <Badge variant="outline">Bukan studi lapangan</Badge>
          </div>
        }
      />
      <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14">
        <Dashboard />
      </div>
    </>
  );
}
