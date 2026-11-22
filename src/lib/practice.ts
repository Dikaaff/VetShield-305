import { randomUUID } from "node:crypto";
import { loadScenarios } from "./scenarios";
import { recordPracticeBestEffort } from "./store";
import type {
  Language,
  PracticeFeedback,
  PracticeQuestion,
  PracticeVerdict,
  Scenario,
  ScamCategory,
} from "./types";

type Difficulty = "easy" | "medium" | "hard";

interface AnswerRecord {
  category: ScamCategory;
  difficulty: Difficulty;
  correct: boolean;
  verdict: PracticeVerdict;
}

interface SessionState {
  served: Set<string>;
  answers: AnswerRecord[];
  lastSeen: number;
}

const sessions = new Map<string, SessionState>();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

function getSession(sessionId: string): SessionState {
  const now = Date.now();
  for (const [id, state] of sessions) {
    if (now - state.lastSeen > SESSION_TTL_MS) sessions.delete(id);
  }
  const existing = sessions.get(sessionId);
  if (existing) {
    existing.lastSeen = now;
    return existing;
  }
  const created: SessionState = { served: new Set(), answers: [], lastSeen: now };
  sessions.set(sessionId, created);
  return created;
}

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

function weakestCategory(state: SessionState, fallback: ScamCategory): ScamCategory {
  const stats = new Map<ScamCategory, { attempts: number; correct: number }>();
  for (const answer of state.answers) {
    const entry = stats.get(answer.category) ?? { attempts: 0, correct: 0 };
    entry.attempts += 1;
    if (answer.correct) entry.correct += 1;
    stats.set(answer.category, entry);
  }
  const ranked = [...stats.entries()]
    .filter(([, entry]) => entry.attempts >= 1)
    .sort(
      (a, b) =>
        a[1].correct / a[1].attempts - b[1].correct / b[1].attempts ||
        b[1].attempts - a[1].attempts,
    );
  return ranked[0]?.[0] ?? fallback;
}

function nextDifficulty(state: SessionState, category: ScamCategory, current: Difficulty): Difficulty {
  const forCategory = state.answers.filter((answer) => answer.category === category);
  const recent = forCategory.slice(-3);
  if (recent.length === 3 && recent.every((answer) => answer.correct)) {
    const index = DIFFICULTY_ORDER.indexOf(current);
    return DIFFICULTY_ORDER[Math.min(DIFFICULTY_ORDER.length - 1, index + 1)] ?? current;
  }
  const lastTwo = forCategory.slice(-2);
  if (lastTwo.length === 2 && lastTwo.every((answer) => !answer.correct)) {
    const index = DIFFICULTY_ORDER.indexOf(current);
    return DIFFICULTY_ORDER[Math.max(0, index - 1)] ?? current;
  }
  return current;
}

function pickScenario(
  scenarios: Scenario[],
  state: SessionState,
  category: ScamCategory | undefined,
  difficulty: Difficulty | undefined,
): Scenario | undefined {
  const fresh = scenarios.filter((scenario) => !state.served.has(scenario.id));
  const pool = fresh.length > 0 ? fresh : scenarios;
  if (fresh.length === 0) state.served.clear();

  if (category) {
    const byCategory = pool.filter((scenario) => scenario.category === category);
    if (byCategory.length > 0) {
      const byDifficulty = difficulty
        ? byCategory.filter((scenario) => scenario.difficulty === difficulty)
        : [];
      const chosen = byDifficulty[0] ?? byCategory[0];
      if (chosen) return chosen;
    }
  }

  if (difficulty) {
    const byDifficulty = pool.filter((scenario) => scenario.difficulty === difficulty);
    if (byDifficulty.length > 0) return byDifficulty[0];
  }

  const first = pool[0];
  if (first) return first;
  const anyScenario = scenarios[0];
  return anyScenario;
}

