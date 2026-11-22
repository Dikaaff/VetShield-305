"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
    <section aria-labelledby="assessment-title" className="space-y-6">
      <div>
        <h1 id="assessment-title" className="text-3xl font-bold text-ink sm:text-4xl">
          Tes singkat: sebelum dan sesudah latihan
        </h1>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink/85">
          Sepuluh pesan, tanpa data pribadi. Skor hanya dipakai untuk mengukur apakah
          latihan membantu; kami tidak menyimpan nama atau jawaban per orang.
        </p>
      </div>

      <div
        role="group"
        aria-label="Pilih tahap tes"
        className="inline-flex overflow-hidden rounded-lg border border-shield-200 bg-white"
      >
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
            className={`px-4 py-2 text-[15px] font-semibold ${
              phase === value ? "bg-shield-700 text-white" : "text-shield-900 hover:bg-shield-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {submitted ? (
        <div aria-live="polite" className="rounded-2xl border border-shield-100 bg-white p-6 shadow-card">
          <p className="text-[14px] font-semibold uppercase tracking-wide text-shield-700">
            {phase === "pre" ? "Tes sebelum latihan" : "Tes sesudah latihan"} tercatat
          </p>
          <p className="mt-2 font-serif text-5xl font-bold text-shield-900">{submitted.score}%</p>
          <p className="mt-2 text-[17px] text-ink/85">
            {phase === "pre"
              ? "Sekarang coba satu sesi latihan singkat, lalu isi tes sesudahnya."
              : "Terima kasih. Skor ini masuk ke panel pembelajaran di dashboard."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {phase === "pre" ? (
              <Link
                href="/practice"
                className="rounded-xl bg-shield-700 px-5 py-3 font-bold text-white no-underline hover:bg-shield-900"
              >
                Mulai latihan →
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="rounded-xl bg-shield-700 px-5 py-3 font-bold text-white no-underline hover:bg-shield-900"
              >
                Lihat dashboard →
              </Link>
            )}
            <button
              type="button"
              onClick={() => switchPhase(phase === "pre" ? "post" : "pre")}
              className="rounded-xl border border-shield-300 px-5 py-3 font-semibold text-shield-900"
            >
              {phase === "pre" ? "Isi tes sesudah latihan" : "Isi tes sebelum latihan"}
            </button>
            <button
              type="button"
              onClick={() => setReview((current) => !current)}
              className="rounded-xl px-3 py-3 font-semibold text-shield-900 underline"
            >
              {review ? "Sembunyikan pembahasan" : "Lihat pembahasan"}
            </button>
          </div>

          {review && (
            <ol className="mt-6 space-y-4">
              {QUESTIONS.map((question, index) => {
                const chosen = answers[question.id];
                const correct = chosen === question.answer;
                return (
                  <li key={question.id} className="rounded-xl border border-shield-100 p-4">
                    <p className="text-[15px] font-semibold text-ink">
                      {index + 1}. {correct ? "Benar" : "Belum tepat"} —{" "}
                      {question.answer === "scam" ? "penipuan" : "wajar"}
                    </p>
                    <p className="mt-1 text-[15px] text-ink/80">{question.why}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="space-y-4"
        >
          {QUESTIONS.map((question, index) => (
            <fieldset
              key={question.id}
              className="rounded-2xl border border-shield-100 bg-white p-5"
            >
              <legend className="px-1 text-[15px] font-semibold text-shield-700">
                Soal {index + 1} dari {QUESTIONS.length}
              </legend>
              <p className="mt-1 text-[17px] leading-relaxed text-ink">{question.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    ["scam", "Ini penipuan"],
                    ["legit", "Ini pesan wajar"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 text-[16px] ${
                      answers[question.id] === value
                        ? "border-shield-700 bg-shield-50"
                        : "border-shield-100 hover:border-shield-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={answers[question.id] === value}
                      onChange={() =>
                        setAnswers((current) => ({ ...current, [question.id]: value }))
                      }
                      className="h-5 w-5"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          {error && (
            <p role="alert" className="rounded-lg border-2 border-alert-high bg-white p-3 text-alert-high">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={submitting || answered < QUESTIONS.length}
              className="min-h-[52px] rounded-xl bg-shield-700 px-6 text-lg font-bold text-white hover:bg-shield-900 disabled:opacity-50"
            >
              {submitting ? "Mengirim…" : "Kirim skor"}
            </button>
            <p className="text-[15px] text-ink/70">
              Terjawab {answered}/{QUESTIONS.length}. Tanpa nama, tanpa email.
            </p>
          </div>
        </form>
      )}

      <p className="rounded-xl border-l-4 border-alert-mid bg-white p-4 text-[15px] text-ink/80">
        Tes ini alat ukur edukasi, bukan ujian. Skor rendah berarti ada aturan baru untuk
        dilatih, bukan penilaian terhadap Anda.
      </p>
    </section>
  );
}
