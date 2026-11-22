import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ID_SCAM, ID_LEGIT } from "./templates-id.mjs";
import { EN_SCAM, EN_LEGIT, ES_SCAM, ES_LEGIT } from "./templates-en-es.mjs";
import { SUBTLE_SCAMS, SCARY_LEGIT } from "./adversarial.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "data", "scenarios.jsonl");

const POOLS = {
  id: {
    name: ["Sari", "Budi", "Ratna", "Darmawan", "Wulan", "Joko", "Aminah", "Surya"],
    officer: ["Andi", "Rina", "Hendra", "Maya", "Fajar"],
    acct: ["0000-0000-0000-0001", "0000-0000-0000-0002", "0000-0000-0000-0003"],
    amount: ["350.000", "850.000", "1.250.000", "2.750.000", "4.500.000", "12.000.000"],
    time: ["hari ini pukul 15.30", "Senin, 14.00", "besok pagi", "Jumat, 10.00"],
    domain: ["secure-login.example.com", "verifikasi-akun.example.net", "parcel-track.example.org", "hadiah-gratis.example.net"],
    phone: ["0812-555-0142", "0857-555-0198", "021-555-0163"],
    code: ["482913", "731045", "905127", "264880"],
    ref: ["INV-2026-1041", "ORD-2026-2210", "TRX-2026-3387", "REF-2026-4412"],
  },
  en: {
    name: ["Carter", "Alvarez", "Reed", "Okafor", "Bennett"],
    officer: ["James", "Nora", "Priya", "Daniel"],
    acct: ["0000-0000-0000-0011", "0000-0000-0000-0012"],
    amount: ["$120", "$480", "$1,250", "$3,400", "$9,800"],
    time: ["today at 3:30pm", "Monday 2pm", "tomorrow morning"],
    domain: ["secure-login.example.com", "account-check.example.net", "track-parcel.example.org"],
    phone: ["555-0142", "555-0198"],
    code: ["482913", "731045", "905127"],
    ref: ["INV-2026-1041", "ORD-2026-2210", "TRX-2026-3387"],
  },
  es: {
    name: ["Gómez", "Ruiz", "Torres", "López"],
    officer: ["Carlos", "María", "Lucía"],
    acct: ["0000-0000-0000-0021", "0000-0000-0000-0022"],
    amount: ["$120", "$480", "$1,250", "2.400"],
    time: ["hoy a las 15:30", "el lunes a las 14:00", "mañana"],
    domain: ["secure-login.example.com", "verificar-cuenta.example.net"],
    phone: ["555-0142", "555-0198"],
    code: ["482913", "731045"],
    ref: ["INV-2026-1041", "ORD-2026-2210"],
  },
};

const pick = (list, i) => list[i % list.length];
let refSeq = 0;

function fill(template, lang, i) {
  const pool = POOLS[lang];
  refSeq += 1;
  const replacements = {
    "{name}": pick(pool.name, i),
    "{officer}": pick(pool.officer, i + 1),
    "{acct}": pick(pool.acct, i),
    "{amount}": pick(pool.amount, i),
    "{time}": pick(pool.time, i),
    "{domain}": pick(pool.domain, i),
    "{phone}": pick(pool.phone, i),
    "{code}": pick(pool.code, i),
    "{ref}": `${pick(pool.ref, i)}-${refSeq}`,
  };
  let text = template.text;
  for (const [token, value] of Object.entries(replacements)) {
    text = text.split(token).join(value);
  }
  if (!text.includes(`${refSeq}`)) text += ` Ref ${refSeq}`;
  return text;
}

const SOURCES = {
  id: { scam: ID_SCAM, legit: ID_LEGIT },
  en: { scam: EN_SCAM, legit: EN_LEGIT },
  es: { scam: ES_SCAM, legit: ES_LEGIT },
};

const TARGETS = {
  id: { scam: 180, legit: 120 },
  en: { scam: 90, legit: 60 },
  es: { scam: 30, legit: 20 },
};

const rows = [];
const seen = new Set();

function emit(template, lang, label, index, adversarial) {
  const text = fill(template, lang, index);
  const key = text.toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  rows.push({
    id: `sc_${String(rows.length + 1).padStart(4, "0")}`,
    text,
    channel: template.channel,
    language: lang,
    label,
    category: template.category,
    difficulty: template.difficulty,
    red_flags: template.flags,
    evidence_rule: template.rule,
    pii_safe: true,
    ...(adversarial ? { adversarial: template.kind } : {}),
    expected_score_band:
      label === "scam"
        ? template.difficulty === "easy"
          ? "85-100"
          : "60-100"
        : template.difficulty === "easy"
          ? "0-29"
          : "0-59",
  });
  return true;
}

/** Every adversarial template yields two distinct instances. */
function emitAdversarial(list, lang, label) {
  const target = 2;
  let emitted = 0;
  for (let round = 0; round < target; round += 1) {
    list.forEach((template, i) => {
      if (emitted >= target * list.length) return;
      if (emit(template, lang, label, i + round * 7, true)) emitted += 1;
    });
  }
}

for (const lang of ["id", "en", "es"]) {
  const subtle = SUBTLE_SCAMS[lang] ?? [];
  const scary = SCARY_LEGIT[lang] ?? [];
  emitAdversarial(subtle, lang, "scam");
  emitAdversarial(scary, lang, "legit");

  const counts = {
    scam: rows.filter((row) => row.language === lang && row.label === "scam").length,
    legit: rows.filter((row) => row.language === lang && row.label === "legit").length,
  };

  for (const label of ["scam", "legit"]) {
    const pool = SOURCES[lang][label];
    let index = 0;
    while (counts[label] < TARGETS[lang][label]) {
      const template = pool[index % pool.length];
      if (emit(template, lang, label, index, false)) counts[label] += 1;
      index += 1;
      if (index > 5000) throw new Error(`Not enough unique ${lang} ${label} items`);
    }
  }
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");

const counts = {
  total: rows.length,
  scam: rows.filter((row) => row.label === "scam").length,
  legit: rows.filter((row) => row.label === "legit").length,
  legitLookingScam: rows.filter((row) => row.adversarial === "legit_looking_scam").length,
  scamLookingLegit: rows.filter((row) => row.adversarial === "scam_looking_legit").length,
};
console.log("Wrote", OUT, counts);
console.table(
  ["id", "en", "es"].map((lang) => ({
    language: lang,
    scam: rows.filter((r) => r.language === lang && r.label === "scam").length,
    legit: rows.filter((r) => r.language === lang && r.label === "legit").length,
    easy: rows.filter((r) => r.language === lang && r.difficulty === "easy").length,
    medium: rows.filter((r) => r.language === lang && r.difficulty === "medium").length,
    hard: rows.filter((r) => r.language === lang && r.difficulty === "hard").length,
  })),
);
console.table(
  [...new Set(rows.map((row) => row.category))].map((category) => ({
    category,
    scam: rows.filter((r) => r.category === category && r.label === "scam").length,
    legit: rows.filter((r) => r.category === category && r.label === "legit").length,
  })),
);