export async function nextQuestion(input: {
  sessionId: string;
  category?: ScamCategory;
  difficulty?: Difficulty;
}): Promise<PracticeQuestion> {
  const scenarios = await loadScenarios();
  if (scenarios.length === 0) {
    throw new Error("Scenario dataset is missing. Run `npm run data:scenarios`.");
  }

  const state = getSession(input.sessionId);
  const targetCategory =
    input.category ?? weakestCategory(state, scenarios[0]?.category ?? "other");
  const targetDifficulty =
    input.difficulty ??
    (state.answers.length > 0
      ? nextDifficulty(state, targetCategory, state.answers.at(-1)?.difficulty ?? "easy")
      : "easy");

  const scenario = pickScenario(scenarios, state, targetCategory, targetDifficulty);
  if (!scenario) throw new Error("No scenario available");

  state.served.add(scenario.id);

  return {
    scenarioId: scenario.id,
    text: scenario.text,
    channel: scenario.channel,
    language: scenario.language,
    category: scenario.category,
    difficulty: scenario.difficulty,
    attempt: state.answers.length + 1,
  };
}

const TIPS: Record<ScamCategory, Record<Language, string>> = {
  bank: {
    id: "Bank asli tidak pernah meminta PIN atau kode OTP lewat pesan.",
    en: "A real bank never asks for a PIN or OTP by message.",
    es: "Un banco real nunca pide un PIN o código por mensaje.",
  },
  benefits: {
    id: "Cek status bantuan di akun resmi Anda sendiri, bukan lewat tautan.",
    en: "Check benefit status in your own official account, not via a link.",
    es: "Consulte el estado en su cuenta oficial, no por un enlace.",
  },
  job: {
    id: "Pekerjaan sungguhan tidak meminta uang di muka.",
    en: "A real job never asks you to pay upfront.",
    es: "Un empleo real nunca le pide pagar por adelantado.",
  },
  delivery: {
    id: "Lacak paket hanya di situs resmi kurir yang Anda ketik sendiri.",
    en: "Track parcels only on the carrier site you typed yourself.",
    es: "Siga el paquete solo en el sitio oficial del transportista.",
  },
  marketplace: {
    id: "Jangan pindah ke chat pribadi atau bayar di luar aplikasi.",
    en: "Do not move to private chat or pay outside the app.",
    es: "No pase al chat privado ni pague fuera de la aplicación.",
  },
  romance: {
    id: "Permintaan uang dari kenalan online adalah tanda berhenti.",
    en: "A money request from an online acquaintance is a stop sign.",
    es: "Una petición de dinero de un conocido en línea es una señal de alto.",
  },
  tech_support: {
    id: "Layanan resmi tidak meminta akses jarak jauh ke komputer Anda.",
    en: "Official support never asks for remote access to your computer.",
    es: "El soporte oficial nunca pide acceso remoto a su computadora.",
  },
  investment: {
    id: "Keuntungan yang dijamin pasti adalah tanda bahaya.",
    en: "Guaranteed returns are a danger sign.",
    es: "Las ganancias garantizadas son una señal de peligro.",
  },
  tax: {
    id: "Urusan pajak selalu lewat akun resmi, bukan tautan pesan.",
    en: "Tax matters always go through the official account, not message links.",
    es: "Los asuntos fiscales van por la cuenta oficial, no por enlaces.",
  },
  family_emergency: {
    id: "Telepon dulu nomor lama keluarga sebelum mengirim uang.",
    en: "Call the family member's usual number before sending money.",
    es: "Llame al número habitual de su familiar antes de enviar dinero.",
  },
  account_security: {
    id: "Ganti kata sandi dari aplikasi resmi, bukan dari tautan.",
    en: "Change passwords from the official app, not from a link.",
    es: "Cambie la contraseña desde la aplicación oficial, no desde un enlace.",
  },
  prize: {
    id: "Hadiah asli tidak pernah meminta biaya klaim.",
    en: "A real prize never asks for a claim fee.",
    es: "Un premio real nunca pide una tarifa de reclamo.",
  },
  other: {
    id: "Berhenti, periksa lewat kanal resmi, lalu cerita ke orang yang Anda percaya.",
    en: "Stop, check through official channels, and tell someone you trust.",
    es: "Pare, verifique por canales oficiales y cuénteselo a alguien de confianza.",
  },
};

const MISCONCEPTIONS: Record<Language, { missedScam: string; falseAlarm: string }> = {
  id: {
    missedScam: "Menganggap pesan aman karena bahasanya sopan atau memakai nama lembaga resmi.",
    falseAlarm: "Menganggap semua pesan mendesak sebagai penipuan, padahal urgensi juga dipakai layanan resmi.",
  },
  en: {
    missedScam: "Assuming a message is safe because it is polite or names an official body.",
    falseAlarm: "Treating every urgent message as a scam, although real services also use urgency.",
  },
  es: {
    missedScam: "Suponer que un mensaje es seguro porque es educado o nombra un organismo oficial.",
    falseAlarm: "Tratar todo mensaje urgente como estafa, aunque los servicios reales también usan urgencia.",
  },
};

