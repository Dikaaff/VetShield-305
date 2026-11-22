# VetShield 305 — writeup Devpost

> Pemeriksa pesan penipuan yang berhenti sebelum menjanjikan kepastian.

## Masalah

Penipuan lewat pesan tidak selalu datang dengan ejaan rusak dan huruf kapital. Ia
datang sebagai pemberitahuan bank yang sopan, kode OTP yang asli, atau cucu yang
mengganti nomor. Bagi veteran dan lansia, biaya kesalahannya bukan sekadar klik: bisa
tabungan, akses akun, atau rasa malu yang membuat mereka tidak bertanya lagi.

Alat yang ada sering menjawab dengan kepastian palsu (“aman”, “penipuan”) atau
menjelaskan istilah teknis yang tidak membantu pada saat panik.

## Apa yang kami bangun

VetShield 305 adalah aplikasi Next.js 15 dengan tiga permukaan:

1. **Pemeriksa pesan.** Tempel pesan, pilih kanal dan bahasa. Keluaran: skor risiko,
   label yang jujur, tanda yang terdeteksi, penjelasan kelas 6, dan **tepat tiga
   langkah aman** yang selesai di bawah lima menit. Sitasi ke panduan bisa dibuka.
2. **Latihan adaptif.** Soal dipilih dari kategori terlemah dan tingkat kesulitan yang
   disesuaikan. Umpan balik memberi aturan yang bisa dipakai lagi, bukan sekadar
   “salah”.
3. **Dashboard kejujuran.** Pemakaian, akurasi latihan, tingkat penolakan, latensi, dan
   panel pre/post yang menolak menampilkan klaim bila responden kurang dari 20.

Prinsip yang mengikat seluruh keputusan ada di `docs/00-constitution.md`: tidak pernah
menyatakan kepastian, tiga langkah, bahasa sederhana, privasi sejak awal, dan kewajiban
menyatakan batasan. Setiap sitasi menunjuk salah satu dari 120 dokumen yang berasal dari
40 sumber resmi dan sudah diperiksa HTTP 200.

## Arsitektur singkat

- Engine aturan deterministik berjalan offline: 20+ sinyal berbobot, penanda legitimasi,
  deteksi prompt injection, dan ambang penolakan.
- Snowflake bersifat opsional: skema 8 tabel, penulisan best-effort lewat `after()`,
  dashboard jatuh ke penyimpanan lokal atau memori bila warehouse dingin.
- Teks mentah tidak pernah disimpan. Hash + cuplikan teredaksi, retensi 7 hari.
- Prompt Gemma/Cortex  sudah ditulis dan diversikan (`prompts/assess.v1.0.md`) tetapi
  **belum diaktifkan**; versi ini tidak mengklaim memakainya.

## Evaluasi

Korpus sintetis 500 item: 300 penipuan, 200 wajar, 60/30/10 id/en/es, termasuk 30
penipuan yang terlihat sangat wajar dan 30 pesan wajar yang terlihat seperti penipuan.
Split uji 30% dipilih oleh hash id, bukan tangan.

Pada 146 item uji:

| Metrik | VetShield | Baseline kata kunci |
| --- | --- | --- |
| Akurasi | **77,4%** | 57,5% |
| Presisi penipuan | 93,3% | — |
| Recall penipuan | 65,9% | — |
| F1 penipuan | 77,2% | — |
| Alarm palsu | 6,6% | — |

Angka ini mengukur konsistensi pada data sintetis, bukan performa dunia nyata. Kami
menuliskannya begitu karena itulah yang benar.

## Demo 90 detik

1. Tempel SMS “akun diblokir, kirim OTP” → risiko tinggi, tiga langkah, sitasi (25 dtk).
2. Tempel OTP asli → “tampak wajar”, tetapi tetap diingatkan jangan berbagi kode (20 dtk).
3. Tempel instruksi “abaikan semua instruksi” → ditandai injeksi, menolak menilai (15 dtk).
4. Buka latihan, jawab satu soal, lihat aturan yang bisa dipakai lagi (20 dtk).
5. Buka dashboard; jika Snowflake mati, tunjukkan fallback lokal (10 dtk).

## Yang belum selesai

- Evaluasi lapangan dengan 20 responden dan instrumen pre/post.
- Knowledge base sudah 120 dokumen dari 40 sumber terverifikasi HTTP 200; yang belum
  adalah pencarian semantik Cortex Search dan tinjauan sitasi berkala.
- Integrasi Cortex Search dan Gemma dengan uji halusinasi sitasi.
- Sesi latihan persisten; saat ini hilang saat server restart.
- Deteksi gambar/audio dan analisis header email.

## Dibangun dengan

Next.js 15, TypeScript, Tailwind CSS, Vercel, Snowflake SQL API (opsional), korpus
sintetis yang digenerate deterministik, dan evaluasi yang bisa dijalankan ulang dengan
`npm run eval`.

## Satu kalimat

VetShield 305 tidak menjanjikan bahwa pesan Anda aman; ia membantu Anda berhenti,
memeriksa, dan bertindak lewat saluran yang benar.
