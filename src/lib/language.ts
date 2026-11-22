import type { Language } from "./types";

const MARKERS: Record<Language, string[]> = {
  id: [
    "yang",
    "dan",
    "anda",
    "kami",
    "ini",
    "dengan",
    "untuk",
    "tidak",
    "akan",
    "pesan",
    "rekening",
    "segera",
    "bapak",
    "ibu",
    "silakan",
  ],
  en: [
    "the",
    "your",
    "and",
    "you",
    "this",
    "please",
    "account",
    "we",
    "have",
    "will",
    "click",
    "payment",
    "message",
    "dear",
  ],
  es: [
    "el",
    "la",
    "su",
    "usted",
    "por",
    "para",
    "gracias",
    "cuenta",
    "estimado",
    "haga",
    "clic",
    "pago",
    "mensaje",
  ],
};

export function detectLanguage(text: string): Language | null {
  const words = text.toLowerCase().split(/[^a-zà-ÿ]+/).filter(Boolean);
  if (words.length === 0) return null;

  const scores: Record<Language, number> = { id: 0, en: 0, es: 0 };
  for (const word of words) {
    for (const lang of Object.keys(MARKERS) as Language[]) {
      if (MARKERS[lang].includes(word)) scores[lang] += 1;
    }
  }

  const ranked = (Object.entries(scores) as [Language, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const best = ranked[0];
  const runnerUp = ranked[1];
  if (!best || !runnerUp) return null;
  if (best[1] === 0) return null;
  // Ambiguous short text: report null so the caller can use its default.
  if (best[1] === runnerUp[1]) return null;
  return best[0];
}

export function isSupportedLanguage(value: string): value is Language {
  return value === "id" || value === "en" || value === "es";
}
