# VetShield 305

Pemeriksa pesan penipuan dan tutor latihan untuk veteran, lansia, dan keluarga mereka.
Dibuat untuk **305 Veterans Hackathon, November 2026**.

Dua hal yang membedakan proyek ini:

1. **Tidak pernah menjanjikan kepastian.** Hasil selalu menyertakan ketidakpastian,
   batasan, dan tepat tiga langkah aman.
2. **Tetap hidup tanpa cloud.** Engine aturan deterministik berjalan offline; Snowflake
   dan model bahasa adalah lapisan tambahan, bukan ketergantungan tunggal.

## Jalankan

```bash
npm install
npm run dev            # http://localhost:3000
npm run typecheck
npm run build && npm start
```

Tanpa variabel lingkungan apa pun, aplikasi memakai penyimpanan lokal di `.data/`
(dan memori saat sistem berkas read-only, seperti Vercel).

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Pemeriksa pesan: skor risiko, alasan, 3 langkah aman, sumber |
| `/practice` | Latihan adaptif per kategori, umpan balik dan aturan yang bisa dipakai lagi |
| `/assessment` | Tes 10 soal sebelum dan sesudah latihan (tanpa data pribadi) |
| `/dashboard` | Statistik pemakaian, akurasi latihan, kualitas analisis |
| `/api/health` | Status layanan dan konfigurasi Snowflake |

## Data sintetis

```bash
npm run data:scenarios   # tulis ulang data/scenarios.jsonl (500 item, deterministik)
```

Korpus: 300 penipuan / 200 wajar, 60/30/10 id/en/es, 30 penipuan yang terlihat sangat
wajar, 30 pesan wajar yang terlihat seperti penipuan, dan tiga tingkat kesulitan.
Tidak ada pesan nyata atau data pribadi di dalamnya.

## Knowledge base

120 dokumen dari 40 sumber resmi (FTC, CISA, OJK, NCSC, Scamwatch, dan lainnya), tiga
bahasa per sumber. Setiap URL diperiksa dan hanya sumber HTTP 200-399 yang dipakai untuk
sitasi; tautan sumber ditampilkan di kartu hasil.

```bash
npm run verify:knowledge   # periksa 40 URL, tulis data/knowledge-verification.json
npm run data:knowledge     # verifikasi + generate 120 dokumen
```

Status terakhir: 40/40 sumber HTTP 200, 120/120 dokumen terverifikasi. Rincian dan
batasannya ada di `docs/07-knowledge.md`.

## Evaluasi

```bash
ANALYZE_RATE_LIMIT=1000 npx next start -p 3111
API_BASE=http://localhost:3111 npm run eval
```

Split uji 30% ditentukan oleh hash id, bukan dipilih manual. Hasil terakhir
(`data/eval-results.json`) pada 146 item uji:

| Metrik | Nilai |
| --- | --- |
| Akurasi | 77,4% |
| Presisi penipuan | 93,3% |
| Recall penipuan | 65,9% |
| F1 penipuan | 77,2% |
| Alarm palsu | 6,6% |
| Baseline kata kunci | 57,5% |

Angka ini berasal dari data sintetis dan **tidak boleh** dibaca sebagai performa di dunia
nyata. Lihat `docs/13-audit.md` untuk daftar batasan lengkap.

## Struktur

```
src/app/            halaman dan route handler
src/components/     UI pemeriksa, latihan, dashboard
src/lib/            engine, PII, store, Snowflake, practice
data/               korpus sintetis, katalog knowledge, hasil evaluasi
scripts/            generator korpus dan evaluasi
snowflake/          skema warehouse
prompts/            prompt produksi dengan versi
docs/               constitution, PRD, arsitektur, writeup, audit
```

## Snowflake (opsional)

1. Jalankan `snowflake/schema.sql` di database `VETSHIELD_DB`, schema `APP`.
2. Isi variabel `SNOWFLAKE_*` dari `.env.example`.
3. Buka `/api/health`; `snowflake.configured` harus `true`, lalu periksa
   `/api/dashboard/summary`.

Jika warehouse dingin, kredit habis, atau kredensial salah, penulisan gagal secara
senyap (best effort) dan dashboard jatuh ke penyimpanan lokal. Pemeriksaan pesan tidak
pernah bergantung pada Snowflake.

Adapter SQL API diuji tanpa akun nyata memakai emulator lokal:

```bash
npm run mock:snowflake                                  # terminal 1, port 3222
SNOWFLAKE_ACCOUNT=mock SNOWFLAKE_USER=test SNOWFLAKE_TOKEN=test \
SNOWFLAKE_HOST=http://localhost:3222 npx next start -p 3112   # terminal 2
```

Uji ini menemukan dan memperbaiki bug normalisasi kolom; fallback juga diuji dengan
mematikan emulator saat server berjalan (`source=local`, analisis tetap 200).

## Privasi

- Teks mentah tidak pernah disimpan; hanya hash dan cuplikan yang sudah disamarkan.
- Retensi default 7 hari.
- Persetujuan penyimpanan bisa dimatikan di formulir.
- Jangan pernah menempelkan kata sandi, PIN, atau nomor kartu lengkap.

## Lisensi dan kontribusi

Kode dan data sintetis boleh dipakai untuk belajar dan demo hackathon. Kontributor
utama: Dikaaff.
