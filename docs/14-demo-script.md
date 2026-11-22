# Demo 90 detik — skrip dan cadangan

Persiapan: `npm run build && npm start`, browser dalam mode incognito, ukuran font
browser 125%. Jangan buka DevTools saat merekam. Rekam di 1280×800.

## 0:00–0:10 — Pembuka

**Layar:** halaman utama.

**Narasi:** “Pesan penipuan tidak selalu ditulis dengan huruf kapital. Kadang ia sopan,
dan kadang ia kode OTP yang asli. VetShield membantu memutuskan harus berhenti atau
tidak — tanpa bilang ‘pasti aman’.”

**Aksi:** klik contoh “Pesan bank mendesak”, tekan **Periksa pesan ini**.

## 0:10–0:35 — Kasus 1: penipuan bank

**Layar:** kartu hasil merah, skor 60+, tiga langkah.

**Narasi:** “Risiko tinggi. Tiga tanda: ancaman blokir, permintaan OTP, tautan
verifikasi. Tiga langkah: jangan balas, telepon nomor di belakang kartu, minta teman
menemani. Semua di bawah lima menit.”

**Aksi:** buka “Dari mana panduan ini berasal”, tunjukkan satu sitasi, tutup.

## 0:35–0:52 — Kasus 2: OTP asli

**Layar:** klik contoh “Kode OTP biasa”, periksa.

**Narasi:** “Ini pesan yang terlihat seperti penipuan, tetapi wajar. Alat ini tidak
mengatakan ‘pasti aman’; ia menjelaskan bahwa pesan OTP asli justru melarang berbagi
kode.”

## 0:52–1:08 — Kasus 3: injeksi

**Layar:** klik contoh “Percobaan instruksi tersembunyi”, periksa.

**Narasi:** “Penipu bisa menulis perintah untuk mesin, bukan untuk Anda. Pesan ini
ditandai dan tidak dinilai sebagai pesan biasa. Ketidakpastian yang jujur adalah fitur,
bukan bug.”

## 1:08–1:25 — Latihan

**Layar:** `/practice`. Jawab satu soal, tunjukkan umpan balik dan aturan.

**Narasi:** “Setiap jawaban memberi satu aturan yang bisa dipakai lagi. Kesulitan naik
setelah tiga jawaban benar.”

## 1:25–1:30 — Dashboard dan penutup

**Layar:** `/dashboard`, tunjukkan sumber data dan panel pre/post yang berkata “butuh
minimal 20 responden”.

**Narasi:** “Kami tidak menampilkan angka yang belum layak dipercaya. Itu janji
produknya.”

## Jalur cadangan

| Gangguan | Tindakan |
| --- | --- |
| Snowflake mati / kredensial kosong | Dashboard otomatis memakai data lokal; sebutkan ini sebagai desain, bukan kegagalan |
| Tidak ada internet | Semua halaman dan analisis tetap jalan; sitasi tidak bisa dibuka, jelaskan |
| API 429 | Tunggu 60 detik atau ganti jaringan; jangan hapus rate limit saat demo |
| Korpus latihan gagal dimuat | Tunjukkan `/` dan dashboard; latihan dijelaskan lisan |
| Proyektor berkontras rendah | Gunakan mode font besar 150%; hindari zoom out |

## Kalimat yang dilarang di demo

- “Alat ini menjamin pesan Anda aman.”
- “Akurasi kami 95% di dunia nyata.”
- “Kami memakai Gemma untuk semuanya.” (belum aktif)
- “Data pemakaian kami sudah terbukti menurunkan korban.”

## Jika ada waktu tambahan

Buka `/assessment`, isi lima soal pertama, kirim skor, lalu tunjukkan bahwa dashboard baru
menampilkan klaim perubahan setelah n ≥ 20. Jangan klaim efek latihan dari satu responden.

## Setelah demo

Tunjukkan `docs/13-audit.md` jika juri bertanya soal batasan. Sebutkan bahwa seluruh
angka dapat direproduksi dengan `npm run eval` pada split uji yang ditentukan hash.
