import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Data — VetShield 305",
  description: "Statistik pemakaian, akurasi latihan, dan kualitas analisis.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
