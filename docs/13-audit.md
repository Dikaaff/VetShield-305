# Audit keamanan dan kejujuran — v0.1.0

Tanggal: 22 November 2026. Lingkup: seluruh kode di repositori, korpus sintetis, skema
Snowflake, prompt, dan klaim di README/writeup. Audit ini dilakukan oleh penulis yang
sama dengan pembuat kode, sehingga **bukan audit independen**.

## Ringkasan

| Area | Status |
| --- | --- |
| Build dan typecheck | Lulus |
| Kontrak API (5 endpoint) | Lulus uji manual |
| Deteksi injeksi | Lulus contoh, regex dapat diakali |
| Privasi penyimpanan | Sesuai desain, dengan catatan hash dan redaksi |
| Knowledge base | 120 dokumen, 40/40 URL HTTP 200 |
| Snowflake | Diuji dengan emulator: tulis, baca, dan fallback |
| Instrumen pre/post | 10 soal, n=20 tervalidasi di API |
| Aksesibilitas | Dasar terpenuhi, belum diuji dengan pengguna pembaca layar |
| Klaim performa | Dibatasi ke data sintetis |
| Autentikasi dashboard | Tidak ada (risiko diterima untuk hackathon) |

## Bukti yang dijalankan

```text
npx tsc --noEmit            → 0 error
npm run build               → sukses, 6 halaman/route
GET  /api/health            → 200, snowflake.configured=false
POST /api/analyze (scam)    → 200, scam_likely, 3 aksi, 2 sitasi
POST /api/analyze (OTP)     → 200, likely_legitimate
POST /api/analyze (pendek)  → 200, insufficient_info
POST /api/analyze (injeksi) → 200, refuse=true, injection_detected=true
POST /api/practice/next     → 200
POST /api/practice/answer   → 200, partially_correct
GET  /api/dashboard/summary → 200, source=local
npm run eval (146 item)     → akurasi 77,4%, recall 65,9%, alarm palsu 6,6%
live /api/health            → knowledge 120/120, snowflake.configured=false
live pages                  → /, /practice, /assessment, /dashboard = 200
node scripts/verify-knowledge.mjs → 40/40 sumber HTTP 200, 120 dokumen
mock Snowflake + next start → dashboard source=snowflake, 3 analisis, 1 latihan, 2 pre/post
mock dimatikan              → dashboard 200 source=local, analyze 200
/api/prepost × 40           → learning { pre: 50, post: 80, n: 20, deltaPct: 30 }
```

Yang **belum** dijalankan: Lighthouse, uji dengan NVDA/VoiceOver, uji beban, uji
lintas-browser, dan uji dengan peserta manusia.

## Temuan

### T1 — Recall penipuan masih rendah (sedang)

Dari 85 penipuan di split uji, 29 dinilai `likely_legitimate` dan 40 hanya
`suspicious`. Banyak yang jatuh pada template “hard” yang sengaja ambigu (perubahan
rekening yang sopan, tetangga yang salah menerima paket). Dampak: pengguna bisa
menganggap pesan berbahaya sebagai wajar. Mitigasi saat ini: bahasa yang tidak pernah
menjamin keamanan dan tiga langkah verifikasi. Perbaikan: tambah sinyal dan uji lapangan.

### T2 — Sirkularitas evaluasi (tinggi untuk klaim)

Template korpus dan aturan engine dibuat oleh penulis yang sama. Angka 77,4% tidak
mengukur dunia nyata. Mitigasi: baseline kata kunci (57,5%), split berdasarkan hash,
dan pernyataan batasan di README, writeup, dan UI. Tidak ada klaim “terbukti”.

### T3 — Hash tanpa salt kuat (sedang)

Jika `PII_HASH_SALT` tidak diisi, hash memakai salt pengembangan yang diketahui. Pesan
pendek bisa ditebak lewat serangan kamus. Mitigasi: wajib mengisi salt acak di produksi;
`.env.example` sudah memperingatkan. Rekomendasi: tolak start produksi tanpa salt.

### T4 — Redaksi berbasis regex (sedang)

Redaksi menangkap email, nomor telepon/rekening, nomor kartu 16 digit, dan query URL.
Nama orang, alamat, dan nomor rekening dengan format tidak lazim bisa lolos ke cuplikan
160 karakter. Mitigasi: cuplikan pendek, retensi 7 hari, penyimpanan opt-out.

### T5 — Deteksi injeksi mudah diakali (sedang)

Pola regex mencakup instruksi umum dalam id/en/es, tetapi parafrase, bahasa lain, atau
Unicode homoglyph bisa lolos. Karena keluaran tetap dinilai sebagai pesan (bukan
instruksi), dampak utamanya adalah salah klasifikasi, bukan eksekusi perintah.
Rekomendasi: normalisasi Unicode dan uji adversarial berkelanjutan.

### T6 — Rate limit dan idempotensi bersifat per instance (rendah)

Disimpan di memori proses. Di Vercel dengan beberapa instance, batas efektif berlipat.
`x-forwarded-for` dapat dipalsukan jika proxy tidak menormalkan. Dampak: penyalahgunaan
biaya jika model berbayar diaktifkan. Rekomendasi: batas berbasis penyimpanan bersama.

### T7 — Dashboard dan `/api/prepost` tanpa autentikasi (rendah)

Keduanya hanya berisi agregat dan menerima skor 0–100 dengan rate limit 10/menit.
Seorang penyerang bisa mengotori data pre/post. Dampak: metrik tidak dapat dipercaya,
bukan kebocoran data. Rekomendasi: token untuk instrumen evaluasi sebelum dipakai publik.

