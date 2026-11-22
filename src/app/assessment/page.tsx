import type { Metadata } from "next";
import { Assessment } from "@/components/assessment";
import { PageMasthead } from "@/components/page-masthead";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Tes sebelum dan sesudah",
  description:
    "Sepuluh soal singkat untuk mengukur pemahaman sebelum dan sesudah latihan, tanpa data pribadi.",
};

export default function AssessmentPage() {
  return (
    <>
      <PageMasthead
        index="05"
        eyebrow="Instrumen pre/post"
        title={
          <>
            Apakah latihan ini <span className="italic text-orange">benar-benar</span>{" "}
            membantu?
          </>
        }
        lede="Sepuluh pesan, dua kali pengukuran. Skor hanya dipakai untuk menilai dampak latihan — bukan untuk menilai Anda, dan bukan untuk membangun profil."
        aside={
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">10 soal</Badge>
            <Badge variant="outline">±3 menit</Badge>
            <Badge variant="outline">Tanpa nama</Badge>
          </div>
        }
      />
      <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14">
        <Assessment />
      </div>
    </>
  );
}
