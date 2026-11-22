# Evaluasi (Kaggle / lokal)

Tujuan: mengukur engine pada split uji yang tidak dipakai menyetel aturan, dan
membandingkannya dengan baseline sederhana. Semua bahan ada di repositori sehingga hasil
dapat direproduksi tanpa notebook eksternal.

## Bahan

- `data/scenarios.jsonl` — 500 item sintetis.
- `scripts/eval.mjs` — pemuat split, pemanggil API, metrik, penulis hasil.
- `data/eval-results.json` — keluaran terakhir (146 item uji).
- `scripts/generate-scenarios.mjs` — pembuat korpus deterministik.

## Split

```
test  = fnv1a(id) % 10 < 3     → 146 item
train = sisanya                → 354 item
```

Tidak ada pemilihan manual. Item uji tidak pernah dipakai untuk menambah sinyal; sinyal
ditambahkan setelah memeriksa kesalahan pada split latih.

## Metrik

- Akurasi biner: positif = `scam_likely` atau `suspicious`.
- Presisi, recall, F1 untuk kelas penipuan.
- Alarm palsu: pesan wajar yang dinilai positif.
- Tingkat penolakan: `refuse=true` atau `insufficient_info`.
- Latensi p50/p95 dari `latency_ms`.
- Baseline kata kunci: regex tunggal berisi istilah umum (`otp|transfer|klik|bayar|…`).
- Rincian per kesulitan dan bahasa.

## Hasil terakhir (22 November 2026)

| Metrik | Engine | Baseline kata kunci |
| --- | --- | --- |
| Akurasi | 77,4% | 57,5% |
| Presisi penipuan | 93,3% | — |
| Recall penipuan | 65,9% | — |
| F1 penipuan | 77,2% | — |
| Alarm palsu | 6,6% | — |
| Penolakan | 0,0% | — |
| Latensi p50 / p95 | < 1 ms / 1 ms | — |

Per kesulitan (benar / n): easy 48/55, medium 34/48, hard 31/43.
Per bahasa: id 69/88, en 31/41, es 13/17.

Confusion label (prediksi → emas):

| Prediksi | Penipuan | Wajar |
| --- | --- | --- |
| `scam_likely` | 16 | 0 |
| `suspicious` | 40 | 4 |
| `likely_legitimate` | 29 | 57 |
| `insufficient_info` | 0 | 0 |

## Cara menjalankan

```bash
# terminal 1
ANALYZE_RATE_LIMIT=1000 npx next start -p 3111

# terminal 2
API_BASE=http://localhost:3111 npm run eval
```

`ANALYZE_RATE_LIMIT` hanya untuk evaluasi lokal; produksi memakai 30/menit.

## Struktur notebook (jika dipublikasikan)

1. Muat JSONL, tampilkan distribusi label/bahasa/kesulitan.
2. Terapkan split hash dan tunjukkan jumlahnya.
3. Panggil API atau jalankan engine secara batch.
4. Hitung metrik dan confusion matrix.
5. Bandingkan baseline kata kunci.
6. Tampilkan 10 kesalahan terbesar beserta teks (semua sintetis).
7. Tulis kesimpulan yang menyebut sirkularitas.

## Ancaman terhadap validitas

1. **Sirkularitas:** template dan aturan dibuat bersama.
2. **Kebocoran gaya:** parafrase template sangat mirip.
3. **Tidak ada data nyata:** tidak ada pesan penipuan aktual atau pesan resmi asli.
4. **Keseimbangan kelas buatan:** 60/40 tidak mencerminkan kotak masuk nyata.
5. **Metrik biner menyembunyikan biaya:** salah menilai pesan wajar sebagai penipuan
   dan sebaliknya punya konsekuensi berbeda bagi pengguna.

Karena itu, angka ini dipakai untuk regresi dan komunikasi hackathon, bukan untuk klaim
keselamatan publik.
