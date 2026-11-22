"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, ArrowUpRight, BarChart3, Clock3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { DashboardSummary } from "@/lib/types";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const LABEL_TEXT: Record<string, string> = {
  scam_likely: "Kemungkinan penipuan",
  suspicious: "Perlu hati-hati",
  likely_legitimate: "Tampak wajar",
  insufficient_info: "Belum cukup info",
};

const LABEL_COLOR: Record<string, string> = {
  scam_likely: "bg-[#8F241F]",
  suspicious: "bg-[#B45309]",
  likely_legitimate: "bg-forest-500",
  insufficient_info: "bg-forest-200",
};

const CATEGORY_LABEL: Record<string, string> = {
  bank: "Bank & pembayaran",
  benefits: "Bantuan pemerintah",
  job: "Tawaran kerja",
  delivery: "Paket & pengiriman",
  marketplace: "Jual beli online",
  romance: "Hubungan online",
  tech_support: "Dukungan teknis",
  investment: "Investasi",
  tax: "Pajak",
  family_emergency: "Keluarga darurat",
  account_security: "Keamanan akun",
  prize: "Hadiah & undian",
  other: "Umum",
};

function pct(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

export function Dashboard() {
  const [windowKey, setWindowKey] = useState<DashboardSummary["window"]>("7d");
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (key: DashboardSummary["window"]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/summary?window=${key}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Data belum bisa dimuat.");
      setData((await response.json()) as DashboardSummary);
    } catch (caught) {
      setData(null);
      setError(caught instanceof Error ? caught.message : "Data belum bisa dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(windowKey);
  }, [load, windowKey]);

  const maxLabel = data ? Math.max(1, ...data.labels.map((row) => row.count)) : 1;
  const maxCategory = data ? Math.max(1, ...data.categories.map((row) => row.count)) : 1;
  const maxPractice = data ? Math.max(1, ...data.practice.map((row) => row.attempts)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={windowKey} onValueChange={(value) => setWindowKey(value as DashboardSummary["window"])}>
          <TabsList aria-label="Rentang waktu">
            <TabsTrigger value="7d">7 hari</TabsTrigger>
            <TabsTrigger value="30d">30 hari</TabsTrigger>
            <TabsTrigger value="all">Semua</TabsTrigger>
          </TabsList>
        </Tabs>
        {data ? (
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-forest/65">
            <Badge variant={data.source === "snowflake" ? "sage" : "muted"}>
              {data.source === "snowflake"
                ? "Snowflake"
                : data.source === "local"
                  ? "Penyimpanan lokal"
                  : "Memori proses"}
            </Badge>
            <span className="font-mono">
              {new Date(data.generatedAt).toLocaleString("id-ID")}
            </span>
          </div>
        ) : null}
      </div>

      {loading && (
        <div role="status" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl border border-line bg-paper" />
          ))}
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-3xl border-2 border-alert-high bg-paper p-5">
          <p className="font-semibold text-alert-high">{error}</p>
          <p className="mt-1 text-[14px] text-forest/65">
            Analitik sedang tidak tersedia; pemeriksa pesan tetap bisa dipakai.
          </p>
          <Button variant="outline" className="mt-3" onClick={() => void load(windowKey)}>
            Muat ulang
          </Button>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-forest-900 p-5 text-cream">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cream/65">
                Pesan diperiksa
              </p>
              <p className="mt-2 font-display text-[44px] font-semibold leading-none">
                <NumberTicker value={data.totals.analyses} />
              </p>
              <p className="mt-2 text-[12px] text-cream/65">pada rentang {windowKey}</p>
            </div>
            <div className="rounded-3xl border border-line bg-paper p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">
                Jawaban latihan
              </p>
              <p className="mt-2 font-display text-[44px] font-semibold leading-none text-forest-900">
                <NumberTicker value={data.totals.practiceAnswers} />
              </p>
              <p className="mt-2 text-[12px] text-forest/65">tanpa identitas peserta</p>
            </div>
            <div className="rounded-3xl border border-line bg-paper p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">
                Menolak menilai
              </p>
              <p className="mt-2 font-display text-[44px] font-semibold leading-none text-forest-900">
                {pct(data.reliability.refusalRate)}
              </p>
              <p className="mt-2 text-[12px] text-forest/65">n={data.reliability.n} · bukti kurang</p>
            </div>
            <div className="rounded-3xl border border-line bg-paper p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">
                Latensi median
              </p>
              <p className="mt-2 font-display text-[44px] font-semibold leading-none text-forest-900">
                {data.reliability.medianLatencyMs === null ? "—" : data.reliability.medianLatencyMs}
                <span className="text-lg text-forest/70"> ms</span>
              </p>
              <p className="mt-2 text-[12px] text-forest/65">tanpa model eksternal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="rounded-3xl border border-line bg-paper p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-forest-900">
                  Sebaran hasil
                </h2>
                <BarChart3 className="h-4 w-4 text-forest/65" />
              </div>
              <ul className="mt-5 space-y-3.5">
                {data.labels.map((row) => (
                  <li key={row.label}>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-forest/75">{LABEL_TEXT[row.label] ?? row.label}</span>
                      <span className="font-mono font-semibold text-forest-900">{row.count}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-forest/5">
                      <div
                        className={cn("h-full rounded-full", LABEL_COLOR[row.label] ?? "bg-forest-500")}
                        style={{ width: `${Math.round((row.count / maxLabel) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-line bg-paper p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-forest-900">
                  Kategori terbanyak
                </h2>
                <Activity className="h-4 w-4 text-forest/65" />
              </div>
              {data.categories.length === 0 ? (
                <p className="mt-4 text-[14px] text-forest/70">
                  Belum ada pesan pada rentang ini.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-line">
                  {data.categories.slice(0, 6).map((row, index) => (
                    <li key={row.category} className="flex items-center gap-4 py-2.5">
                      <span className="font-mono text-[10px] text-forest/65">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[14px] text-forest/75">
                        {CATEGORY_LABEL[row.category] ?? row.category}
                      </span>
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-forest/5">
                        <span
                          className="block h-full rounded-full bg-forest-500"
                          style={{ width: `${Math.round((row.count / maxCategory) * 100)}%` }}
                        />
                      </span>
                      <span className="w-8 text-right font-mono text-[13px] font-semibold text-forest-900">
                        {row.count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="rounded-3xl border border-line bg-paper p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-forest-900">
                Akurasi latihan per kategori
              </h2>
              <Badge variant="outline">n&lt;5 ditandai indikatif</Badge>
            </div>
            {data.practice.length === 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-[14px] text-forest/70">Belum ada jawaban latihan.</p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/practice">
                    Mulai latihan <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.practice.map((row) => {
                  const accuracy = row.attempts === 0 ? 0 : row.correct / row.attempts;
                  return (
                    <li key={row.category}>
                      <div className="flex items-center justify-between gap-2 text-[13px]">
                        <span className="text-forest/75">
                          {CATEGORY_LABEL[row.category] ?? row.category}
                        </span>
                        <span className="font-mono text-forest/65">
                          {row.correct}/{row.attempts}
                          {row.attempts < 5 ? " · indikatif" : ""}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress value={Math.round(accuracy * 100)} className="h-1.5" />
                        <span className="w-10 text-right font-mono text-[12px] font-semibold text-forest-900">
                          {Math.round(accuracy * 100)}%
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-line bg-paper p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-forest-900">
                  Sebelum & sesudah
                </h2>
                <ShieldCheck className="h-4 w-4 text-forest/65" />
              </div>
              {data.learning.n < 20 ? (
                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[14px] text-forest/70">
                      Butuh 20 responden berpasangan
                    </p>
                    <p className="font-mono text-[13px] font-semibold text-forest-900">
                      {data.learning.n}/20
                    </p>
                  </div>
                  <Progress value={(data.learning.n / 20) * 100} className="mt-2" />
                  <p className="mt-3 text-[13px] leading-relaxed text-forest/70">
                    Kami tidak menampilkan klaim efektivitas dari sampel kecil. Data demo
                    bukan studi lapangan.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/assessment">
                      Isi tes pre/post <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="font-display text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-none text-forest-900">
                    {data.learning.deltaPct !== null && data.learning.deltaPct > 0 ? "+" : ""}
                    {data.learning.deltaPct ?? 0}
                    <span className="text-xl text-forest/60"> poin</span>
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] text-forest/60">
                    <p>Sebelum: <strong className="text-forest-900">{Math.round(data.learning.pre)}%</strong></p>
                    <p>Sesudah: <strong className="text-forest-900">{Math.round(data.learning.post)}%</strong></p>
                  </div>
                  <p className="mt-3 text-[12.5px] text-forest/65">n={data.learning.n} responden berpasangan</p>
                </div>
              )}
            </section>

            <section className="rounded-3xl bg-sage/70 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-forest-900">
                  Kualitas sinyal
                </h2>
                <Clock3 className="h-4 w-4 text-forest/70" />
              </div>
              <dl className="mt-4 space-y-3 text-[13.5px]">
                <div className="flex justify-between border-b border-forest/10 pb-2">
                  <dt className="text-forest/60">Menolak menilai</dt>
                  <dd className="font-semibold text-forest-900">{pct(data.reliability.refusalRate)}</dd>
                </div>
                <div className="flex justify-between border-b border-forest/10 pb-2">
                  <dt className="text-forest/60">Mode terbatas</dt>
                  <dd className="font-semibold text-forest-900">{pct(data.reliability.degradedRate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-forest/60">Latensi median</dt>
                  <dd className="font-semibold text-forest-900">
                    {data.reliability.medianLatencyMs ?? "—"} ms
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-[12px] leading-relaxed text-forest/70">
                {data.reliability.n} pemeriksaan pada rentang ini. Refusal yang tinggi
                bukan kegagalan; itu tanda alat menahan diri saat bukti kurang.
              </p>
            </section>
          </div>

          <p className="text-[12px] leading-relaxed text-forest/60">
            Catatan kejujuran: data ini berasal dari pemakaian alat, bukan uji acak
            terkontrol. Pesan yang diperiksa pengguna bisa berbeda dari populasi umum, dan
            sebagian pemakaian terjadi saat demo.
          </p>
        </>
      )}
    </div>
  );
}