function reasoningMentionsCue(reasoning: string, scenario: Scenario): boolean {
  const reasoningWords = reasoning
    .toLowerCase()
    .split(/[^a-zà-ÿ]+/)
    .filter((word) => word.length >= 4);
  if (reasoningWords.length === 0) return false;

  const cueWords = scenario.red_flags
    .join(" ")
    .toLowerCase()
    .split(/[^a-zà-ÿ]+/)
    .filter((word) => word.length >= 4);
  return reasoningWords.some((word) => cueWords.includes(word));
}

function feedbackCopy(
  scenario: Scenario,
  verdict: PracticeVerdict,
  state: SessionState,
  category: ScamCategory,
  difficulty: Difficulty,
): PracticeFeedback {
  const lang: Language = scenario.language;
  const correctLabel = scenario.label;
  const strongest = scenario.red_flags[0] ?? scenario.evidence_rule;
  const correctVerdict = correctLabel === "scam" ? "penipuan" : "pesan wajar";
  const correctVerdictEn = correctLabel === "scam" ? "a scam" : "a normal message";

  const why =
    verdict === "correct"
      ? lang === "id"
        ? `Petunjuk yang menentukan: ${strongest}. Itulah yang membuat pesan ini ${correctVerdict}.`
        : `The deciding clue: ${strongest}. That is what makes this message ${correctVerdictEn}.`
      : verdict === "partially_correct"
        ? lang === "id"
          ? `Kesimpulan Anda tepat, tetapi alasan yang paling menentukan adalah: ${strongest}.`
          : `Your conclusion is right, but the deciding reason is: ${strongest}.`
        : lang === "id"
          ? `Pesan ini sebenarnya ${correctVerdict}. Petunjuk yang menentukan: ${strongest}.`
          : `This message is actually ${correctVerdictEn}. The deciding clue: ${strongest}.`;

  const misconception =
    verdict === "correct"
      ? null
      : correctLabel === "scam"
        ? MISCONCEPTIONS[lang === "id" ? "id" : "en"].missedScam
        : MISCONCEPTIONS[lang === "id" ? "id" : "en"].falseAlarm;

  return {
    scenarioId: scenario.id,
    verdict,
    correctLabel,
    why,
    misconception,
    nextDifficulty: nextDifficulty(state, category, difficulty),
    nextCategory: weakestCategory(state, category),
    tip: TIPS[category][lang === "id" ? "id" : "en"],
    redFlags: scenario.red_flags,
  };
}

export async function answerQuestion(input: {
  sessionId: string;
  scenarioId: string;
  choice: "scam" | "legit";
  reasoning?: string;
  language?: Language;
}): Promise<PracticeFeedback> {
  const scenarios = await loadScenarios();
  const scenario = scenarios.find((item) => item.id === input.scenarioId);
  if (!scenario) throw new Error("Unknown scenario");

  const state = getSession(input.sessionId);
  const reasoning = (input.reasoning ?? "").trim();
  const choiceCorrect = input.choice === scenario.label;

  let verdict: PracticeVerdict;
  if (!choiceCorrect) {
    verdict = reasoningMentionsCue(reasoning, scenario) ? "partially_correct" : "incorrect";
  } else if (reasoning.length > 0 && !reasoningMentionsCue(reasoning, scenario)) {
    verdict = "partially_correct";
  } else {
    verdict = "correct";
  }

  state.answers.push({
    category: scenario.category,
    difficulty: scenario.difficulty,
    correct: verdict === "correct",
    verdict,
  });

  const feedback = feedbackCopy(scenario, verdict, state, scenario.category, scenario.difficulty);

  await recordPracticeBestEffort({
    id: randomUUID(),
    created_at: new Date().toISOString(),
    session_id: input.sessionId,
    scenario_id: scenario.id,
    category: scenario.category,
    difficulty: scenario.difficulty,
    verdict,
    correct: verdict === "correct",
  });

  return feedback;
}

export function resetSession(sessionId: string): void {
  sessions.delete(sessionId);
}