### T8 — Data lokal hilang di serverless (rendah)

`.data/*.jsonl` tidak dapat ditulis di Vercel; store beralih ke memori dan dashboard
kehilangan riwayat saat instance didaur ulang. Sudah dijelaskan di UI (`source=memory`)
dan README. Snowflake adalah solusi jika kredensial tersedia.

### T9 — Verifikasi knowledge base (rendah, sudah diperbaiki)

Korpus kini 120 dokumen dari 40 sumber; seluruh 40 URL mengembalikan HTTP 200 pada
22 November 2026 (`data/knowledge-verification.json`). Klaim dipetakan per sumber dan
per bahasa, dan sitasi hanya memakai dokumen terverifikasi. Risiko sisa: halaman bisa
berubah setelah verifikasi dan terjemahan klaim adalah karya penulis, bukan kutipan
resmi. Rekomendasi: jalankan `npm run verify:knowledge` sebelum setiap rilis.

### T10 — Sesi latihan hilang saat restart (rendah)

Disimpan di memori dengan TTL 2 jam. Pengguna kehilangan progres antar instance.
Diterima untuk hackathon; catat di UI? Saat ini belum. Rekomendasi: cookie bertanda
tangan atau akun.

### T11 — Prompt Gemma belum diuji (tinggi jika diaktifkan)

`prompts/assess.v1.0.md` belum dipanggil. Tidak ada bukti halusinasi sitasi, kepatuhan
skema, atau konsistensi bahasa. Jangan aktifkan tanpa evaluasi. Status saat ini jujur:
`model_used=vetshield-rules-v1`.

## Perbaikan selama audit

- Integrasi Snowflake diuji dengan emulator SQL API lokal. Ditemukan bug: kolom Snowflake
  dikembalikan dalam huruf besar sehingga dashboard mengabaikan semua baris. Kunci kini
  dinormalisasi dan angka/boolean dikonversi sebelum agregasi. Setelah perbaikan,
  dashboard membaca 3 analisis, 1 jawaban latihan, dan 2 skor pre/post dari emulator.
- Fallback diuji dengan mematikan emulator: `/api/dashboard/summary` tetap 200 dengan
  `source=local`, dan `/api/analyze` tetap 200 sementara kegagalan tulis dicatat sebagai
  `store_write_failed`.
- Knowledge base diperluas dari 12 menjadi 120 dokumen dan seluruh URL diverifikasi.
- Instrumen pre/post 10 soal ditambahkan; batas kiriman dibuat dapat diatur
  (`PREPOST_RATE_LIMIT`, default 60) agar satu kelas dengan satu IP tidak terblokir.
- Deploy produksi ke Vercel awalnya diblokir karena Next.js 15.5.4 memiliki CVE.
  Dependency dinaikkan ke 15.5.29, build diulang, dan deploy berhasil. `PII_HASH_SALT`
  produksi diset sebagai secret, bukan nilai pengembangan.
- Situs live diperiksa: lima halaman 200, knowledge 120/120, analisis mengembalikan dua
  sitasi FTC, latihan memuat korpus dari bundel serverless, dan dashboard menandai
  `source=memory` tanpa Snowflake.
- Retensi lokal: baris lebih tua dari `RETENTION_DAYS` (default 7) sekarang dipangkas
  saat penulisan/ringkasan. Awalnya hanya Snowflake yang punya task pembersihan,
  sehingga klaim retensi belum benar untuk penyimpanan lokal.
- Penulisan lokal diserialisasi agar pemangkasan tidak berlomba dengan append.
- Penghitungan ganda ditemukan: ringkasan lokal membaca file **dan** memori sekaligus.
  Sekarang file menjadi sumber kebenaran saat dapat ditulis; memori hanya cadangan.
  Diuji dengan 5 permintaan paralel: hitungan naik tepat 5.
- Batas rate limit analisis dapat diatur lewat `ANALYZE_RATE_LIMIT` untuk evaluasi lokal;
  default produksi tetap 30/menit.

## Kesesuaian konstitusi

| Pasal | Bukti | Status |
| --- | --- | --- |
| 1 Aksesibilitas | font 17px, kontras, skip link, aria-live, fokus | Sebagian, belum diuji pengguna |
| 2 Kejujuran | label tingkat, batasan di setiap kartu, refusal | Ya |
| 3 Tiga langkah | `safe_actions` tepat 3, diuji | Ya |
| 4 Bahasa | id/en/es, kelas 6, tanpa menyalahkan korban | Ya untuk template |
| 5 Privasi | hash + redaksi + retensi 7 hari + opt-out | Ya, dengan T3/T4 |
| 6 Keselamatan mesin | injeksi, ambang keyakinan, degradasi | Ya, dengan T5 |
| 7 Demo | skrip 90 detik + fallback | Ya |
| 8 Batasan | README, writeup, audit, UI | Ya |

## Sebelum rilis publik

1. Isi `PII_HASH_SALT` acak dan tolak start tanpa itu.
2. Jadwalkan verifikasi ulang 40 URL knowledge base dan tinjau klaim yang berubah.
3. Tambah autentikasi untuk dashboard dan instrumen pre/post.
4. Uji dengan 5 pengguna lansia dan 1 pengguna pembaca layar.
5. Jalankan studi pre/post 20 responden; jangan tampilkan klaim sebelum itu.
6. Evaluasi pada pesan nyata yang dianonimkan dan disetujui secara etis.
