import type { Metadata } from "next";
import { Assessment } from "@/components/assessment";

export const metadata: Metadata = {
  title: "Tes sebelum dan sesudah — VetShield 305",
  description:
    "Sepuluh soal singkat untuk mengukur pemahaman sebelum dan sesudah latihan, tanpa data pribadi.",
};

export default function AssessmentPage() {
  return <Assessment />;
}
