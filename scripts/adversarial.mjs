const S = (text, category, difficulty, flags, rule, kind, channel = "email") => ({
  text, category, difficulty, flags, rule, kind, channel,
});

/** Polished, polite messages that are still scams: no typos, no ALL CAPS. */
export const SUBTLE_SCAMS = {
  id: [
    S("Halo Bu {name}, ini {officer} dari bagian keuangan yayasan. Mulai bulan ini donasi dialihkan ke rekening baru {acct}. Mohon kirim seperti biasa. Terima kasih.", "other", "hard", ["Rekening baru", "Permintaan transfer"], "Perubahan rekening harus diverifikasi lewat nomor lama.", "legit_looking_scam"),
    S("Bu {name}, ini dokter {officer} dari klinik. Hasil laboratorium Anda perlu tindak lanjut. Silakan transfer biaya konsultasi Rp{amount} ke rekening {acct} sebelum datang.", "other", "hard", ["Mengaku tenaga medis", "Transfer ke rekening pribadi"], "Klinik resmi menagih lewat loket atau aplikasi.", "legit_looking_scam"),
    S("Halo, saya dari tim pengadaan. Invoice #{ref} sudah disetujui. Mohon kirim faktur terbaru ke alamat email baru kami agar pembayaran tidak tertunda.", "other", "hard", ["Perubahan rekening/email", "Menekan waktu"], "Perubahan data vendor diverifikasi lewat telepon.", "legit_looking_scam"),
    S("Terima kasih sudah berlangganan. Kami memperbarui sistem pembayaran. Mohon perbarui nomor kartu Anda dengan membalas email ini.", "bank", "hard", ["Meminta nomor kartu", "Nada sopan"], "Nomor kartu tidak pernah diminta lewat balasan email.", "legit_looking_scam"),
    S("Pak {name}, saya tetangga baru di blok C. Kurir salah mengantar paket ke rumah Anda. Nanti saya ambil, tolong jangan dibuka dulu ya.", "other", "hard", ["Pretext paket", "Meminta akses barang"], "Barang tak dikenal sebaiknya tidak diterima.", "legit_looking_scam"),
    S("Bu, ini cucu Anda, saya ganti nomor. Besok saya mampir. Tolong siapkan uang tunai Rp{amount} untuk biaya kuliah, jangan bilang mama dulu.", "family_emergency", "hard", ["Nomor baru", "Permintaan uang", "Meminta rahasia"], "Nomor baru harus diverifikasi lewat nomor lama.", "legit_looking_scam"),
    S("Selamat pagi, saya dari layanan pelanggan. Kami mencatat pembayaran Anda belum masuk. Mohon kirim bukti transfer dan nomor rekening ke email ini agar segera diproses.", "bank", "hard", ["Meminta nomor rekening", "Mengaku layanan resmi"], "Bukti pembayaran dicek di aplikasi resmi.", "legit_looking_scam"),
    S("Halo Bu {name}, ini admin komunitas. Kami mendata ulang anggota. Mohon balas dengan NIK dan nomor rekening untuk pencairan dana kegiatan.", "benefits", "hard", ["Meminta NIK", "Meminta rekening"], "Pendataan resmi tidak lewat balasan pesan.", "legit_looking_scam"),
  ],
  en: [
    S("Hi {name}, this is {officer} from the finance team. Our bank details have changed. Please send this month's invoice payment to the new account {acct}.", "other", "hard", ["New bank account", "Payment request"], "Changed bank details must be verified by phone.", "legit_looking_scam"),
    S("Hello, this is the clinic billing desk. Your lab results need follow-up. Please send the {amount} consultation fee to {acct} before your visit.", "other", "hard", ["Impersonates clinic", "Private account payment"], "Clinics bill through official systems.", "legit_looking_scam"),
    S("Thank you for subscribing. We updated our payment system. Please reply with your new card number so your plan continues.", "bank", "hard", ["Asks for card number", "Polite tone"], "Card numbers are never collected by email reply.", "legit_looking_scam"),
    S("Hi, I am your new neighbour in unit C. The courier left my parcel at your door. Please keep it closed until I collect it tonight.", "other", "hard", ["Parcel pretext"], "Unexpected parcels should be refused.", "legit_looking_scam"),
  ],
  es: [
    S("Hola {name}, soy {officer} del equipo financiero. Nuestros datos bancarios cambiaron. Envíe el pago a la nueva cuenta {acct}, por favor.", "other", "hard", ["Cuenta nueva", "Pide pago"], "Verifique cambios de cuenta por teléfono.", "legit_looking_scam"),
    S("Buenos días, soy del servicio al cliente. Su pago no aparece. Responda con su número de tarjeta para revisarlo.", "bank", "hard", ["Pide tarjeta", "Tono amable"], "Nunca se pide la tarjeta por correo.", "legit_looking_scam"),
    S("Hola, soy su nuevo vecino del bloque C. El repartidor dejó mi paquete en su puerta. No lo abra, por favor.", "other", "hard", ["Pretexto de paquete"], "No acepte paquetes inesperados.", "legit_looking_scam"),
  ],
};

