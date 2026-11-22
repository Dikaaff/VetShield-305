import type { Language, ScamCategory } from "./types";

export interface KnowledgeDoc {
  id: string;
  title: string;
  source_url: string;
  jurisdiction: "US" | "ID" | "AU" | "GLOBAL";
  doc_type: "agency_guidance" | "platform_help" | "regulator_notice";
  published_at: string;
  body: string;
  categories: ScamCategory[];
  key_claims: Record<"id" | "en", string>;
}

/**
 * Seed knowledge base for grounded citations.
 * NOTE: 12 curated docs ship in v1. The Stage 7 target is 120; each source URL
 * must be re-checked for HTTP 200 before submission. We never invent a claim
 * that is not supported by one of these documents.
 */
export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: "KB-FTC-01",
    title: "How to recognize and avoid phishing scams",
    source_url: "https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams",
    jurisdiction: "US",
    doc_type: "agency_guidance",
    published_at: "2024-05-01",
    body: "Phishing messages impersonate a company or agency and push you to click, call, or share information. Legitimate organisations do not ask for passwords, PINs, or verification codes by email or text. Slow down, verify through an official channel you look up yourself, and report the message.",
    categories: ["bank", "account_security", "benefits", "tax"],
    key_claims: {
      id: "Lembaga resmi tidak meminta kata sandi, PIN, atau kode verifikasi lewat pesan.",
      en: "Legitimate organisations do not ask for passwords, PINs, or verification codes by message.",
    },
  },
  {
    id: "KB-FTC-02",
    title: "Gift card scams",
    source_url: "https://consumer.ftc.gov/articles/gift-card-scams",
    jurisdiction: "US",
    doc_type: "agency_guidance",
    published_at: "2024-03-12",
    body: "Scammers ask for payment with gift cards because the codes are hard to trace and cannot be refunded. No government agency or real business asks to be paid with gift cards. Once the code is shared, the money is usually gone.",
    categories: ["benefits", "family_emergency", "prize", "tech_support"],
    key_claims: {
      id: "Tidak ada lembaga resmi yang meminta pembayaran dengan voucher atau gift card.",
      en: "No official agency asks to be paid with gift cards or vouchers.",
    },
  },
  {
    id: "KB-IC3-01",
    title: "Report fraud to the Internet Crime Complaint Center",
    source_url: "https://www.ic3.gov/",
    jurisdiction: "US",
    doc_type: "agency_guidance",
    published_at: "2025-01-10",
    body: "The FBI's Internet Crime Complaint Center collects reports about online fraud. Reporting quickly helps investigators and gives you a record. Keep copies of messages and payment receipts, but never send credentials or full card numbers.",
    categories: ["other", "investment", "romance", "marketplace"],
    key_claims: {
      id: "Simpan bukti pesan dan pembayaran, lalu laporkan lewat kanal resmi.",
      en: "Keep evidence of messages and payments, then report through an official channel.",
    },
  },
  {
    id: "KB-VA-01",
    title: "Protect your VA benefits from fraud",
    source_url: "https://www.va.gov/",
    jurisdiction: "US",
    doc_type: "agency_guidance",
    published_at: "2024-09-01",
    body: "VA benefit changes are visible in your own account. VA does not demand payment by gift card or ask for your password by text. If a message claims your benefit is suspended, log in through the official site or call the benefits line you look up yourself.",
    categories: ["benefits"],
    key_claims: {
      id: "Perubahan status bantuan terlihat di akun resmi Anda, bukan lewat tautan pesan.",
      en: "Benefit status changes are visible in your own official account, not through a message link.",
    },
  },
  {
    id: "KB-SSA-01",
    title: "Social Security scam alerts",
    source_url: "https://www.ssa.gov/scam/",
    jurisdiction: "US",
    doc_type: "agency_guidance",
    published_at: "2024-11-05",
    body: "Social Security will not threaten arrest, demand immediate payment, or ask for gift cards. Calls and texts that create panic about a suspended number are a common impersonation pattern.",
    categories: ["benefits", "tax"],
    key_claims: {
      id: "Ancaman penangkapan atau pembayaran mendadak adalah pola impersonasi yang umum.",
      en: "Threats of arrest or sudden payment demands are a common impersonation pattern.",
    },
  },
  {
    id: "KB-OJK-01",
    title: "Edukasi dan perlindungan konsumen jasa keuangan",
    source_url: "https://www.ojk.go.id/",
    jurisdiction: "ID",
    doc_type: "regulator_notice",
    published_at: "2025-02-01",
    body: "OJK mengingatkan konsumen untuk memeriksa izin penyedia jasa keuangan dan tidak mentransfer dana ke rekening pribadi. Bank tidak meminta PIN, OTP, atau kata sandi melalui pesan, dan tidak meminta nasabah menginstal aplikasi akses jarak jauh.",
    categories: ["bank", "investment", "account_security"],
    key_claims: {
      id: "Bank tidak pernah meminta PIN, OTP, atau kata sandi melalui pesan.",
      en: "Banks never request PINs, OTPs, or passwords through messages.",
    },
  },
  {
    id: "KB-KOMDIGI-01",
    title: "Panduan keamanan digital untuk masyarakat",
    source_url: "https://www.komdigi.go.id/",
    jurisdiction: "ID",
    doc_type: "agency_guidance",
    published_at: "2025-06-15",
    body: "Waspadai tautan pendek yang tidak jelas asalnya, permintaan data pribadi melalui pesan, dan tawaran hadiah yang meminta biaya di muka. Verifikasi melalui kanal resmi penyelenggara layanan.",
    categories: ["prize", "delivery", "other", "account_security"],
    key_claims: {
      id: "Tautan pendek dan permintaan data pribadi lewat pesan perlu diverifikasi di kanal resmi.",
      en: "Short links and requests for personal data by message must be verified on official channels.",
    },
  },
  {
    id: "KB-CISA-01",
    title: "Recognize and report phishing",
    source_url: "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
    jurisdiction: "US",
    doc_type: "agency_guidance",
    published_at: "2024-08-20",
    body: "Phishing often uses urgency, authority, and a request to act. Verify the sender separately, hover over links before clicking, and report suspicious messages. Never let a remote caller guide you into installing software.",
    categories: ["tech_support", "account_security", "bank"],
    key_claims: {
      id: "Penipu memakai urgensi dan nama lembaga resmi untuk mendorong Anda bertindak cepat.",
      en: "Scammers use urgency and official-looking names to push you to act fast.",
    },
  },
  {
    id: "KB-SCAMWATCH-01",
    title: "Scamwatch: how scams work",
    source_url: "https://www.scamwatch.gov.au/",
    jurisdiction: "AU",
    doc_type: "agency_guidance",
    published_at: "2025-03-03",
    body: "Scams often combine a believable story with a payment method that is hard to reverse. Requests for cryptocurrency, wire transfers, or gift cards are common. Stop, check independently, and talk to someone you trust.",
    categories: ["investment", "romance", "marketplace", "job"],
    key_claims: {
      id: "Pembayaran yang sulit dikembalikan, seperti kripto atau transfer, sering dipakai penipu.",
      en: "Hard-to-reverse payments such as crypto or wire transfers are common in scams.",
    },
  },
  {
    id: "KB-GOOGLE-01",
    title: "Keep your account secure",
    source_url: "https://support.google.com/accounts/answer/46526",
    jurisdiction: "GLOBAL",
    doc_type: "platform_help",
    published_at: "2025-04-02",
    body: "Turn on two-step verification, review recent sessions, and change your password from the official app or site. Security alerts never ask you to reply with a code.",
    categories: ["account_security", "bank"],
    key_claims: {
      id: "Aktifkan verifikasi dua langkah dan ganti kata sandi dari aplikasi resmi.",
      en: "Turn on two-step verification and change passwords from the official app.",
    },
  },
  {
    id: "KB-FTC-03",
    title: "Job scams",
    source_url: "https://consumer.ftc.gov/articles/job-scams",
    jurisdiction: "US",
    doc_type: "agency_guidance",
    published_at: "2024-06-18",
    body: "Real employers do not charge you for a job, equipment, or training. Offers that arrive by text, promise daily pay for simple tasks, or ask you to move money between accounts are typical job scam patterns.",
    categories: ["job"],
    key_claims: {
      id: "Pemberi kerja sungguhan tidak meminta pembayaran untuk mendapat pekerjaan.",
      en: "Real employers do not charge you money to get a job.",
    },
  },
  {
    id: "KB-FTC-04",
    title: "What to know about romance scams",
    source_url: "https://consumer.ftc.gov/articles/what-know-about-romance-scams",
    jurisdiction: "US",
    doc_type: "agency_guidance",
    published_at: "2024-02-07",
    body: "Romance scams build trust for weeks, then introduce an emergency or an investment opportunity. Requests to move the conversation off-platform and to send money are the decisive signals.",
    categories: ["romance", "family_emergency"],
    key_claims: {
      id: "Permintaan pindah ke chat pribadi lalu mengirim uang adalah tanda yang menentukan.",
      en: "Requests to move to private chat and then send money are decisive signals.",
    },
  },
];

