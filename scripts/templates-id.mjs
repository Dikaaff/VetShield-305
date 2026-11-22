// Indonesian scenario templates. Placeholders are filled with obviously fake data.
const S = (text, category, difficulty, flags, rule, channel = "sms") => ({
  text, category, difficulty, flags, rule, channel,
});

export const ID_SCAM = [
  S("PENTING: akun Anda akan diblokir hari ini. Verifikasi sekarang di {domain} atau kirim kode OTP Anda ke {phone}. Ref {ref}", "bank", "easy", ["Mengancam akun diblokir", "Meminta kode OTP", "Tautan verifikasi mendesak"], "Bank tidak meminta OTP lewat pesan."),
  S("Transfer Rp{amount} ke rekening Anda gagal. Hubungi {phone} dan sebutkan kode OTP agar dana dikembalikan. Ref {ref}", "bank", "easy", ["Kode OTP diminta lewat telepon", "Nomor tidak resmi"], "Pengembalian dana tidak pernah butuh OTP."),
  S("Kami dari bagian keamanan bank Anda. Ada transaksi mencurigakan Rp{amount}. Balas pesan ini dengan PIN Anda untuk membatalkan. Ref {ref}", "bank", "medium", ["PIN diminta lewat pesan", "Nada mendesak"], "PIN tidak pernah diminta lewat pesan."),
  S("Halo Bu {name}, saya {officer} dari layanan kartu. Kartu Anda akan diganti karena pembaruan sistem. Mohon konfirmasi nomor kartu dan tanggal lahir lewat email ini. Ref {ref}", "bank", "hard", ["Meminta data kartu", "Mengaku petugas bank"], "Penggantian kartu diproses di aplikasi resmi."),
  S("Bantuan veteran Anda ditangguhkan. Lengkapi data di {domain} dalam 24 jam atau pembayaran dihentikan. Ref {ref}", "benefits", "easy", ["Mengaku lembaga resmi", "Batas waktu 24 jam", "Tautan tidak resmi"], "Status bantuan dicek di akun resmi."),
  S("Kantor bantuan sosial: dana bansos Rp{amount} menunggu. Kirim foto KTP dan nomor rekening ke {phone}. Ref {ref}", "benefits", "medium", ["Meminta foto KTP", "Meminta nomor rekening"], "Bantuan resmi tidak meminta data lewat SMS."),
  S("Lowongan kerja dari rumah, gaji harian Rp{amount}, tanpa pengalaman. Kirim biaya administrasi Rp150.000 ke rekening kami. Ref {ref}", "job", "easy", ["Kerja mudah", "Biaya di muka"], "Pekerjaan asli tidak memungut biaya."),
  S("Tim rekrutmen: Anda lolos seleksi. Untuk mendapatkan peralatan kerja, transfer deposit Rp{amount} hari ini. Ref {ref}", "job", "medium", ["Deposit di muka", "Mendesak"], "Pemberi kerja tidak meminta deposit."),
  S("Paket Anda tertahan di bea cukai. Bayar biaya kirim Rp{amount} lewat {domain} dalam 24 jam. Ref {ref}", "delivery", "easy", ["Biaya tambahan", "Tautan mencurigakan"], "Bea cukai tidak menagih lewat SMS."),
  S("Kurir: paket {ref} gagal diantar. Konfirmasi alamat dan bayar biaya kirim ulang ke {phone}.", "delivery", "medium", ["Biaya kirim ulang", "Nomor pribadi"], "Lacak paket hanya di situs kurir resmi."),
  S("Halo, saya sudah transfer Rp{amount}, kelebihan Rp500.000. Mohon kembalikan ke rekening ini. Lanjut di WhatsApp ya. Ref {ref}", "marketplace", "medium", ["Kelebihan transfer", "Pindah ke chat pribadi"], "Kelebihan bayar adalah modus umum."),
  S("Bu {name}, barang sudah saya kirim. Mohon konfirmasi lewat chat pribadi agar cepat. Ref {ref}", "marketplace", "hard", ["Pindah ke chat pribadi", "Tanpa bukti resmi"], "Transaksi aman tetap di dalam aplikasi."),
  S("Sayang, saya butuh uang untuk biaya rumah sakit anak saya. Kirim Rp{amount} hari ini ya. Jangan bilang siapa-siapa dulu. Ref {ref}", "romance", "medium", ["Permintaan uang", "Meminta rahasia"], "Permintaan uang dari kenalan online adalah tanda berhenti."),
  S("Komputer Anda terinfeksi virus. Instal AnyDesk dan berikan kode akses agar teknisi kami membantu. Ref {ref}", "tech_support", "easy", ["Akses jarak jauh", "Menakut-nakuti virus"], "Layanan resmi tidak meminta akses jarak jauh."),
  S("Microsoft Support: akun Anda diretas. Hubungi {phone} dan instal aplikasi akses jarak jauh segera. Ref {ref}", "tech_support", "medium", ["Mengaku perusahaan besar", "Akses jarak jauh"], "Dukungan resmi tidak menghubungi lewat pesan."),
  S("Investasi kripto dijamin untung 30% per bulan. Minimal transfer Rp{amount} ke dompet USDT kami. Ref {ref}", "investment", "easy", ["Keuntungan dijamin", "Transfer kripto"], "Keuntungan pasti adalah tanda penipuan."),
  S("Pengembalian pajak Rp{amount} siap. Isi data di {domain} dengan NIK dan nomor rekening. Ref {ref}", "tax", "medium", ["Pengembalian pajak", "Meminta NIK"], "Pengembalian pajak tidak diminta lewat tautan."),
  S("Bu, ini saya. Saya kecelakaan dan dirawat di rumah sakit. Kirim uang Rp{amount} sekarang, jangan telepon dulu. Ref {ref}", "family_emergency", "easy", ["Cerita darurat", "Minta tidak ditelepon"], "Selalu telepon nomor lama keluarga."),
  S("Selamat! Anda menang hadiah Rp{amount}. Bayar biaya klaim Rp250.000 ke {phone} hari ini. Ref {ref}", "prize", "medium", ["Hadiah tak diikuti", "Biaya klaim"], "Hadiah asli tidak memungut biaya."),
  S("Ada login baru ke akun Anda. Verifikasi di {domain} dengan kata sandi Anda agar akun tidak diblokir. Ref {ref}", "account_security", "medium", ["Meminta kata sandi", "Ancaman blokir", "Tautan mencurigakan"], "Kata sandi hanya dimasukkan di aplikasi resmi."),
];

