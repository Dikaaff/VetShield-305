"use client";

import { ExternalLink } from "lucide-react";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { AnalysisResult, Language } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const BAND: Record<
  AnalysisResult["label"],
  { header: string; tone: string; badge: "default" | "orange" | "sage" | "outline" }
> = {
  scam_likely: {
    header: "bg-[#8F241F] text-[#FFF4EE]",
    tone: "text-[#8F241F]",
    badge: "orange",
  },
  suspicious: {
    header: "bg-[#B45309] text-[#FFF8EC]",
    tone: "text-[#9A4708]",
    badge: "orange",
  },
  likely_legitimate: {
    header: "bg-forest-700 text-cream",
    tone: "text-forest-700",
    badge: "sage",
  },
  insufficient_info: {
    header: "bg-forest-900 text-cream",
    tone: "text-forest-900",
    badge: "default",
  },
};

export function VerdictCard({
  result,
  language,
}: {
  result: AnalysisResult;
  language: Language;
}) {
  const dict = copy[language];
  const band = BAND[result.label];
  const confidencePct = Math.round(result.confidence * 100);

  return (
    <section
      aria-live="polite"
      aria-label="Hasil pemeriksaan"
      className="overflow-hidden rounded-3xl border border-line bg-paper shadow-card"
    >
      <header className={cn("flex items-start justify-between gap-4 px-5 py-4 sm:px-7", band.header)}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-60">
            Hasil pemeriksaan
          </p>
          <p className="mt-1 text-[13px] font-semibold opacity-90">{dict.category[result.category]}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-[40px] font-semibold leading-none">
            {result.risk_score}
            <span className="text-base opacity-50">/100</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.14em] opacity-60">skor risiko</p>
        </div>
      </header>

      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={band.badge}>{dict.band[result.label]}</Badge>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-forest/60">
            {result.label.replaceAll("_", " ")}
          </span>
        </div>

        <h2 className={cn("mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-semibold leading-[1.02]", band.tone)}>
          {dict.label[result.label]}
        </h2>

        {result.red_flags.length > 0 && (
          <div className="mt-6">
            <h3 className="eyebrow text-forest/65">{dict.flagTitle}</h3>
            <ul className="mt-3 space-y-2.5">
              {result.red_flags.map((flag, index) => (
                <li key={flag} className="flex gap-3 text-[15.5px] leading-relaxed text-forest/85">
                  <span className="mt-0.5 font-mono text-[11px] font-bold text-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 border-t border-line pt-5 text-[17px] leading-relaxed text-forest-900/85">
          {result.plain_explanation}
        </p>

        <div className="mt-6">
          <h3 className="eyebrow text-forest/65">{dict.actionTitle}</h3>
          <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {result.safe_actions.map((action, index) => (
              <li
                key={action}
                className="rounded-2xl border border-forest/10 bg-cream/70 p-4 text-[14px] leading-relaxed text-forest/80"
              >
                <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-forest text-[12px] font-bold text-cream">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>

        {result.citations.length > 0 && (
          <Accordion type="single" collapsible className="mt-6 border-t border-line">
            <AccordionItem value="citations" className="border-b-0">
              <AccordionTrigger className="text-[13px] uppercase tracking-[0.1em]">
                {dict.citationTitle}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4">
                  {result.citations.map((citation) => (
                    <li key={citation.doc_id} className="rounded-xl border border-line bg-cream/50 p-3.5">
                      <p className="text-[14px] font-semibold text-forest-900">{citation.title}</p>
                      <p className="mt-1 text-[14px] leading-relaxed text-forest/70">{citation.claim}</p>
                      {citation.url ? (
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-forest-700 underline underline-offset-4"
                        >
                          Buka sumber resmi <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <div className="mt-6 space-y-3 rounded-2xl bg-forest-50/70 p-4">
          <div className="flex items-center justify-between text-[12px] text-forest/60">
            <span>{dict.confidence}</span>
            <span className="font-semibold text-forest-900">{confidencePct}%</span>
          </div>
          <Progress value={confidencePct} className="h-1.5" />
          <p className="text-[12.5px] leading-relaxed text-forest/70">{dict.limitations}</p>
          <p className="text-[11.5px] leading-relaxed text-forest/60">{dict.notAdvice}</p>
        </div>
      </div>
    </section>
  );
}