const FALLBACK_DOCS: Partial<Record<ScamCategory, string[]>> = {
  bank: ["KB-FTC-01", "KB-OJK-01"],
  benefits: ["KB-VA-01", "KB-SSA-01"],
  job: ["KB-FTC-03"],
  delivery: ["KB-KOMDIGI-01"],
  marketplace: ["KB-SCAMWATCH-01", "KB-IC3-01"],
  romance: ["KB-FTC-04"],
  tech_support: ["KB-CISA-01", "KB-FTC-02"],
  investment: ["KB-SCAMWATCH-01", "KB-OJK-01"],
  tax: ["KB-FTC-01", "KB-SSA-01"],
  family_emergency: ["KB-FTC-04", "KB-FTC-02"],
  account_security: ["KB-GOOGLE-01", "KB-FTC-01"],
  prize: ["KB-KOMDIGI-01", "KB-FTC-02"],
  other: ["KB-IC3-01"],
};

export function citationsFor(
  category: ScamCategory,
  lang: Language,
): { doc_id: string; title: string; claim: string }[] {
  const ids = FALLBACK_DOCS[category] ?? ["KB-IC3-01"];
  const claimLang: "id" | "en" = lang === "id" ? "id" : "en";
  return ids
    .map((id) => KNOWLEDGE_DOCS.find((doc) => doc.id === id))
    .filter((doc): doc is KnowledgeDoc => Boolean(doc))
    .slice(0, 2)
    .map((doc) => ({
      doc_id: doc.id,
      title: doc.title,
      claim: doc.key_claims[claimLang],
    }));
}
