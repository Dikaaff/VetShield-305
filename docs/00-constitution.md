# VetShield 305 — Constitution

Versi 1.0 · November 2026 · Berlaku untuk seluruh kode, prompt, data, dan materi demo.

Dokumen ini adalah kontrak. Jika sebuah fitur bertentangan dengan pasal di bawah,
fitur itu yang dibatalkan, bukan pasalnya.

## Pasal 1 — Pengguna yang dilindungi

Sasaran utama adalah veteran berusia 60+, lansia, dan anggota keluarga yang membantu
mereka. Konsekuensinya:

1. Semua teks UI minimal 17px, kontras minimal 4,5:1, dan dapat dibaca dengan pembaca
   layar.
2. Tidak ada batas waktu buatan, hitung mundur, atau desain yang membuat pengguna
   merasa harus segera bertindak.
3. Setiap layar punya satu tindakan utama yang jelas; tidak ada menu tersembunyi.

## Pasal 2 — Kejujuran di atas kepastian

1. Kami tidak pernah menyatakan bahwa sebuah pesan "pasti aman" atau "pasti penipuan".
   Label selalu berupa tingkat kecurigaan, bukan putusan.
2. Setiap hasil menyebutkan apa yang tidak bisa diperiksa (misalnya identitas pengirim)
   dan kemungkinan salah menilai pesan resmi.
3. Ketika bukti tidak cukup, keluaran wajib `insufficient_info` dengan
   `refuse=true`, bukan tebakan.
4. Kami tidak memberi nasihat hukum, medis, atau keuangan. Permintaan seperti itu
   ditolak dengan sopan dan diarahkan ke saluran resmi.

## Pasal 3 — Tiga langkah, lima menit

1. Setiap hasil analisis berisi **tepat tiga** tindakan aman.
2. Total waktu yang diperlukan kurang dari lima menit.
3. Tindakan pertama selalu mengurangi risiko segera: jangan klik, jangan balas,
   jangan bayar.
4. Tidak ada tindakan yang meminta pengguna mengirim uang, kata sandi, atau dokumen
   pribadi ke layanan ini.

## Pasal 4 — Bahasa yang bisa dipahami

1. Bahasa keluaran mengikuti `{USER_LANG}`; default `id`.
2. Tingkat baca maksimal kelas 6: kalimat pendek, kata sehari-hari, tanpa jargon.
3. Istilah teknis wajib dijelaskan di tempat pertama ia muncul.
4. Bahasa tidak pernah menyalahkan korban. Kalimat "Anda seharusnya lebih hati-hati"
   dilarang.

## Pasal 5 — Privasi sejak awal

1. Teks mentah tidak disimpan. Yang disimpan hanya hash dan cuplikan yang sudah
   disamarkan (telepon, rekening, email, NIK, nomor kartu).
2. Retensi default 7 hari dan dapat dikonfigurasi.
3. Penyimpanan bersifat opt-out dan dijelaskan sebelum pengguna menekan tombol.
4. Data hanya dipakai untuk memperbaiki alat, tidak dijual, tidak dipakai iklan.
5. Data sintetis saja untuk pengembangan dan evaluasi. Tidak ada pesan nyata di korpus.

## Pasal 6 — Keselamatan mesin

1. Instruksi yang ditujukan kepada pemeriksa (prompt injection) tidak boleh mengubah
   hasil. Pesan seperti itu ditandai dan tidak dinilai sebagai pesan biasa.
2. Bila keyakinan di bawah `{MIN_CONFIDENCE}`, hasil menjadi `insufficient_info`.
3. Bila layanan pendukung (Snowflake, model bahasa) gagal, pemeriksaan tetap berjalan
   dengan engine deterministik dan menandai `degraded=true`.
4. Tidak ada keputusan keuangan, hukum, atau medis yang diotomatiskan.

## Pasal 7 — Dapat didemokan

1. Alur utama selesai di bawah 90 detik, dari membuka halaman sampai melihat tiga
   langkah aman.
2. Demo punya jalur cadangan yang tidak membutuhkan internet atau kredensial cloud.
3. Klaim di Devpost hanya memakai angka dari `data/eval-results.json` dan selalu
   menyebut bahwa data bersifat sintetis.

## Pasal 8 — Kewajiban menyatakan batasan

Setiap rilis wajib memuat daftar batasan yang diketahui, termasuk:

- evaluasi pada korpus sintetis bersifat sirkular karena template dan aturan dibuat
  oleh penulis yang sama;
- knowledge base berisi 120 dokumen dari 40 sumber yang diverifikasi HTTP 200 pada
  22 November 2026, tetapi halaman bisa berubah setelah tanggal itu;
- Cortex/Gemma belum dipanggil pada versi ini;
- sesi latihan disimpan di memori dan hilang saat server restart;
- klaim pre/post membutuhkan minimal 20 responden.

Menghapus daftar ini dari rilis adalah pelanggaran konstitusi.

## Pasal 9 — Perubahan

Perubahan pasal harus disertai alasan tertulis di `docs/13-audit.md` dan tidak boleh
melemahkan Pasal 2, 4, atau 5.
