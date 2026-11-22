import { t } from "./copy";
import { citationsFor } from "./knowledge";
import type {
  AnalysisResult,
  Channel,
  Language,
  RiskLabel,
  SafetyMeta,
  ScamCategory,
} from "./types";

/**
 * Deterministic, offline risk engine.
 *
 * Why this exists next to Cortex/Gemma:
 *  - the demo must never go dark when a warehouse is cold or credits run out;
 *  - it is the honest baseline A for the Stage 11 evaluation notebook;
 *  - scoring stays reproducible (same input, same score), which the prompt
 *    spec's consistency requirement asks for.
 */

interface Signal {
  id: string;
  category: ScamCategory;
  weight: number;
  pattern: RegExp;
  flag: { id: string; en: string };
}

const SIGNALS: Signal[] = [
  // Credential / verification-code requests: the strongest single signal.
  {
    id: "credential_request",
    category: "account_security",
    weight: 30,
    pattern:
      /(kirim(kan)?\s+(kode|otp|pin)|bagikan\s+(kode|otp|pin|kata sandi)|berikan\s+(kode|otp|pin)|sebutkan\s+(kode|otp|pin)|balas[^.\n]{0,40}\b(otp|pin|kode)\b|reply[^.\n]{0,40}\b(code|otp|pin)\b|send[^.\n]{0,40}\b(code|otp|pin)\b|share[^.\n]{0,40}\b(code|otp|pin|password)\b|masukkan\s+(pin|kata sandi|password)|enter your (password|pin)|proporciona[^.\n]{0,30}c[oó]digo|env[íi]e[^.\n]{0,30}c[oó]digo|verifikasi[^.\n]{0,40}kata sandi|confirm your password|verifique[^.\n]{0,30}contraseña)/i,
    flag: {
      id: "Meminta kode verifikasi, PIN, atau kata sandi",
      en: "Asks for a verification code, PIN, or password",
    },
  },
  {
    id: "payment_instrument",
    category: "bank",
    weight: 24,
    pattern:
      /(gift\s*card|pulsa|bitcoin|usdt|kripto|crypto|transfer(e)?\b|kirim uang|wire transfer|zelle|western union|tarjeta de regalo)/i,
    flag: {
      id: "Meminta pembayaran lewat cara yang sulit dilacak",
      en: "Asks for payment in a hard-to-trace way",
    },
  },
  {
    id: "urgency",
    category: "other",
    weight: 16,
    pattern:
      /(segera|hari ini|dalam 24 jam|batas waktu|terakhir|jangan tunda|urgent|immediately|act now|within 24 hours|expires today|hoy mismo|urgente|inmediatamente)/i,
    flag: {
      id: "Mendesak Anda bertindak cepat",
      en: "Pushes you to act fast",
    },
  },
  {
    id: "account_threat",
    category: "bank",
    weight: 20,
    pattern:
      /(akun (anda )?(akan |telah )?(diblokir|dibekukan|ditangguhkan|dinonaktifkan|dihapus)|account (will be|has been) (blocked|suspended|locked|closed)|suspendida|bloqueada)/i,
    flag: {
      id: "Mengancam akun Anda akan diblokir",
      en: "Threatens that your account will be blocked",
    },
  },
  {
    id: "payment_change",
    category: "bank",
    weight: 26,
    pattern:
      /(rekening (baru|pengganti)|nomor rekening (baru|lain)|new (bank )?account|bank details (have )?changed|datos bancarios (nuevos|cambiaron))/i,
    flag: {
      id: "Meminta pembayaran ke rekening yang berubah",
      en: "Asks for payment to changed bank details",
    },
  },
  {
    id: "service_suspension",
    category: "benefits",
    weight: 18,
    pattern:
      /(pembayaran (anda )?(dihentikan|ditangguhkan|ditahan)|bantuan (anda )?(ditangguhkan|dicabut)|payment(s)? (on hold|stopped|suspended)|pago (suspendido|detenido))/i,
    flag: {
      id: "Mengancam menghentikan pembayaran atau bantuan",
      en: "Threatens to stop payments or benefits",
    },
  },
  {
    id: "vendor_contact_change",
    category: "other",
    weight: 16,
    pattern:
      /(alamat email baru|email (baru|pengganti)|new email address|correo (nuevo|nueva))/i,
    flag: {
      id: "Mengubah kontak resmi di tengah transaksi",
      en: "Changes official contact details mid-transaction",
    },
  },
  {
    id: "cash_request",
    category: "family_emergency",
    weight: 18,
    pattern: /(uang tunai|siapkan uang|cash\b|efectivo)/i,
    flag: {
      id: "Meminta uang tunai",
      en: "Asks for cash",
    },
  },
  {
    id: "authority_impersonation",
    category: "benefits",
    weight: 18,
    pattern:
      /(veterans affairs|\bva\b|social security|\bssa\b|bantuan (pemerintah|sosial|veteran)|bansos|subsidi|bpjs|djp|kantor pajak|\birs\b|hmrc|polisi|kepolisian|imigrasi|immigration|seguro social|hacienda|veteran benefits)/i,
    flag: {
      id: "Mengaku dari lembaga resmi",
      en: "Claims to come from an official agency",
    },
  },
  {
    id: "suspicious_link",
    category: "other",
    weight: 16,
    pattern:
      /(bit\.ly|tinyurl|t\.co\/|cutt\.ly|\.xyz\b|\.top\b|\.click\b|\.live\b|\.zip\b|https?:\/\/\d{1,3}(\.\d{1,3}){3}|wa\.me\/|[a-z0-9-]*(secure|verify|verifikasi|login|account|update)[a-z0-9-]*\.(com|net|org|info|site))/i,
    flag: {
      id: "Berisi tautan pendek atau alamat mencurigakan",
      en: "Contains a shortened or unusual link",
    },
  },
  {
    id: "secrecy_request",
    category: "family_emergency",
    weight: 20,
    pattern:
      /(jangan (beri tahu|bilang|telepon)|don'?t tell|keep this (quiet|between us|secret)|no le diga|rahasiakan)/i,
    flag: {
      id: "Meminta Anda merahasiakan pesan ini",
      en: "Asks you to keep this message secret",
    },
  },
  {
    id: "personal_data_request",
    category: "account_security",
    weight: 26,
    pattern:
      /(\bnik\b|nomor identitas|nomor rekening|account number|full card number|nomor kartu|ssn\b|tanggal lahir|date of birth|mother'?s maiden|foto ktp)/i,
    flag: {
      id: "Meminta data pribadi yang sensitif",
      en: "Asks for sensitive personal data",
    },
  },
  {
    id: "remote_access",
    category: "tech_support",
    weight: 28,
    pattern:
      /(anydesk|teamviewer|remote access|akses jarak jauh|instal (aplikasi|program) (ini|kami)|install (this|our) app|acceso remoto|quick support)/i,
    flag: {
      id: "Meminta Anda memasang aplikasi akses jarak jauh",
      en: "Asks you to install a remote-access app",
    },
  },
  {
    id: "virus_panic",
    category: "tech_support",
    weight: 16,
    pattern:
      /(virus|malware|terinfeksi|infected|diretas|hackeado|komputer anda (rusak|bermasalah))/i,
    flag: {
      id: "Menakut-nakuti dengan virus atau peretasan",
      en: "Uses virus or hacking fear",
    },
  },
  {
    id: "guaranteed_profit",
    category: "investment",
    weight: 22,
    pattern:
      /(untung pasti|dijamin untung|untung dijamin|profit (dijamin|pasti)|guaranteed (profit|return)|risk[-\s]?free|double your (money|investment)|ganancia garantizada|pasti cuan)/i,
    flag: {
      id: "Menjanjikan keuntungan pasti",
      en: "Promises guaranteed profit",
    },
  },
  {
    id: "job_bait",
    category: "job",
    weight: 16,
    pattern:
      /(gaji harian|penghasilan tambahan|kerja dari rumah|tanpa pengalaman|no experience (needed|required)|work from home|daily pay|trabajo desde casa|easy money)/i,
    flag: {
      id: "Menawarkan kerja mudah dengan bayaran cepat",
      en: "Offers easy work with fast pay",
    },
  },
  {
    id: "upfront_fee",
    category: "job",
    weight: 18,
    pattern:
      /(biaya (administrasi|pelatihan|pendaftaran|klaim|kirim|konsultasi)|deposit (dulu|awal)|transfer deposit|registration fee|processing fee|claim fee|pagar (una )?cuota)/i,
    flag: {
      id: "Meminta biaya di muka",
      en: "Asks for an upfront fee",
    },
  },
  {
    id: "overpayment_bait",
    category: "marketplace",
    weight: 16,
    pattern:
      /(kelebihan (bayar|transfer)|overpay(ment)?|refund|pengembalian dana|reembolso|cashback)/i,
    flag: {
      id: "Menawarkan pengembalian dana atau kelebihan bayar",
      en: "Offers a refund or overpayment",
    },
  },
  {
    id: "family_emergency",
    category: "family_emergency",
    weight: 22,
    pattern:
      /(kecelakaan|rumah sakit|ditahan|tahanan|denda|accident|hospital|arrested|in jail|accidente|hospitalizado|detenido)/i,
    flag: {
      id: "Memakai cerita darurat keluarga",
      en: "Uses a family emergency story",
    },
  },
  {
    id: "romance_hook",
    category: "romance",
    weight: 12,
    pattern:
      /(sayang|cinta|my love|darling|mi amor|jodoh|hubungan (kita|serius))/i,
    flag: {
      id: "Membangun kedekatan pribadi dengan cepat",
      en: "Builds personal intimacy quickly",
    },
  },
  {
    id: "prize_bait",
    category: "prize",
    weight: 18,
    pattern:
      /(selamat[!,.]? (anda|kamu) (menang|beruntung)|menang (hadiah|undian)|pemenang|congratulations[!,.]? you (won|have won)|you won|premio|ganaste|hadiah (gratis|besar))/i,
    flag: {
      id: "Mengumumkan hadiah yang tidak Anda ikuti",
      en: "Announces a prize you did not enter for",
    },
  },
  {
    id: "threat_legal",
    category: "tax",
    weight: 16,
    pattern:
      /(tuntutan hukum|legal action|laporan polisi|penangkapan|arrest warrant|denda besar|will be arrested|será arrestado|kepolisian akan)/i,
    flag: {
      id: "Mengancam dengan tindakan hukum atau penangkapan",
      en: "Threatens legal action or arrest",
    },
  },
  {
    id: "tax_refund_bait",
    category: "tax",
    weight: 16,
    pattern:
      /(pengembalian pajak|tax refund|rebate pajak|devoluci[oó]n de impuestos|klaim pajak)/i,
    flag: {
      id: "Menawarkan pengembalian pajak",
      en: "Offers a tax refund",
    },
  },
  {
    id: "delivery_hook",
    category: "delivery",
    weight: 10,
    pattern:
      /(paket (anda )?(tertahan|gagal|menunggu)|kiriman|kurir|resi\b|parcel|package|customs|bea cukai|paquete|salah (alamat|antar)|wrong address)/i,
    flag: {
      id: "Mengabarkan paket bermasalah",
      en: "Claims a parcel has a problem",
    },
  },
  {
    id: "offplatform_push",
    category: "marketplace",
    weight: 12,
    pattern:
      /(pindah ke (whatsapp|telegram|chat)|chat pribadi|wa\.me|dm me|telegram me|escríbeme por privado)/i,
    flag: {
      id: "Mengajak pindah ke chat pribadi",
      en: "Moves the conversation to private chat",
    },
  },
];

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(the\s+)?(previous|prior|above)\s+instructions?/i,
  /abaikan\s+(semua\s+)?(instruksi|perintah)\s+(sebelumnya|di atas)/i,
  /ignora\s+(todas\s+)?las\s+instrucciones/i,
  /(reveal|print|show|repeat)\s+(your|the)\s+(system\s+prompt|instructions|prompt)/i,
  /(tampilkan|bocorkan|ulangi)\s+(prompt|instruksi)/i,
  /repeat\s+(the\s+)?text\s+above/i,
  /you\s+are\s+now\s+(an?\s+)?(unrestricted|unfiltered|dan|developer)/i,
  /system\s*prompt/i,
];

const REFUSAL_PATTERNS: RegExp[] = [
  /\b(diagnos[ae]|dosis|obat apa|medical advice|nasihat medis|resep dokter)\b/i,
  /\b(nasihat hukum|legal advice|sue (them|him|her)|gugat|tuntut perusahaan)\b/i,
  /\b(should i invest|saham apa|investasi apa yang|financial advice|nasihat keuangan)\b/i,
];

const LEGIT_MARKERS: { id: string; pattern: RegExp; subtract: number; cap?: number }[] = [
  {
    id: "we_never_ask",
    pattern:
      /(kami tidak (akan )?pernah meminta|we will never ask|nunca le pediremos|jangan bagikan (pin|kata sandi|kode)|never share your (pin|password|code))/i,
    subtract: 24,
    cap: 55,
  },
  {
    id: "no_action_needed",
    pattern:
      /(tidak perlu (klik|membalas|melakukan apa pun)|no action (is )?required|tidak ada tautan|no link to click)/i,
    subtract: 12,
    cap: 40,
  },
  {
    id: "call_official_number",
    pattern:
      /(hubungi nomor (resmi|di belakang kartu)|call the (number on the|official) (back of your card|number)|telepon bank anda|llame al n[uú]mero oficial)/i,
    subtract: 16,
    cap: 50,
  },
  {
    id: "receipt",
    pattern:
      /(struk|receipt|invoice|nota pembelian|pesanan anda (telah )?dikirim|your order (has )?shipped|pesanan #?\d+)/i,
    subtract: 8,
  },
];

const CATEGORY_PRIORITY: ScamCategory[] = [
  "bank",
  "account_security",
  "benefits",
  "tax",
  "tech_support",
  "investment",
  "family_emergency",
  "job",
  "delivery",
  "marketplace",
  "romance",
  "prize",
  "other",
];

export interface EngineInput {
  text: string;
  channel: Channel;
  language: Language;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function detectInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

function labelForScore(score: number): RiskLabel {
  if (score >= 60) return "scam_likely";
  if (score >= 30) return "suspicious";
  return "likely_legitimate";
}

export function analyzeOffline(input: EngineInput): AnalysisResult {
  const started = Date.now();
  const { text, channel, language } = input;
  const dict = t(language);
  const lower = text;
  const words = wordCount(text);

  const matched: { signal: Signal; flag: string }[] = [];
  const categoryScores = new Map<ScamCategory, number>();

  for (const signal of SIGNALS) {
    if (signal.pattern.test(lower)) {
      matched.push({ signal, flag: signal.flag[language === "id" ? "id" : "en"] });
      categoryScores.set(
        signal.category,
        (categoryScores.get(signal.category) ?? 0) + signal.weight,
      );
    }
  }

  const injection = detectInjection(text);
  if (injection) {
    matched.push({
      signal: {
        id: "injection_attempt",
        category: "other",
        weight: 12,
        pattern: /./,
        flag: {
          id: "Berisi perintah yang ditujukan ke pemeriksa, bukan ke Anda",
          en: "Contains instructions aimed at the checker, not at you",
        },
      },
      flag:
        language === "id"
          ? "Berisi perintah yang ditujukan ke pemeriksa, bukan ke Anda"
          : "Contains instructions aimed at the checker, not at you",
    });
  }

  let score = Math.min(
    100,
    matched.reduce((total, item) => total + item.signal.weight, 0),
  );

  let cap = 100;
  for (const marker of LEGIT_MARKERS) {
    if (marker.pattern.test(lower)) {
      score -= marker.subtract;
      if (marker.cap !== undefined) cap = Math.min(cap, marker.cap);
    }
  }
  score = Math.max(0, Math.min(score, cap));

  const category =
    CATEGORY_PRIORITY.find((candidate) => (categoryScores.get(candidate) ?? 0) > 0) ??
    "other";

  const flags = matched
    .sort((a, b) => b.signal.weight - a.signal.weight)
    .map((item) => item.flag)
    .filter((flag, index, all) => all.indexOf(flag) === index)
    .slice(0, 5);

  const refusesForAdvice = REFUSAL_PATTERNS.some((pattern) => pattern.test(text));
  const refuse = refusesForAdvice || (injection && /(prompt|instruksi|instructions)/i.test(text));

  let label: RiskLabel = labelForScore(score);
  let confidence = 0.5;

  if (label === "scam_likely") confidence = 0.78 + Math.min(0.15, matched.length * 0.03);
  else if (label === "suspicious") confidence = 0.55 + Math.min(0.2, matched.length * 0.04);
  else confidence = 0.6;

  if (words >= 40) confidence += 0.05;
  if (injection) confidence = Math.max(0.4, confidence - 0.2);

  // Short messages cannot be judged unless the signals are strong on their own.
  if (words < 12 && label !== "scam_likely") {
    label = "insufficient_info";
    confidence = Math.min(0.4, confidence);
  }

  if (refuse) {
    label = "insufficient_info";
    confidence = Math.min(confidence, 0.35);
    score = Math.min(score, 40);
  }

  confidence = Math.round(Math.min(0.95, Math.max(0.2, confidence)) * 100) / 100;

  const strongestFlag = flags[0] ?? "";
  let explanation: string;
  if (label === "insufficient_info") {
    explanation = dict.insufficient;
  } else {
    explanation = dict.explanation[label].replace("{flag}", strongestFlag.toLowerCase());
  }
  if (refuse) {
    explanation =
      language === "id"
        ? "Pesan ini bukan permintaan pemeriksaan penipuan, jadi kami tidak menilainya sebagai penipuan. Kami juga tidak memberi nasihat hukum, medis, atau keuangan. Silakan gunakan saluran resmi untuk pertanyaan seperti ini."
        : "This is not a request to check a suspicious message, so we have not scored it as fraud. We also do not give legal, medical, or financial advice. Please use an official channel for this kind of question.";
  }

  const actions: [string, string, string] =
    label === "insufficient_info" && !refuse
      ? language === "id"
        ? [
            "Salin seluruh pesan, termasuk nama pengirim dan tautannya, lalu periksa lagi.",
            "Tanyakan ke pengirim lewat nomor atau akun resmi yang Anda cari sendiri.",
            "Jangan membalas, membayar, atau mengirim data sampai pesannya lebih jelas.",
          ]
        : [
            "Copy the whole message, including the sender and any link, then check again.",
            "Ask the sender through an official number or account you look up yourself.",
            "Do not reply, pay, or share details until the message is clearer.",
          ]
      : dict.actions[category];

  const safety_meta: SafetyMeta = {
    injection_detected: injection,
    pii_redacted: false,
    degraded: false,
    limited_analysis: refuse,
  };

  return {
    risk_score: Math.round(score),
    label,
    category,
    red_flags: flags,
    plain_explanation: explanation,
    safe_actions: actions,
    confidence,
    refuse,
    citations: refuse ? [] : citationsFor(category, language),
    model_used: "vetshield-rules-v1",
    latency_ms: Date.now() - started,
    safety_meta,
  };
}

export function channelLabel(channel: Channel, lang: Language): string {
  const labels: Record<Channel, { id: string; en: string }> = {
    sms: { id: "SMS", en: "SMS" },
    email: { id: "Email", en: "Email" },
    web: { id: "Situs web", en: "Web page" },
    voice_transcript: { id: "Transkrip panggilan", en: "Call transcript" },
  };
  return labels[channel][lang === "id" ? "id" : "en"];
}
