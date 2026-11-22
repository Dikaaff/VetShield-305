# Arsitektur — VetShield 305

## Prinsip

1. **Dua jalur, satu kontrak.** Engine deterministik selalu menjawab. Snowflake dan
   model bahasa hanya menambah, tidak menggantikan.
2. **Stateless di edge.** Vercel tidak menyimpan sesi latihan; data sesi ada di memori
   proses dan hilang saat restart (batasan yang diakui).
3. **Redaksi sebelum penyimpanan.** Jalur tulis tidak pernah menerima teks mentah.

## Diagram

```
Pengguna
  │  teks + channel + language + consent
  ▼
Next.js App Router (/)
  │  fetch POST /api/analyze
  ▼
Route handler ── rate limit ── idempotency ── validasi
  │
  ├─ normalize + truncate 4.000 karakter
  ├─ cache (TTL 10 menit) + single-flight
  ├─ engine aturan (offline, deterministik)
  │    ├─ sinyal berbobot + penanda legitimasi
  │    ├─ deteksi injeksi
  │    └─ penolakan nasihat / bukti kurang
  ├─ redaksi PII (telepon, rekening, email, NIK, kartu)
  ├─ sitasi knowledge base
  ▼
Response JSON  ── after(): tulis best-effort ke Snowflake/lokal
  │
  ▼
VerdictCard (aria-live) + 3 langkah aman
```

## Modul

| Modul | Tanggung jawab |
| --- | --- |
| `lib/engine.ts` | Skor, label, kategori, flag, penjelasan, aksi |
| `lib/analyze.ts` | Validasi, cache, idempotensi, orkestrasi, log |
| `lib/pii.ts` | Normalisasi, hash salted, redaksi, truncate |
| `lib/knowledge.ts` | 120 dokumen (40 sumber × 3 bahasa) + pemilihan sitasi terverifikasi |
| `lib/store.ts` | Adapter Snowflake dan lokal, agregasi dashboard |
| `lib/snowflake.ts` | SQL API, polling, retry, timeout, status |
| `lib/practice.ts` | Sesi, pemilihan soal adaptif, penilaian, tips |
| `lib/scenarios.ts` | Memuat korpus JSONL, fallback kosong |
| `lib/knowledge-base.ts` | 120 dokumen terverifikasi (di-generate) |
| `lib/cache.ts` | TTL cache dan single-flight |
| `lib/rate-limit.ts` | Jendela geser per IP |
| `lib/copy.ts` | Semua teks id/en/es |

## Skoring

- Setiap sinyal punya bobot 10–30 dan kategori.
- Skor = jumlah bobot sinyal, dibatasi 100.
- Penanda legitimasi mengurangi skor dan kadang memberi batas atas:
  "kami tidak pernah meminta…" (−24, maks 55), nomor di belakang kartu (−16, maks 50),
  "tidak perlu tindakan" (−12, maks 40), struk/pesanan (−8).
- Ambang: ≥ 60 `scam_likely`, 30–59 `suspicious`, < 30 `likely_legitimate`.
- Pesan < 12 kata dipaksa `insufficient_info` kecuali sudah ≥ 60.
- Keyakinan < 0,4 → `insufficient_info`.
- Permintaan nasihat hukum/medis/keuangan → `refuse=true`, skor ≤ 40.

## Kontrak API

`POST /api/analyze`

```json
{ "text": "...", "channel": "sms", "language": "id", "consentToStore": true }
```

Respons: `{ risk_score, label, category, red_flags[], plain_explanation,
safe_actions[3], confidence, refuse, citations[], model_used, latency_ms,
safety_meta{ injection_detected, pii_redacted, degraded, limited_analysis } }`.

Kode error: `400` validasi, `429` rate limit, `500` internal, `503` praktik/dashboard
tidak tersedia. Bentuk: `{ "error": { "code", "message" } }`.

## Penyimpanan

- `SNOWFLAKE_*` lengkap → `SnowflakeStore` (tabel `ANALYSES`, `LEARNER_RESPONSES`,
  `PREPOST_TESTS`). `SNOWFLAKE_HOST` hanya dipakai untuk emulator pengujian; produksi
  memakai `https://{account}.snowflakecomputing.com`.
- Tidak lengkap → `LocalStore` menulis `.data/*.jsonl`; jika sistem berkas read-only
  (Vercel), data disimpan di memori proses.
- Tulis selalu melalui `after()` dan tidak pernah menggagalkan respons.

## Keputusan yang ditunda

- Cortex Search untuk knowledge base (korpus 120 dokumen sudah terverifikasi; tinggal
  indeks, evaluasi sitasi, dan biaya operasional).
- Gemma untuk penjelasan bebas (butuh evaluasi halusinasi).
- Antrian tulis durable (butuh volume nyata).
- Sesi latihan persisten (butuh akun atau cookie bertanda tangan).
