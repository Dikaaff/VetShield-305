"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type Phase = "pre" | "post";

interface Question {
  id: string;
  text: string;
  answer: "scam" | "legit";
  why: string;
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Kode verifikasi Anda 482913. Jangan bagikan kode ini kepada siapa pun. Jika Anda tidak meminta kode ini, abaikan pesan ini.",
    answer: "legit",
    why: "Pesan OTP asli justru melarang Anda membagikan kode.",
  },
  {
    id: "q2",
    text: "PENTING: akun Anda akan diblokir hari ini. Verifikasi di secure-login.example.com atau kirim kode OTP Anda ke 0812-555-0142.",
    answer: "scam",
    why: "Bank tidak meminta OTP lewat pesan dan tidak mengancam blokir lewat tautan.",
  },
  {
    id: "q3",
    text: "Your VA benefit payment is on hold. Confirm your identity at bit.ly/verify-va within 24 hours.",
    answer: "scam",
    why: "Status bantuan dicek di akun resmi, bukan lewat tautan pendek.",
  },
  {
    id: "q4",
    text: "Pesanan #ORD-2210 telah dikirim. Lacak lewat aplikasi resmi kami. Tidak ada biaya tambahan.",
    answer: "legit",
    why: "Notifikasi pengiriman biasa tanpa permintaan data atau biaya.",
  },
  {
    id: "q5",
    text: "Halo, saya sudah transfer Rp4.500.000, kelebihan Rp500.000. Mohon kembalikan ke rekening ini. Lanjut di WhatsApp ya.",
    answer: "scam",
    why: "Kelebihan transfer dan pindah ke chat pribadi adalah modus umum.",
  },
  {
    id: "q6",
    text: "Terima kasih atas lamaran Anda. Jadwal wawancara Senin pukul 9 lewat tautan resmi di akun pelamar Anda.",
    answer: "legit",
    why: "Wawancara lewat akun pelamar resmi, tanpa permintaan uang.",
  },
  {
    id: "q7",
    text: "Bu, ini cucu Anda, saya ganti nomor. Kirim uang tunai Rp12.000.000 sekarang, jangan telepon nomor lama dulu.",
    answer: "scam",
    why: "Nomor baru plus permintaan uang dan larangan menelepon adalah pola penipuan.",
  },
  {
    id: "q8",
    text: "Remote job, $300 daily pay, no experience. Send a $120 registration fee to start today.",
    answer: "scam",
    why: "Pekerjaan asli tidak memungut biaya pendaftaran.",
  },
  {
    id: "q9",
    text: "A charge of $84 was made on your card. If this was not you, call the number on the back of your card. We will never ask for your PIN.",
    answer: "legit",
    why: "Pesan resmi mengarah ke nomor di belakang kartu dan menegaskan tidak meminta PIN.",
  },
  {
    id: "q10",
    text: "Investasi kripto dijamin untung 30% per bulan. Transfer Rp2.750.000 ke dompet USDT kami hari ini.",
    answer: "scam",
    why: "Keuntungan yang dijamin dan transfer kripto adalah tanda penipuan.",
  },
];

