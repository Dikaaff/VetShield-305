"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import type { PracticeFeedback, PracticeQuestion } from "@/lib/types";

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const VERDICT_STYLE: Record<PracticeFeedback["verdict"], string> = {
  correct: "border-alert-low bg-[#eef7f1]",
  partially_correct: "border-alert-mid bg-[#fdf6e8]",
  incorrect: "border-alert-high bg-[#fdf0ee]",
};

const CHANNEL_LABEL: Record<string, string> = {
  sms: "SMS",
  email: "Email",
  web: "Pesan web",
  voice_transcript: "Transkrip telepon",
};

export function Practice({ language = "id" as const }) {
  const dict = copy[language].practice;
  const sessionId = useRef<string>(newSessionId());
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);
  const [choice, setChoice] = useState<"scam" | "legit" | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [showEvidence, setShowEvidence] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setChoice(null);
    setReasoning("");
    setShowEvidence(false);
    try {
      const response = await fetch("/api/practice/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current }),
      });
      if (!response.ok) throw new Error("Soal belum bisa dimuat.");
      setQuestion((await response.json()) as PracticeQuestion);
    } catch (caught) {
      setQuestion(null);
      setError(caught instanceof Error ? caught.message : "Soal belum bisa dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestion();
  }, [loadQuestion]);

  async function submitAnswer() {
    if (!question || !choice) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/practice/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          scenarioId: question.scenarioId,
          choice,
          reasoning,
        }),
      });
      if (!response.ok) throw new Error("Jawaban belum bisa diperiksa.");
      const payload = (await response.json()) as PracticeFeedback;
      setFeedback(payload);
      setStreak((current) => (payload.verdict === "correct" ? current + 1 : 0));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Jawaban belum bisa diperiksa.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="practice-title" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 id="practice-title" className="text-3xl font-bold text-ink sm:text-4xl">
            Latihan singkat, satu pesan sekali
          </h1>
          <p className="mt-2 max-w-2xl text-[17px] text-ink/80">
            Tidak ada skor yang memalukan. Setiap jawaban memberi satu aturan yang bisa
            Anda pakai lagi di pesan berikutnya.
          </p>
        </div>
        <p className="rounded-full bg-shield-100 px-3 py-1 text-[14px] font-semibold text-shield-900">
          Rangkaian benar: {streak}
        </p>
      </div>

      {loading && (
        <p role="status" className="rounded-xl border border-shield-100 bg-white p-6 text-lg">
          {dict.loading}
        </p>
      )}

      {error && (
        <div role="alert" className="rounded-xl border-2 border-alert-high bg-white p-5">
          <p className="font-bold text-alert-high">{error}</p>
          <button
            type="button"
            onClick={() => void loadQuestion()}
            className="mt-3 rounded-lg bg-shield-700 px-4 py-2 font-semibold text-white"
          >
            Coba lagi
          </button>
        </div>
      )}

      {question && !feedback && (
        <div className="rounded-2xl border border-shield-100 bg-white p-5 shadow-card sm:p-7">
          <div className="flex flex-wrap items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-ink/60">
            <span className="rounded bg-shield-50 px-2 py-0.5">
              {copy[language].category[question.category]}
            </span>
            <span className="rounded bg-shield-50 px-2 py-0.5">
              {CHANNEL_LABEL[question.channel] ?? question.channel}
            </span>
            <span className="rounded bg-shield-50 px-2 py-0.5">{question.difficulty}</span>
          </div>

          <blockquote className="mt-4 rounded-xl border-l-4 border-shield-300 bg-paper p-4 font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            “{question.text}”
          </blockquote>

          <fieldset className="mt-5">
            <legend className="text-[16px] font-semibold text-ink">{dict.question}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["scam", dict.scamOption],
                  ["legit", dict.legitOption],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-[17px] font-medium ${
                    choice === value
                      ? "border-shield-700 bg-shield-50"
                      : "border-shield-100 bg-white hover:border-shield-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="choice"
                    value={value}
                    checked={choice === value}
                    onChange={() => setChoice(value)}
                    className="h-5 w-5"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-4">
            <label htmlFor="reasoning" className="block text-[15px] font-semibold text-ink">
              {dict.reasoningLabel}
            </label>
            <input
              id="reasoning"
              value={reasoning}
              maxLength={400}
              onChange={(event) => setReasoning(event.target.value)}
              placeholder={dict.reasoningHint}
              className="mt-1 w-full rounded-lg border border-shield-200 px-3 py-2 text-[16px]"
            />
          </div>

          <button
            type="button"
            onClick={() => void submitAnswer()}
            disabled={!choice || submitting}
            className="mt-4 min-h-[50px] w-full rounded-xl bg-shield-700 px-5 text-lg font-bold text-white hover:bg-shield-900 disabled:opacity-50 sm:w-auto"
          >
            {submitting ? "Memeriksa…" : dict.submit}
          </button>
        </div>
      )}

      {feedback && (
        <div
          aria-live="polite"
          className={`space-y-4 rounded-2xl border-2 p-5 sm:p-7 ${VERDICT_STYLE[feedback.verdict]}`}
        >
          <p className="text-xl font-bold text-ink">{dict.verdict[feedback.verdict]}</p>
          <p className="text-[17px] leading-relaxed text-ink/90">
            <strong>{dict.whyTitle}:</strong> {feedback.why}
          </p>
          {feedback.misconception && (
            <p className="rounded-lg bg-white/70 p-3 text-[15px] text-ink/85">
              {feedback.misconception}
            </p>
          )}
          <p className="text-[17px] text-ink">
            <strong>{dict.tipTitle}:</strong> {feedback.tip}
          </p>

          {showEvidence ? (
            <div className="rounded-lg bg-white/75 p-3 text-[15px]">
              <p className="font-semibold">Petunjuk yang dipakai mesin:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {feedback.redFlags.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
              <p className="mt-2 text-ink/70">
                Jawaban yang wajar bisa tetap dihargai benar jika alasan Anda kuat.
                Mesin ini menilai pola, bukan maksud pengirim.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowEvidence(true)}
              className="text-[15px] font-semibold text-shield-900 underline"
            >
              {dict.dispute}
            </button>
          )}

          <button
            type="button"
            onClick={() => void loadQuestion()}
            className="min-h-[50px] rounded-xl bg-shield-900 px-6 text-lg font-bold text-white hover:bg-shield-700"
          >
            {dict.next} →
          </button>
        </div>
      )}
    </section>
  );
}
