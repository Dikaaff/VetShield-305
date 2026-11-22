# PRD — VetShield 305

Status: v1.0, dibekukan untuk pengumpulan 305 Veterans Hackathon (Desember 2026).

## 1. Masalah

Veteran dan lansia menerima pesan penipuan setiap hari: ancaman pemblokiran rekening,
bantuan yang "ditangguhkan", paket tertahan, hingga permintaan uang dari "cucu" yang
mengganti nomor. Mereka sering:

- tidak yakin harus menghubungi siapa;
- malu bertanya karena takut dianggap tidak paham teknologi;
- mendapat saran yang terlalu teknis atau justru terlalu percaya diri.

Keluarga mereka juga tidak punya alat sederhana untuk memeriksa pesan bersama.

## 2. Pengguna

| Persona | Kebutuhan utama | Konteks pemakaian |
| --- | --- | --- |
| Veteran 65+, tinggal sendiri | Jawaban cepat dan tenang | Menerima SMS/telepon, sering malam hari |
| Pasangan/pendamping | Memeriksa pesan untuk orang tua | Bersama di satu ponsel |
| Cucu/anggota keluarga | Mencegah kerugian keluarga | Jarak jauh, lewat tautan |
| Relawan komunitas | Materi latihan singkat | Posyandu, balai warga |

Bukan pengguna utama: analis keamanan, tim fraud bank, peneliti.

## 3. Pekerjaan yang ingin diselesaikan

> "Saat saya menerima pesan yang membuat saya panik, saya ingin tahu dalam satu menit
> apakah saya harus berhenti, dan apa yang harus saya lakukan sekarang, tanpa merasa
> bodoh."

## 4. Ruang lingkup versi ini

### Termasuk

1. Pemeriksa pesan teks (SMS, email, pesan web, transkrip telepon).
2. Skor risiko 0–100, label, alasan sederhana, tepat tiga langkah aman.
3. Deteksi prompt injection dan penolakan saat bukti kurang.
4. Sitasi ke knowledge base yang bisa dibuka.
5. Latihan adaptif dengan umpan balik dan aturan yang bisa dipakai lagi.
6. Dashboard pemakaian, akurasi latihan, dan kualitas analisis.
7. Instrumen pre/post 10 soal untuk mengukur perubahan pemahaman.
8. API terdokumentasi untuk integrasi.

### Tidak termasuk (sengaja)

- Memastikan identitas pengirim atau menelepon balik atas nama pengguna.
- Menangani kasus hukum, medis, atau keuangan.
- Menyimpan pesan mentah atau membangun profil individu.
- Deteksi gambar, audio, atau panggilan langsung.
- Klaim akurasi dunia nyata tanpa studi lapangan.

## 5. Alur utama (target < 90 detik)

1. Pengguna membuka `/`, menempel pesan, memilih saluran, menekan **Periksa**.
2. Dalam < 2 detik muncul label, skor, tanda yang terdeteksi, penjelasan, tiga langkah.
3. Pengguna bisa membuka sitasi atau menyalin langkah.
4. Jika ragu, pengguna masuk `/practice` dan menjawab satu soal.
5. Keluarga bisa membuka `/dashboard` untuk melihat pola pemakaian.

## 6. Kebutuhan fungsional dan kriteria penerimaan

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| F1 | Analisis pesan | `POST /api/analyze` mengembalikan skema `AnalysisResult`; 3 aksi; 0–3 sitasi |
| F2 | Bahasa | `language` id/en/es; default id; tidak ada teks campuran dalam satu hasil |
| F3 | Penolakan | Pesan < 12 kata tanpa sinyal kuat → `insufficient_info`; permintaan nasihat → `refuse=true` |
| F4 | Injeksi | Instruksi ke pemeriksa tidak mengubah label; `safety_meta.injection_detected=true` |
| F5 | Privasi | Tidak ada teks mentah di penyimpanan; PII tersamarkan; retensi 7 hari |
| F6 | Latihan | Soal berikutnya menyesuaikan kategori terlemah dan sulitnya; umpan balik memuat aturan |
| F7 | Dashboard | Angka kosong ditampilkan jujur; klaim pre/post hanya bila n ≥ 20 |
| F8 | Degradasi | Snowflake mati → analisis tetap 200, dashboard memakai data lokal |
| F9 | Aksesibilitas | Fokus terlihat, `aria-live` pada hasil, kontras ≥ 4,5:1, teks ≥ 17px |
| F10 | Idempotensi | Header `Idempotency-Key` mengembalikan respons sama dalam 10 menit |
| F11 | Tes pre/post | 10 soal, skor 0–100 dikirim ke `/api/prepost`; dashboard hanya mengklaim delta bila n ≥ 20 |

## 7. Non-fungsional

- **Latensi:** p95 analisis < 2 detik tanpa model eksternal.
- **Ketersediaan:** jalur analisis tidak bergantung pada layanan berbayar.
- **Keamanan:** rate limit 30 permintaan/menit/IP; input maksimal 4.000 karakter;
  header keamanan dasar; tidak ada rahasia di klien.
- **Biaya:** nol biaya wajib; Snowflake hanya jika kredensial disediakan.

## 8. Metrik keberhasilan (versi hackathon)

| Metrik | Target | Cara ukur |
| --- | --- | --- |
| Waktu sampai tiga langkah | < 90 detik | Demo terukur |
| Akurasi pada test sintetis | ≥ 75% | `npm run eval` |
| Recall penipuan | ≥ 65% | idem |
| Alarm palsu | ≤ 10% | idem |
| Pemahaman aturan | 8/10 benar | Latihan komunitas |
| Penolakan saat ragu | 100% untuk input ambigu | Uji manual |

Metrik ini **bukan** bukti efektivitas di dunia nyata (lihat audit).

## 9. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Pesan resmi terlihat seperti penipuan | Alarm palsu, pengguna panik | Bahasa hati-hati, langkah verifikasi resmi, metrik alarm palsu |
| Penipu meniru bahasa resmi | Lolos deteksi | Latihan adversarial, daftar batasan, edukasi “jangan hanya percaya skor” |
| Data sintetis terlalu mudah | Klaim berlebihan | Split uji, baseline kata kunci, pernyataan sirkularitas |
| Snowflake tidak siap saat demo | Dashboard kosong | Fallback lokal dan mode memori |
| Pengguna menempel data sensitif | Pelanggaran privasi | Peringatan di formulir, redaksi sebelum simpan, retensi pendek |

## 10. Rilis

Versi 0.1.0 mencakup F1–F10 dengan engine deterministik, knowledge base 120 dokumen
(40 sumber terverifikasi HTTP 200), halaman tes pre/post, serta adapter Snowflake yang
diuji terhadap mock SQL API. Cortex/Gemma dan studi lapangan belum diaktifkan dan tidak
diklaim.