export const ID_LEGIT = [
  S("Transaksi Rp{amount} di kartu Anda pada {time}. Jika ini bukan Anda, telepon nomor di belakang kartu Anda. Kami tidak pernah meminta PIN atau kode OTP. Ref {ref}", "bank", "hard", ["Transaksi tidak dikenal", "Nada mendesak"], "Pesan resmi mengarahkan ke nomor di belakang kartu."),
  S("Kartu Anda diblokir sementara karena percobaan login berulang. Hubungi nomor resmi di belakang kartu. Tidak perlu membalas pesan ini. Ref {ref}", "bank", "hard", ["Akun diblokir", "Minta hubungi bank"], "Blokir sementara adalah prosedur keamanan nyata."),
  S("Pesanan #{ref} telah dikirim. Lacak lewat aplikasi resmi kami. Tidak ada biaya tambahan. Ref {ref}", "delivery", "easy", ["Status pengiriman"], "Notifikasi pengiriman biasa."),
  S("Kurir kami akan datang {time}. Jika Anda tidak di rumah, pesanan disimpan di kantor pos terdekat. Ref {ref}", "delivery", "easy", ["Jadwal kurir"], "Informasi jadwal tanpa permintaan data."),
  S("Kode verifikasi Anda {code}. Jangan bagikan kode ini kepada siapa pun. Jika Anda tidak meminta kode ini, abaikan pesan ini.", "account_security", "hard", ["Kode verifikasi", "Peringatan berbagi kode"], "Kode OTP asli justru melarang dibagikan."),
  S("Kami mendeteksi login dari perangkat baru. Jika itu Anda, tidak perlu tindakan. Jika bukan, ganti kata sandi lewat aplikasi resmi. Ref {ref}", "account_security", "medium", ["Login baru", "Saran ganti sandi"], "Notifikasi keamanan resmi."),
  S("Pengingat: lapor pajak tahunan paling lambat 31 Maret. Masuk ke situs resmi pajak. Kami tidak meminta data lewat pesan. Ref {ref}", "tax", "medium", ["Batas waktu", "Lembaga resmi"], "Pengingat resmi tanpa tautan mencurigakan."),
  S("Jadwal pemeriksaan kesehatan veteran gratis hari Sabtu pukul 9 di balai warga. Tidak perlu mendaftar. Ref {ref}", "benefits", "easy", ["Lembaga resmi"], "Pengumuman layanan gratis."),
  S("Pesanan Anda sedang dikemas. Pembayaran ditahan oleh aplikasi sampai barang diterima. Ref {ref}", "marketplace", "easy", ["Status pesanan"], "Perlindungan pembayaran platform."),
  S("Terima kasih atas lamaran Anda di perusahaan kami. Jadwal wawancara {time} lewat tautan resmi di akun pelamar Anda. Ref {ref}", "job", "medium", ["Proses rekrutmen"], "Wawancara lewat akun pelamar resmi."),
  S("Anda terdaftar dalam undian pelanggan dan menang voucher belanja Rp{amount}. Klaim di aplikasi resmi, tanpa biaya. Ref {ref}", "prize", "hard", ["Menang hadiah", "Klaim tanpa biaya"], "Hadiah dari undian yang diikuti."),
  S("Halo, ini pengingat arisan keluarga {time} di rumah Bu {name}. Bawa makanan ringan. Ref {ref}", "other", "easy", ["Pesan pribadi"], "Pesan keluarga biasa."),
];
