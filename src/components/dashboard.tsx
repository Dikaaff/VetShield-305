"use client";

import { useCallback, useEffect, useState } from "react";
import type { DashboardSummary } from "@/lib/types";

const WINDOWS: { value: DashboardSummary["window"]; label: string }[] = [
  { value: "7d", label: "7 hari" },
  { value: "30d", label: "30 hari" },
  { value: "all", label: "Semua" },
];

const LABEL_TEXT: Record<string, string> = {
  scam_likely: "Kemungkinan penipuan",
  suspicious: "Perlu hati-hati",
  likely_legitimate: "Tampak wajar",
  insufficient_info: "Belum cukup info",
};

const LABEL_COLOR: Record<string, string> = {
  scam_likely: "bg-alert-high",
  suspicious: "bg-alert-mid",
  likely_legitimate: "bg-alert-low",
  insufficient_info: "bg-shield-300",
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
      const response = await fetch(`/api/dashboard/summary?window=${key}`, {
        cache: "no-store",
      });
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

  return (
    <section aria-labelledby="dashboard-title" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="dashboard-title" className="text-3xl font-bold text-ink sm:text-4xl">
            Data pemakaian dan pembelajaran
          </h1>
          <p className="mt-2 max-w-2xl text-[17px] text-ink/80">
            Angka di bawah berasal dari pemakaian nyata alat ini. Kami tidak menampilkan
            angka ketika datanya belum cukup.
          </p>
        </div>
        <div
          role="group"
          aria-label="Rentang waktu"
          className="flex overflow-hidden rounded-lg border border-shield-200 bg-white"
        >
          {WINDOWS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setWindowKey(option.value)}
              aria-pressed={windowKey === option.value}
              className={`px-4 py-2 text-[15px] font-semibold ${
                windowKey === option.value
                  ? "bg-shield-700 text-white"
                  : "text-shield-900 hover:bg-shield-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p role="status" className="text-lg">Memuat data…</p>}

      {error && (
        <div role="alert" className="rounded-xl border-2 border-alert-high bg-white p-5">
          <p className="font-bold text-alert-high">{error}</p>
          <p className="mt-1 text-[15px] text-ink/80">
            Coba muat ulang. Jika tetap gagal, analitik sedang tidak tersedia; pemeriksa
            pesan tetap bisa dipakai.
          </p>
          <button
            type="button"
            onClick={() => void load(windowKey)}
            className="mt-3 rounded-lg bg-shield-700 px-4 py-2 font-semibold text-white"
          >
            Muat ulang
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="flex flex-wrap items-center gap-3 text-[14px] text-ink/70">
            <span className="rounded-full bg-shield-100 px-3 py-1 font-semibold text-shield-900">
              Sumber: {data.source === "snowflake" ? "Snowflake" : data.source === "local" ? "penyimpanan lokal" : "memori"}
            </span>
            <span>Diperbarui {new Date(data.generatedAt).toLocaleString("id-ID")}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Pesan diperiksa", value: data.totals.analyses },
              { label: "Jawaban latihan", value: data.totals.practiceAnswers },
              {
                label: "Tingkat menolak menilai",
                value: pct(data.reliability.refusalRate),
                note: `n=${data.reliability.n}`,
              },
              {
                label: "Latensi median",
                value:
                  data.reliability.medianLatencyMs === null
                    ? "—"
                    : `${data.reliability.medianLatencyMs} ms`,
              },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-shield-100 bg-white p-5">
                <p className="text-[14px] font-medium text-ink/70">{card.label}</p>
                <p className="mt-1 font-serif text-3xl font-bold text-shield-900">
                  {card.value}
                </p>
                {card.note && <p className="text-[13px] text-ink/60">{card.note}</p>}
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-shield-100 bg-white p-5">
              <h2 className="text-xl font-bold text-ink">Sebaran hasil pemeriksaan</h2>
              <ul className="mt-4 space-y-3">
                {data.labels.map((row) => (
                  <li key={row.label}>
                    <div className="flex justify-between text-[15px]">
                      <span>{LABEL_TEXT[row.label] ?? row.label}</span>
                      <span className="font-semibold">{row.count}</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-shield-50">
                      <div
                        className={`h-full rounded-full ${LABEL_COLOR[row.label] ?? "bg-shield-500"}`}
                        style={{ width: `${Math.round((row.count / maxLabel) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-shield-100 bg-white p-5">
              <h2 className="text-xl font-bold text-ink">Kategori pesan terbanyak</h2>
              {data.categories.length === 0 ? (
                <p className="mt-3 text-[16px] text-ink/70">
                  Belum ada pesan yang diperiksa pada rentang ini.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-shield-50">
                  {data.categories.slice(0, 6).map((row) => (
                    <li key={row.category} className="flex justify-between py-2 text-[16px]">
                      <span>{row.category}</span>
                      <span className="font-semibold">{row.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-shield-100 bg-white p-5">
            <h2 className="text-xl font-bold text-ink">Akurasi latihan per kategori</h2>
            {data.practice.length === 0 ? (
              <p className="mt-3 text-[16px] text-ink/70">
                Belum ada jawaban latihan. Coba halaman Latihan untuk mulai.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-[16px]">
                  <thead>
                    <tr className="border-b border-shield-100 text-[14px] uppercase tracking-wide text-ink/60">
                      <th className="py-2 pr-2 font-semibold">Kategori</th>
                      <th className="py-2 pr-2 font-semibold">Jawaban</th>
                      <th className="py-2 pr-2 font-semibold">Benar</th>
                      <th className="py-2 font-semibold">Akurasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.practice.map((row) => {
                      const accuracy = row.attempts === 0 ? null : row.correct / row.attempts;
                      const indicative = row.attempts < 5;
                      return (
                        <tr key={row.category} className="border-b border-shield-50">
                          <td className="py-2 pr-2">{row.category}</td>
                          <td className="py-2 pr-2">{row.attempts}</td>
                          <td className="py-2 pr-2">{row.correct}</td>
                          <td className="py-2">
                            {accuracy === null
                              ? "—"
                              : `${Math.round(accuracy * 100)}%${indicative ? " (indikatif, n<5)" : ""}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-shield-100 bg-white p-5">
            <h2 className="text-xl font-bold text-ink">Perubahan sebelum dan sesudah latihan</h2>
            {data.learning.n < 20 ? (
              <p className="mt-2 text-[16px] leading-relaxed text-ink/80">
                Belum cukup data untuk menyimpulkan perubahan. Kami butuh minimal 20
                responden yang mengisi tes sebelum dan sesudah latihan; saat ini{" "}
                <strong>n={data.learning.n}</strong>. Kami tidak menampilkan klaim
                efektivitas dari sampel kecil.
              </p>
            ) : (
              <div className="mt-2 grid gap-4 sm:grid-cols-3">
                <p>Sebelum: <strong>{Math.round(data.learning.pre * 100)}%</strong></p>
                <p>Sesudah: <strong>{Math.round(data.learning.post * 100)}%</strong></p>
                <p>
                  Selisih: <strong>{data.learning.deltaPct === null ? "—" : `${data.learning.deltaPct} poin`}</strong>{" "}
                  (n={data.learning.n})
                </p>
              </div>
            )}
          </div>

          <p className="text-[14px] leading-relaxed text-ink/65">
            Catatan kejujuran: data ini berasal dari pemakaian alat, bukan uji acak
            terkontrol. Pesan yang diperiksa pengguna bisa berbeda dari populasi umum, dan
            sebagian pemakaian terjadi saat demo.
          </p>
        </>
      )}
    </section>
  );
}
