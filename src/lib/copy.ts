import type { Language, RiskLabel, ScamCategory } from "./types";

/**
 * All user-facing copy lives here. Language is a variable, never a hardcode:
 * the analyzer prompt and UI both read from this module.
 */
type Dict = {
  label: Record<RiskLabel, string>;
  band: Record<RiskLabel, string>;
  category: Record<ScamCategory, string>;
  actions: Record<ScamCategory, [string, string, string]>;
  defaultActions: [string, string, string];
  explanation: Record<Exclude<RiskLabel, "insufficient_info">, string>;
  insufficient: string;
  flagTitle: string;
  actionTitle: string;
  citationTitle: string;
  confidence: string;
  limitations: string;
  notAdvice: string;
  practice: {
    question: string;
    scamOption: string;
    legitOption: string;
    reasoningLabel: string;
    reasoningHint: string;
    submit: string;
    verdict: Record<"correct" | "partially_correct" | "incorrect", string>;
    next: string;
    whyTitle: string;
    tipTitle: string;
    dispute: string;
    loading: string;
    empty: string;
  };
  unsupported: string;
};

const id: Dict = {
  label: {
    scam_likely: "Kemungkinan besar penipuan",
    suspicious: "Perlu hati-hati",
    likely_legitimate: "Tampak wajar",
    insufficient_info: "Belum cukup informasi",
  },
  band: {
    scam_likely: "Risiko tinggi",
    suspicious: "Risiko sedang",
    likely_legitimate: "Risiko rendah",
    insufficient_info: "Belum bisa dinilai",
  },
  category: {
    bank: "Bank dan pembayaran",
    benefits: "Bantuan pemerintah",
    job: "Tawaran kerja",
    delivery: "Paket dan pengiriman",
    marketplace: "Jual beli online",
    romance: "Hubungan online",
    tech_support: "Dukungan teknis",
    investment: "Investasi",
    tax: "Pajak",
    family_emergency: "Keluarga darurat",
    account_security: "Keamanan akun",
    prize: "Hadiah dan undian",
    other: "Umum",
  },
  actions: {
    bank: [
      "Telepon nomor resmi di belakang kartu Anda, jangan pakai nomor di pesan ini.",
      "Jangan klik tautan dan jangan balas pesan ini.",
      "Minta satu orang yang Anda percaya menemani Anda menelepon bank.",
    ],
    benefits: [
      "Buka situs resmi lembaga bantuan dan masuk sendiri, tanpa lewat tautan pesan.",
      "Jangan kirim foto KTP, nomor rekening, atau kode apa pun lewat pesan ini.",
      "Telepon kantor bantuan resmi dan tanyakan status Anda dengan tenang.",
    ],
    job: [
      "Cari nama perusahaan di situs resmi mereka dan lamar lewat sana.",
      "Jangan pernah membayar untuk mendapat pekerjaan atau pelatihan.",
      "Tanyakan ke satu orang yang Anda percaya sebelum mengirim dokumen apa pun.",
    ],
    delivery: [
      "Lacak paket hanya di situs resmi jasa kirim, bukan dari tautan pesan.",
      "Jangan bayar biaya tambahan yang diminta lewat pesan atau transfer pribadi.",
      "Cocokkan nomor pesanan dengan riwayat pembelian Anda sendiri.",
    ],
    marketplace: [
      "Jual beli hanya di dalam aplikasi resmi, jangan pindah ke chat pribadi.",
      "Jangan kirim uang muka sebelum barang Anda lihat atau terima.",
      "Periksa ulasan penjual dan minta video barang sebelum membayar.",
    ],
    romance: [
      "Hentikan percakapan yang mulai meminta uang atau investasi.",
      "Ceritakan situasi ini ke satu orang yang Anda percaya hari ini.",
      "Cari foto dan nama pengirim di mesin pencari untuk memeriksa keasliannya.",
    ],
    tech_support: [
      "Matikan pesan itu dan jangan pasang aplikasi akses jarak jauh apa pun.",
      "Hubungi layanan resmi lewat situs mereka yang Anda ketik sendiri.",
      "Minta bantuan keluarga untuk memeriksa perangkat Anda sebelum digunakan lagi.",
    ],
    investment: [
      "Periksa izin perusahaan di situs resmi pengawas keuangan negara Anda.",
      "Jangan transfer uang ke rekening pribadi atau dompet kripto.",
      "Bandingkan janji keuntungan dengan produk resmi yang sudah dikenal.",
    ],
    tax: [
      "Masuk ke situs resmi pajak dan periksa status Anda sendiri.",
      "Jangan bagikan nomor identitas atau kode verifikasi lewat pesan.",
      "Telepon kantor pajak resmi untuk memastikan tagihan itu benar.",
    ],
    family_emergency: [
      "Telepon langsung nomor lama anggota keluarga yang disebut.",
      "Tanyakan satu hal pribadi yang hanya keluarga Anda tahu.",
      "Jangan transfer uang sebelum berbicara langsung dengan orangnya.",
    ],
    account_security: [
      "Ganti kata sandi lewat aplikasi atau situs resmi, bukan tautan pesan.",
      "Aktifkan verifikasi dua langkah di akun tersebut hari ini.",
      "Keluar dari semua sesi lain setelah mengganti kata sandi.",
    ],
    prize: [
      "Jangan bayar biaya apa pun untuk mengambil hadiah.",
      "Hapus pesan dan jangan hubungi nomor yang tertera.",
      "Periksa apakah Anda benar-benar mengikuti undian tersebut.",
    ],
    other: [
      "Jangan klik tautan atau membalas pesan ini dulu.",
      "Hubungi organisasi yang mengaku mengirim lewat nomor resmi yang Anda cari sendiri.",
      "Minta satu orang yang Anda percaya memeriksa pesan ini bersama Anda.",
    ],
  },
  defaultActions: [
    "Jangan klik tautan atau membalas pesan ini.",
    "Hubungi organisasi terkait lewat saluran resmi yang Anda cari sendiri.",
    "Minta satu orang yang Anda percaya memeriksa pesan ini bersama Anda.",
  ],
  explanation: {
    scam_likely:
      "Pesan ini kemungkinan besar berusaha membuat Anda bertindak cepat demi uang atau data pribadi. Tanda paling kuat: {flag}. Kalau Anda menuruti pesan ini, uang atau data Anda bisa berpindah ke pihak yang tidak berhak.",
    suspicious:
      "Pesan ini mencurigakan, tetapi belum bisa dipastikan penipuan. Yang perlu diperiksa: {flag}. Jika Anda membalas atau mengklik tautannya, data Anda bisa jatuh ke pihak yang tidak berhak.",
    likely_legitimate:
      "Pesan ini terlihat seperti pemberitahuan biasa. Kami tidak menemukan tanda penipuan yang kuat. Tetap pakai saluran resmi bila nanti Anda diminta membayar atau membagikan data.",
  },
  insufficient:
    "Pesannya terlalu singkat untuk dinilai dengan yakin. Kami belum bisa memastikan maksud pengirim. Kumpulkan lebih banyak konteks sebelum menindaklanjuti.",
  flagTitle: "Tanda yang perlu diperhatikan",
  actionTitle: "Tiga langkah aman",
  citationTitle: "Dari mana panduan ini berasal",
  confidence: "Keyakinan",
  limitations:
    "Kami tidak bisa memeriksa apakah pengirim asli atau palsu. Mesin ini bisa salah menilai pesan resmi yang mirip penipuan.",
  notAdvice:
    "Ini panduan keamanan, bukan nasihat hukum, medis, atau keuangan.",
  practice: {
    question: "Menurut Anda, pesan ini aman atau penipuan?",
    scamOption: "Ini penipuan",
    legitOption: "Ini pesan wajar",
    reasoningLabel: "Apa petunjuk yang Anda lihat? (opsional, satu baris)",
    reasoningHint: "Contoh: mereka minta kode verifikasi lewat SMS",
    submit: "Periksa jawaban",
    verdict: {
      correct: "Tepat. Petunjuk yang Anda pakai sudah benar.",
      partially_correct: "Sebagian benar. Kesimpulannya tepat, tetapi alasannya belum menyebut petunjuk yang menentukan.",
      incorrect: "Belum tepat. Mari lihat petunjuk yang menentukan.",
    },
    next: "Soal berikutnya",
    whyTitle: "Kenapa",
    tipTitle: "Aturan yang bisa Anda pakai lagi",
    dispute: "Saya rasa penilaian ini belum pas",
    loading: "Menyiapkan soal…",
    empty: "Belum ada soal untuk kategori ini.",
  },
  unsupported:
    "Maaf, saat ini kami hanya bisa menjelaskan dalam bahasa Indonesia, Inggris, atau Spanyol.",
};