export function Assessment() {
  const [phase, setPhase] = useState<Phase>("pre");
  const [answers, setAnswers] = useState<Record<string, "scam" | "legit">>({});
  const [submitted, setSubmitted] = useState<{ score: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState(false);

  const answered = Object.keys(answers).length;
  const score = useMemo(
    () =>
      Math.round(
        (QUESTIONS.filter((question) => answers[question.id] === question.answer).length /
          QUESTIONS.length) *
          100,
      ),
    [answers],
  );

  async function submit() {
    if (answered < QUESTIONS.length) {
      setError("Jawab semua sepuluh soal sebelum mengirim.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/prepost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase, scorePct: score }),
      });
      if (!response.ok) throw new Error("Skor belum bisa dicatat. Coba lagi.");
      setSubmitted({ score });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Skor belum bisa dicatat.");
    } finally {
      setSubmitting(false);
    }
  }

  function switchPhase(next: Phase) {
    setPhase(next);
    setAnswers({});
    setSubmitted(null);
    setReview(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="inline-flex w-full rounded-full border border-forest/10 bg-forest-50 p-1 sm:w-auto">
          {(
            [
              ["pre", "Sebelum latihan"],
              ["post", "Sesudah latihan"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => switchPhase(value)}
              aria-pressed={phase === value}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-[13px] font-semibold transition sm:flex-none",
                phase === value
                  ? "bg-forest text-paper shadow-sm"
                  : "text-forest/60 hover:text-forest-900",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center gap-3 sm:max-w-xs">
          <Progress value={(answered / QUESTIONS.length) * 100} className="h-1.5" />
          <span className="whitespace-nowrap font-mono text-[11px] text-forest/65">
            {answered}/{QUESTIONS.length}
          </span>
        </div>
      </div>

      {submitted ? (
        <section aria-live="polite" className="overflow-hidden rounded-3xl border border-line bg-paper shadow-card">
          <div className="grid grid-cols-1 gap-6 bg-forest-900 p-6 text-cream sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream/65">
                Tes {phase === "pre" ? "sebelum" : "sesudah"} latihan tercatat
              </p>
              <h2 className="mt-3 max-w-xl font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-tight">
                {phase === "pre"
                  ? "Sekarang coba satu sesi latihan singkat."
                  : "Terima kasih. Skor ini masuk ke panel pembelajaran."}
              </h2>
            </div>
            <p className="font-display text-[clamp(4rem,10vw,6rem)] font-semibold leading-none text-lime">
              {submitted.score}
              <span className="text-2xl text-cream/60">%</span>
            </p>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              {phase === "pre" ? (
                <Button asChild size="lg">
                  <Link href="/practice">
                    Mulai latihan <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Lihat dashboard <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => switchPhase(phase === "pre" ? "post" : "pre")}
              >
                {phase === "pre" ? "Isi tes sesudah latihan" : "Isi tes sebelum latihan"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setReview((current) => !current)}
                aria-expanded={review}
              >
                {review ? "Sembunyikan pembahasan" : "Lihat pembahasan"}
                <ChevronDown className={cn("h-4 w-4 transition", review && "rotate-180")} />
              </Button>
            </div>

            {review && (
              <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {QUESTIONS.map((question, index) => {
                  const correct = answers[question.id] === question.answer;
                  return (
                    <li key={question.id} className="rounded-2xl border border-line p-4">
                      <p className="text-[13px] font-semibold text-forest-900">
                        <span className="font-mono text-[10px] text-forest/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>{" "}
                        {correct ? "Benar" : "Belum tepat"} —{" "}
                        {question.answer === "scam" ? "penipuan" : "wajar"}
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-forest/65">
                        {question.why}
                      </p>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {QUESTIONS.map((question, index) => (
              <fieldset
                key={question.id}
                className="flex flex-col rounded-3xl border border-line bg-paper p-5 sm:p-6"
              >
                <legend className="sr-only">Soal {index + 1}</legend>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-forest/65">
                    Pilih satu jawaban
                  </span>
                </div>
                <p className="mt-4 flex-1 text-[16px] leading-relaxed text-forest-900">
                  {question.text}
                </p>
                <RadioGroup
                  value={answers[question.id]}
                  onValueChange={(value) =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: value as "scam" | "legit",
                    }))
                  }
                  className="mt-4 grid grid-cols-2 gap-2"
                >
                  {(
                    [
                      ["scam", "Penipuan"],
                      ["legit", "Wajar"],
                    ] as const
                  ).map(([value, label]) => {
                    const selected = answers[question.id] === value;
                    return (
                      <label
                        key={value}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-[13px] font-semibold transition",
                          selected
                            ? "border-forest bg-forest-50 text-forest-900"
                            : "border-forest/10 text-forest/70 hover:border-forest/25",
                        )}
                      >
                        <RadioGroupItem value={value} />
                        {label}
                        {selected && <Check className="ml-auto h-3.5 w-3.5" strokeWidth={3} />}
                      </label>
                    );
                  })}
                </RadioGroup>
              </fieldset>
            ))}
          </div>

          {error && (
            <p role="alert" className="rounded-2xl border-2 border-alert-high bg-paper p-4 text-[14px] text-alert-high">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4 rounded-3xl border border-line bg-sage/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[13px] font-semibold text-forest-900">
                {answered < QUESTIONS.length
                  ? `Terjawab ${answered} dari ${QUESTIONS.length} soal.`
                  : "Semua soal terjawab. Skor siap dikirim."}
              </p>
              <p className="mt-1 text-[12.5px] text-forest/70">
                Tanpa nama, tanpa email, tanpa jawaban per orang.
              </p>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={submitting || answered < QUESTIONS.length}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mengirim…
                </>
              ) : (
                <>
                  Kirim skor {phase === "pre" ? "sebelum" : "sesudah"}
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      <p className="rounded-2xl border-l-2 border-orange bg-paper/70 p-4 text-[13px] leading-relaxed text-forest/60">
        Tes ini alat ukur edukasi, bukan ujian. Skor rendah berarti ada aturan baru untuk
        dilatih, bukan penilaian terhadap Anda. Panel dashboard baru menampilkan klaim
        perubahan setelah minimal 20 responden berpasangan.
      </p>
    </div>
  );
}
