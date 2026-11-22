# Knowledge base dan grounding

Versi 0.1.0 · 120 dokumen dari 40 sumber · verifikasi terakhir 22 November 2026.

## Prinsip

1. Setiap sitasi harus menunjuk halaman yang benar-benar ada dan bisa dibuka.
2. Klaim ditulis satu kalimat dan harus didukung isi halaman, bukan kesan umum.
3. Tidak ada URL yang dikarang. Sumber yang gagal diverifikasi tidak dipakai untuk
   sitasi, meskipun entrinya tetap tersimpan.
4. Terjemahan klaim ke id/en/es adalah terjemahan penulis, bukan kutipan resmi.

## Komposisi

- 40 sumber resmi: regulator, lembaga perlindungan konsumen, lembaga keamanan siber,
  dan pusat pelaporan.
- 3 bahasa per sumber → **120 dokumen**.
- Setiap dokumen memiliki `id`, `title`, `source_url`, `publisher`, `jurisdiction`,
  `doc_type`, `language`, `categories`, `claim`, dan status verifikasi.

Sebaran yurisdiksi: US, UK, AU, EU, ID, dan GLOBAL. Sebaran kategori mencakup seluruh
13 kategori produk, sehingga setiap kategori punya minimal dua sitasi terverifikasi.

## Pipeline

```bash
npm run verify:knowledge   # HTTP check 40 URL, tulis data/knowledge-verification.json
npm run data:knowledge     # verify + generate src/lib/knowledge-base.ts (120 docs)
```

`scripts/verify-knowledge.mjs` mencoba dua kali per URL dengan timeout 12 detik dan
User-Agent browser. Status 200–399 dianggap terverifikasi. Jika pemeriksaan ulang gagal
karena gangguan sementara, status sukses sebelumnya dipertahankan dan kegagalan dicatat
di `lastFailureAt` untuk ditinjau.

`scripts/build-knowledge.mjs` menggabungkan katalog dan hasil verifikasi, lalu menulis
ulang `src/lib/knowledge-base.ts`. File itu di-generate; jangan diedit tangan.

## Hasil verifikasi

| Tanggal | Sumber | Terverifikasi | Dokumen |
| --- | --- | --- | --- |
| 22 Nov 2026 | 40 | 40 (HTTP 200) | 120 |

Contoh sumber: FTC (phishing, gift card, lowongan kerja, romansa, SMS), CISA, IC3,
SSA, VA, IRS, CFPB, USA.gov, IdentityTheft.gov, USPIS, Medicare, NCSC, Scamwatch,
Cyber.gov.au, AARP, FCA, Interpol, Europol, OJK, Bank Indonesia, Komdigi, BSSN,
Google, dan Microsoft.

## Cara sitasi dipilih

`citationsFor(category, language)`:

1. Ambil dokumen terverifikasi yang cocok kategori dan bahasa.
2. Jika kurang dari dua, tambah dokumen berbahasa Inggris (dan Indonesia).
3. Buang duplikat URL, ambil maksimal dua.
4. Kembalikan `doc_id`, `title`, `claim`, dan `url` agar pengguna bisa membuka sumber.

UI menampilkan tautan “Buka sumber resmi (terverifikasi)”.

## Batasan

1. Halaman bisa berubah setelah verifikasi; status dicek ulang sebelum rilis.
2. Beberapa situs memblokir klien non-browser; sumber seperti itu tidak dimasukkan.
3. Klaim diterjemahkan dan diringkas; pengguna tetap harus membaca halaman asli untuk
   konteks lengkap.
4. Verifikasi HTTP 200 membuktikan halaman ada, bukan bahwa klaim kita sempurna.
5. Knowledge base tidak menggantikan nasihat hukum, medis, atau keuangan.
6. Tidak ada pencarian semantik (Cortex Search) pada versi ini; pemilihan sitasi
   memakai kategori dan bahasa.