/** Genuine messages that pattern-match like scams: urgency, codes, money. */
export const SCARY_LEGIT = {
  id: [
    S("Peringatan keamanan: ada percobaan masuk ke akun Anda. Kami membekukan akun sementara. Masuk lewat aplikasi resmi. Kami tidak pernah meminta kode Anda. Ref {ref}", "account_security", "hard", ["Akun dibekukan", "Nada mendesak"], "Notifikasi keamanan resmi tanpa tautan.", "scam_looking_legit"),
    S("Tagihan #{ref}: Rp{amount} jatuh tempo {time}. Bayar lewat aplikasi resmi atau kantor pos terdekat.", "other", "hard", ["Batas waktu", "Nominal besar"], "Tagihan resmi dengan kanal pembayaran jelas.", "scam_looking_legit"),
    S("Kami mendeteksi transaksi Rp{amount} di kartu Anda. Jika bukan Anda, hubungi nomor di belakang kartu. Ref {ref}", "bank", "hard", ["Transaksi besar", "Minta hubungi bank"], "Alur verifikasi resmi lewat nomor kartu.", "scam_looking_legit"),
    S("Selamat, Anda menang voucher dari undian pelanggan yang Anda ikuti. Klaim di aplikasi resmi, tanpa biaya. Ref {ref}", "prize", "hard", ["Menang hadiah", "Tanpa biaya"], "Hadiah dari undian yang benar-benar diikuti.", "scam_looking_legit"),
    S("Pemberitahuan: layanan air akan diputus sementara {time} karena perbaikan pipa. Tidak perlu tindakan. Ref {ref}", "other", "hard", ["Layanan diputus", "Waktu singkat"], "Pengumuman gangguan layanan.", "scam_looking_legit"),
    S("Kode OTP Anda {code}. Jangan bagikan kode ini kepada siapa pun, termasuk petugas kami.", "account_security", "hard", ["Kode OTP", "Peringatan berbagi"], "Pesan OTP asli justru melarang berbagi.", "scam_looking_legit"),
    S("Ada pembayaran Rp{amount} yang tertahan di aplikasi karena verifikasi alamat. Buka aplikasi resmi dan perbarui alamat Anda. Ref {ref}", "delivery", "hard", ["Pembayaran tertahan", "Verifikasi alamat"], "Verifikasi hanya di aplikasi resmi.", "scam_looking_legit"),
    S("Pengadilan akan mengirim surat resmi terkait denda lalu lintas #{ref}. Tidak ada pembayaran lewat pesan ini. Informasi lengkap di kantor resmi.", "other", "hard", ["Kata pengadilan", "Denda"], "Surat resmi bukan permintaan uang.", "scam_looking_legit"),
  ],
  en: [
    S("Security alert: someone tried to sign in to your account. We locked it temporarily. Open the official app. We never ask for your code. Ref {ref}", "account_security", "hard", ["Account locked", "Urgent tone"], "Official notice without a link.", "scam_looking_legit"),
    S("Invoice #{ref} for {amount} is due {time}. Pay in the official app or at any post office.", "other", "hard", ["Deadline", "Large amount"], "Official bill with clear payment channels.", "scam_looking_legit"),
    S("We detected a {amount} charge on your card. If this was not you, call the number on the back of your card. Ref {ref}", "bank", "hard", ["Large charge", "Call the bank"], "Official verification path.", "scam_looking_legit"),
    S("Your one-time code is {code}. Do not share it with anyone, including our staff.", "account_security", "hard", ["One-time code"], "Real OTP messages forbid sharing.", "scam_looking_legit"),
  ],
  es: [
    S("Alerta de seguridad: alguien intentó entrar en su cuenta. La bloqueamos temporalmente. Abra la aplicación oficial. Nunca pedimos su código. Ref {ref}", "account_security", "hard", ["Cuenta bloqueada"], "Aviso oficial sin enlace.", "scam_looking_legit"),
    S("Su factura #{ref} por {amount} vence {time}. Pague en la aplicación oficial o en la oficina de correos.", "other", "hard", ["Fecha límite"], "Factura oficial con canales claros.", "scam_looking_legit"),
    S("Detectamos un cargo de {amount} en su tarjeta. Si no fue usted, llame al número del reverso. Ref {ref}", "bank", "hard", ["Cargo grande"], "Verificación oficial por teléfono.", "scam_looking_legit"),
  ],
};
