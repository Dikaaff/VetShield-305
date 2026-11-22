# Dataset — VetShield 305 (sintetis)

`data/scenarios.jsonl` · 500 item · dibuat ulang dengan `npm run data:scenarios`.

## Mengapa sintetis

Tidak ada pesan penipuan nyata, nomor telepon nyata, atau data pribadi di korpus.
Semua nomor memakai rentang fiktif `555`, semua domain memakai `example.com/net/org`,
dan semua rekening bernilai nol.

Konsekuensinya harus dinyatakan terbuka: **evaluasi pada korpus ini bersifat sirkular.**
Template dan aturan dibuat oleh penulis yang sama, sehingga angka akurasi mengukur
konsistensi internal, bukan performa dunia nyata.

## Komposisi

| Dimensi | Sebaran |
| --- | --- |
| Total | 500 |
| Label | 300 penipuan · 200 wajar |
| Bahasa | 300 id · 150 en · 50 es |
| Kesulitan | 175 easy · 183 medium · 142 hard |
| Kanal | SMS, email, pesan web, transkrip telepon |
| Kategori | 13 (bank, bantuan, kerja, kirim, jual beli, romansa, dukungan teknis, investasi, pajak, keluarga, keamanan akun, hadiah, umum) |
| Adversarial | 30 penipuan yang terlihat sangat wajar · 30 pesan wajar yang terlihat seperti penipuan |

Item adversarial sengaja tidak memakai huruf kapital berlebihan, tipe o, atau tautan
mencurigakan. Contohnya permintaan perubahan rekening yang sopan dan notifikasi OTP asli
yang memuat kode.

## Skema baris

```json
{
  "id": "sc_0001",
  "text": "...",
  "channel": "sms",
  "language": "id",
  "label": "scam",
  "category": "bank",
  "difficulty": "easy",
  "red_flags": ["..."],
  "evidence_rule": "Bank tidak meminta OTP lewat pesan.",
  "pii_safe": true,
  "adversarial": "legit_looking_scam",
  "expected_score_band": "85-100"
}
```

- `label` hanya `scam` atau `legit`; tidak ada label “mungkin”.
- `red_flags` adalah tanda yang bisa diajarkan, bukan penjelasan model.
- `evidence_rule` adalah aturan satu kalimat yang muncul di umpan balik latihan.
- `adversarial` hanya ada pada 60 item adversarial.
- `expected_score_band` adalah panduan penulis, bukan kebenaran yang diuji.

## Split

Split tidak dipilih manual:

```
test  = item dengan fnv1a(id) % 10 < 3   (30%, 146 item)
train = sisanya                           (70%, 354 item)
```

Aturan ini stabil, tidak bisa dicurangi dengan memilih item yang mudah, dan dipakai
oleh `scripts/eval.mjs`. Item uji tidak pernah dipakai untuk menyetel aturan; aturan
disetel dari contoh split latih.

## Batasan yang diketahui

1. Template menghasilkan parafrase yang mirip; variasi bahasa terbatas.
2. Beberapa kategori hanya punya contoh penipuan (romansa, dukungan teknis, investasi)
   atau hanya contoh wajar, sehingga akurasi per kategori tidak seimbang.
3. Panjang pesan pendek dan konteks percakapan sebelumnya tidak dimodelkan.
4. Tidak ada gambar, lampiran, header email, atau metadata pengirim.
5. Label “wajar” berarti “tidak menunjukkan pola penipuan yang dikenal”, bukan
   jaminan bahwa pengirim dapat dipercaya.

## Penggunaan yang diperbolehkan

- Latihan dan demo hackathon.
- Evaluasi regresi engine.
- Penelitian yang menyebutkan sifat sintetisnya.

Tidak diperbolehkan: mengklaim angka ini sebagai hasil uji lapangan, atau memakai
korpus untuk melatih model yang dipromosikan sebagai pendeteksi penipuan dunia nyata
tanpa validasi independen.