const en: Dict = {
  label: {
    scam_likely: "Likely a scam",
    suspicious: "Be careful",
    likely_legitimate: "Looks ordinary",
    insufficient_info: "Not enough to judge",
  },
  band: {
    scam_likely: "High risk",
    suspicious: "Medium risk",
    likely_legitimate: "Low risk",
    insufficient_info: "Cannot judge yet",
  },
  category: {
    bank: "Bank and payments",
    benefits: "Government benefits",
    job: "Job offers",
    delivery: "Packages and delivery",
    marketplace: "Online marketplace",
    romance: "Online relationships",
    tech_support: "Tech support",
    investment: "Investments",
    tax: "Tax",
    family_emergency: "Family emergency",
    account_security: "Account security",
    prize: "Prizes",
    other: "General",
  },
  actions: {
    bank: [
      "Call the official number on the back of your card, not a number from this message.",
      "Do not click links or reply to this message.",
      "Ask someone you trust to sit with you while you call the bank.",
    ],
    benefits: [
      "Open the official agency website yourself instead of using the message link.",
      "Do not send ID photos, bank details, or any code through this message.",
      "Call the official benefits office and ask about your status calmly.",
    ],
    job: [
      "Find the company on its official website and apply there.",
      "Never pay money to get a job or training.",
      "Ask someone you trust before sending any documents.",
    ],
    delivery: [
      "Track the parcel only on the carrier's official site, not through the link.",
      "Do not pay extra fees by transfer to a private account.",
      "Match the order number against your own purchase history.",
    ],
    marketplace: [
      "Buy and sell inside the official app, not in private chat.",
      "Do not send a deposit before you see or receive the item.",
      "Check seller reviews and ask for a video of the item before paying.",
    ],
    romance: [
      "Stop the conversation when it turns to money or investments.",
      "Tell one person you trust about this situation today.",
      "Search the sender's photo and name to check whether they are real.",
    ],
    tech_support: [
      "Close the message and install no remote-access apps.",
      "Contact the company on a website you typed yourself.",
      "Ask a family member to check your device before using it again.",
    ],
    investment: [
      "Check the company's licence on your country's financial regulator site.",
      "Do not transfer money to a private account or crypto wallet.",
      "Compare the promised returns with products you already know.",
    ],
    tax: [
      "Log in to the official tax site yourself and check your status.",
      "Do not share ID numbers or verification codes through messages.",
      "Call the official tax office to confirm the bill is real.",
    ],
    family_emergency: [
      "Call your relative directly on their usual number.",
      "Ask a private detail only your family would know.",
      "Do not transfer money before speaking to the person.",
    ],
    account_security: [
      "Change your password in the official app or site, not from the link.",
      "Turn on two-step verification on that account today.",
      "Sign out of other sessions after changing the password.",
    ],
    prize: [
      "Never pay a fee to claim a prize.",
      "Delete the message and do not contact the number.",
      "Check whether you actually entered that draw.",
    ],
    other: [
      "Do not click or reply for now.",
      "Contact the organisation on an official number you look up yourself.",
      "Ask someone you trust to look at this message with you.",
    ],
  },
  defaultActions: [
    "Do not click links or reply to this message.",
    "Contact the organisation through an official channel you look up yourself.",
    "Ask someone you trust to look at this message with you.",
  ],
  explanation: {
    scam_likely:
      "This message is most likely trying to make you act fast with your money or personal details. The strongest clue: {flag}. If you follow through, your money or data can end up with someone who has no right to it.",
    suspicious:
      "This message is suspicious, but we cannot confirm it is a scam. What to check: {flag}. If you reply or click the link, your details could reach the wrong person.",
    likely_legitimate:
      "This message looks like an ordinary notice. We found no strong scam signals. Still use official channels if you are later asked to pay or share details.",
  },
  insufficient:
    "The message is too short to judge with confidence. We cannot tell what the sender intends. Gather more context before acting.",
  flagTitle: "Signals to notice",
  actionTitle: "Three safe steps",
  citationTitle: "Where this guidance comes from",
  confidence: "Confidence",
  limitations:
    "We cannot verify whether the sender is genuine. This checker can mistake real notices for scams.",
  notAdvice: "This is safety guidance, not legal, medical, or financial advice.",
  practice: {
    question: "Is this message safe or a scam?",
    scamOption: "It is a scam",
    legitOption: "It is a normal message",
    reasoningLabel: "What clue did you see? (optional, one line)",
    reasoningHint: "Example: they asked for a verification code by SMS",
    submit: "Check answer",
    verdict: {
      correct: "Correct. You used the right clue.",
      partially_correct: "Partly right. Your conclusion is right, but the reason is missing the deciding clue.",
      incorrect: "Not quite. Let's look at the clue that decides it.",
    },
    next: "Next question",
    whyTitle: "Why",
    tipTitle: "A rule you can reuse",
    dispute: "I think this verdict is off",
    loading: "Preparing a question…",
    empty: "No questions for this category yet.",
  },
  unsupported:
    "Sorry, we can currently explain only in Indonesian, English, or Spanish.",
};

const es: Dict = { ...en };
es.label = {
  scam_likely: "Probablemente es una estafa",
  suspicious: "Tenga cuidado",
  likely_legitimate: "Parece normal",
  insufficient_info: "Falta información",
};
es.band = {
  scam_likely: "Riesgo alto",
  suspicious: "Riesgo medio",
  likely_legitimate: "Riesgo bajo",
  insufficient_info: "Aún no se puede evaluar",
};
es.actions = {
  ...en.actions,
  bank: [
    "Llame al número oficial del reverso de su tarjeta, no al de este mensaje.",
    "No haga clic en enlaces ni responda a este mensaje.",
    "Pida a alguien de confianza que le acompañe mientras llama al banco.",
  ],
};

export const copy: Record<Language, Dict> = { id, en, es };

export function t(lang: Language): Dict {
  return copy[lang];
}
