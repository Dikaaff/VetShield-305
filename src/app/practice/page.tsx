import type { Metadata } from "next";
import { Practice } from "@/components/practice";

export const metadata: Metadata = {
  title: "Latihan — VetShield 305",
  description: "Latihan singkat mengenali pesan penipuan, dengan umpan balik yang jelas.",
};

export default function PracticePage() {
  return <Practice />;
}
