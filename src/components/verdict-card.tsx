"use client";

import { copy } from "@/lib/copy";
import type { AnalysisResult, Language } from "@/lib/types";

const BAND_STYLE: Record<
  AnalysisResult["label"],
  { wrapper: string; icon: string; symbol: string }
> = {
  scam_likely: { wrapper: "bg-alert-high text-white", icon: "!", symbol: "!" },
  suspicious: { wrapper: "bg-alert-mid text-white", icon: "!", symbol: "!" },
  likely_legitimate: { wrapper: "bg-alert-low text-white", icon: "✓", symbol: "✓" },
  insufficient_info: { wrapper: "bg-shield-700 text-white", icon: "?", symbol: "?" },
};

export function VerdictCard({
  result,
  language,
}: {
  result: AnalysisResult;
  language: Language;
}) {
  const dict = copy[language];
  const band = BAND_STYLE[result.label];
  const confidencePct = Math.round(result.confidence * 100);

  return (
    <section
      aria-live="polite"
      aria-label="Hasil pemeriksaan"
      className="overflow-hidden rounded-2xl border border-shield-100 bg-white shadow-card"
    >
      <div className={`flex items-center gap-3 px-5 py-4 ${band.wrapper}`}>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-base font-bold"
        >
          {band.symbol}
        </span>
        <p className="text-lg font-bold">{dict.band[result.label]}</p>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[15px] font-medium uppercase tracking-wide text-shield-700">
              {dict.category[result.category]}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
              {dict.label[result.label]}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[14px] text-ink/70">Skor risiko</p>
            <p className="font-serif text-5xl font-bold leading-none text-shield-900">
              {result.risk_score}
              <span className="text-2xl text-ink/50">/100</span>
            </p>
          </div>
        </div>

        {result.red_flags.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-ink">{dict.flagTitle}</h3>
            <ul className="mt-2 space-y-2">
              {result.red_flags.map((flag) => (
                <li key={flag} className="flex gap-2 text-[17px] leading-relaxed">
                  <span aria-hidden="true" className="mt-1 text-alert-high">
                    ●
                  </span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-lg leading-relaxed text-ink sm:text-[19px]">
          {result.plain_explanation}
        </p>

        <div>
          <h3 className="text-base font-bold text-ink">{dict.actionTitle}</h3>
          <ol className="mt-3 grid list-none gap-3 sm:grid-cols-3">
            {result.safe_actions.map((action, index) => (
              <li
                key={action}
                className="rounded-xl border border-shield-100 bg-shield-50 p-4 text-[16px] leading-snug"
              >
                <span className="mb-1 block font-serif text-2xl font-bold text-shield-700">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>

        {result.citations.length > 0 && (
          <details className="rounded-xl border border-shield-100 p-4">
            <summary className="text-[16px] font-semibold text-shield-900">
              {dict.citationTitle}
            </summary>
            <ul className="mt-3 space-y-3 text-[15px]">
              {result.citations.map((citation) => (
                <li key={citation.doc_id}>
                  <p className="font-semibold">{citation.title}</p>
                  <p className="text-ink/80">{citation.claim}</p>
                  <p className="text-[13px] text-ink/60">Sumber: {citation.doc_id}</p>
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="space-y-1 border-t border-shield-100 pt-4 text-[15px] text-ink/80">
          <p>
            {dict.confidence}: {confidencePct}% · {result.safety_meta.degraded
              ? "Analisis terbatas (mode cadangan)"
              : "Analisis penuh"}
          </p>
          <p>{dict.limitations}</p>
          <p className="text-[14px] text-ink/60">{dict.notAdvice}</p>
        </div>
      </div>
    </section>
  );
}
