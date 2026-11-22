"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { PracticeFeedback, PracticeQuestion } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const VERDICT = {
  correct: {
    card: "border-[#9CC3A6] bg-[#EEF6EE]",
    badge: "sage" as const,
    icon: CheckCircle2,
    tone: "text-[#2F6B4A]",
  },
  partially_correct: {
    card: "border-[#E5C58B] bg-[#FBF4E6]",
    badge: "orange" as const,
    icon: AlertCircle,
    tone: "text-[#9A4708]",
  },
  incorrect: {
    card: "border-[#D9A6A0] bg-[#FBF0EE]",
    badge: "alert" as const,
    icon: XCircle,
    tone: "text-[#8F241F]",
  },
};

const CHANNEL_LABEL: Record<string, string> = {
  sms: "SMS",
  email: "Email",
  web: "Pesan web",
  voice_transcript: "Transkrip telepon",
};

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const DIFFICULTY_LABEL = { easy: "Mudah", medium: "Sedang", hard: "Sulit" };

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

  const difficulty = feedback?.nextDifficulty ?? question?.difficulty ?? "easy";
  const verdict = feedback ? VERDICT[feedback.verdict] : null;
  const VerdictIcon = verdict?.icon;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
      <aside className="order-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:order-1 lg:grid-cols-1">
        <div className="rounded-3xl bg-forest-900 p-5 text-cream">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cream/65">
            Rangkaian benar
          </p>
          <p className="mt-2 font-display text-5xl font-semibold leading-none">{streak}</p>
          <p className="mt-2 text-[13px] leading-snug text-cream/70">
            {streak >= 3 ? "Kesulitan akan naik." : "Tiga benar berturut-turut menaikkan level."}
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-paper p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">
            Tingkat sekarang
          </p>
          <div className="mt-3 space-y-2">
            {DIFFICULTIES.map((level) => {
              const activeIndex = DIFFICULTIES.indexOf(difficulty);
              const index = DIFFICULTIES.indexOf(level);
              const active = index <= activeIndex;
              return (
                <div key={level} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      active ? "bg-forest" : "bg-forest/10",
                    )}
                  />
                  <span
                    className={cn(
                      "w-12 text-right text-[11px] font-semibold",
                      index === activeIndex ? "text-forest-900" : "text-forest/70",
                    )}
                  >
                    {DIFFICULTY_LABEL[level]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden rounded-3xl border border-forest/10 bg-sage/60 p-5 lg:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest/65">
            Prinsip
          </p>
          <p className="mt-2 font-display text-[19px] leading-snug text-forest-900">
            “Jika ragu, jangan bertindak dulu.”
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-forest/60">
            Latihan tidak menilai Anda. Ia melatih satu kebiasaan: berhenti sebelum
            menuruti pesan.
          </p>
        </div>
      </aside>

      <div className="order-1 space-y-4 lg:order-2">
        {loading && (
          <div role="status" className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
            <div className="h-3 w-24 animate-pulse rounded-full bg-forest/10" />
            <div className="mt-6 h-8 w-3/4 animate-pulse rounded-lg bg-forest/10" />
            <div className="mt-3 h-8 w-2/3 animate-pulse rounded-lg bg-forest/10" />
            <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="h-14 animate-pulse rounded-xl bg-forest/5" />
              <div className="h-14 animate-pulse rounded-xl bg-forest/5" />
            </div>
            <p className="mt-5 text-[13px] text-forest/65">{dict.loading}</p>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-3xl border-2 border-alert-high bg-paper p-5">
            <p className="font-semibold text-alert-high">{error}</p>
            <Button variant="outline" className="mt-3" onClick={() => void loadQuestion()}>
              Coba lagi
            </Button>
          </div>
        )}

        {question && !feedback && !loading && (
          <section className="rounded-3xl border border-line bg-paper p-5 shadow-card sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted">{copy[language].category[question.category]}</Badge>
              <Badge variant="outline">{CHANNEL_LABEL[question.channel] ?? question.channel}</Badge>
              <Badge variant="outline">{DIFFICULTY_LABEL[question.difficulty]}</Badge>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-forest/70">
                Soal {String(question.attempt).padStart(2, "0")}
              </span>
            </div>

            <blockquote className="mt-6 font-display text-[clamp(1.5rem,3.2vw,2.15rem)] leading-[1.18] text-forest-900">
              “{question.text}”
            </blockquote>

            <fieldset className="mt-7">
              <legend className="text-[13px] font-semibold text-forest/70">{dict.question}</legend>
              <RadioGroup
                value={choice ?? undefined}
                onValueChange={(value) => setChoice(value as "scam" | "legit")}
                className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {(
                  [
                    ["scam", dict.scamOption],
                    ["legit", dict.legitOption],
                  ] as const
                ).map(([value, label]) => {
                  const selected = choice === value;
                  return (
                    <label
                      key={value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-4 text-[15px] font-semibold transition",
                        selected
                          ? "border-forest bg-forest-50 text-forest-900"
                          : "border-forest/10 bg-cream/50 text-forest/65 hover:border-forest/25",
                      )}
                    >
                      <RadioGroupItem value={value} className="shrink-0" />
                      <span className="flex-1">{label}</span>
                      {selected && <Check className="h-4 w-4 text-forest" strokeWidth={3} />}
                    </label>
                  );
                })}
              </RadioGroup>
            </fieldset>

            <div className="mt-5">
              <Label htmlFor="reasoning">{dict.reasoningLabel}</Label>
              <Input
                id="reasoning"
                value={reasoning}
                maxLength={400}
                onChange={(event) => setReasoning(event.target.value)}
                placeholder={dict.reasoningHint}
                className="mt-1.5"
              />
            </div>

            <Button
              type="button"
              onClick={() => void submitAnswer()}
              disabled={!choice || submitting}
              size="lg"
              className="mt-5 w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Memeriksa…
                </>
              ) : (
                dict.submit
              )}
            </Button>
          </section>
        )}

        {feedback && verdict && VerdictIcon && (
          <section
            aria-live="polite"
            className={cn("space-y-5 rounded-3xl border-2 p-5 sm:p-7", verdict.card)}
          >
            <div className="flex flex-wrap items-center gap-3">
              <VerdictIcon className={cn("h-5 w-5", verdict.tone)} />
              <h2 className={cn("font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight", verdict.tone)}>
                {dict.verdict[feedback.verdict]}
              </h2>
              <Badge variant={verdict.badge} className="ml-auto">
                {feedback.correctLabel === "scam" ? "Penipuan" : "Wajar"}
              </Badge>
            </div>

            <div className="space-y-1.5 border-t border-forest/10 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-forest/65">
                {dict.whyTitle}
              </p>
              <p className="text-[16px] leading-relaxed text-forest/85">{feedback.why}</p>
            </div>

            {feedback.misconception && (
              <p className="rounded-xl border border-forest/10 bg-paper/70 p-3.5 text-[13.5px] leading-relaxed text-forest/70">
                {feedback.misconception}
              </p>
            )}

            <div className="rounded-xl bg-forest-900 p-4 text-cream">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cream/65">
                {dict.tipTitle}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-cream/85">{feedback.tip}</p>
            </div>

            {showEvidence ? (
              <div className="rounded-xl border border-forest/10 bg-paper/70 p-4 text-[14px]">
                <p className="font-semibold text-forest-900">Petunjuk yang dipakai mesin</p>
                <ul className="mt-2 space-y-1.5">
                  {feedback.redFlags.map((flag) => (
                    <li key={flag} className="flex gap-2 text-forest/75">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-orange" />
                      {flag}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[12.5px] leading-relaxed text-forest/65">
                  Jawaban yang wajar bisa tetap dihargai benar jika alasan Anda kuat. Mesin
                  ini menilai pola, bukan maksud pengirim.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowEvidence(true)}
                className="text-[13px] font-semibold text-forest-700 underline underline-offset-4"
              >
                {dict.dispute}
              </button>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-forest/10 pt-4">
              <Button onClick={() => void loadQuestion()}>
                {dict.next} <ArrowUpRight className="h-4 w-4" />
              </Button>
              <p className="text-[12.5px] text-forest/65">
                Rangkaian benar sekarang: <strong className="text-forest-900">{streak}</strong>
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
