import { Analyzer } from "@/components/analyzer";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section aria-labelledby="hero-title" className="pt-4">
        <p className="inline-flex items-center gap-2 rounded-full bg-shield-100 px-3 py-1 text-[14px] font-semibold text-shield-900">
          <span aria-hidden="true">●</span> Gratis · tanpa akun · bahasa sederhana
        </p>
        <h1
          id="hero-title"
          className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] text-ink sm:text-5xl"
        >
          Ragu dengan sebuah pesan? Periksa dulu, baru bertindak.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/85 sm:text-xl">
          VetShield 305 membantu veteran, lansia, dan keluarga mereka mengenali pesan
          penipuan. Anda dapat penjelasan singkat, tiga langkah aman, dan latihan singkat
          agar tidak mudah tertipu lagi.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium text-shield-900">
          <li>✓ Tidak menyimpan teks mentah</li>
          <li>✓ Tidak pernah bilang “pasti aman”</li>
          <li>✓ Hasil dalam hitungan detik</li>
        </ul>
      </section>

      <Analyzer />

      <section aria-labelledby="why-title" className="grid gap-4 sm:grid-cols-3">
        <h2 id="why-title" className="sr-only">
          Cara kerja
        </h2>
        <div className="rounded-xl border border-shield-100 bg-white p-5">
          <h3 className="text-lg font-bold text-ink">1. Periksa tandanya</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-ink/80">
            Mesin mencocokkan pesan dengan pola penipuan yang dikenal, lalu menimbang
            bukti yang meredakan, seperti nomor resmi di belakang kartu.
          </p>
        </div>
        <div className="rounded-xl border border-shield-100 bg-white p-5">
          <h3 className="text-lg font-bold text-ink">2. Pahami alasannya</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-ink/80">
            Penjelasan ditulis pada tingkat baca kelas 6, tanpa istilah teknis. Setiap
            panduan merujuk ke dokumen sumber yang bisa Anda buka.
          </p>
        </div>
        <div className="rounded-xl border border-shield-100 bg-white p-5">
          <h3 className="text-lg font-bold text-ink">3. Lakukan tiga langkah</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-ink/80">
            Bukan daftar panjang: tepat tiga tindakan yang bisa selesai di bawah lima
            menit, dimulai dari jangan klik dan jangan balas.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="limits-title"
        className="rounded-2xl border-l-4 border-alert-mid bg-white p-6"
      >
        <h2 id="limits-title" className="text-xl font-bold text-ink">
          Yang alat ini tidak bisa lakukan
        </h2>
        <ul className="mt-3 grid gap-2 text-[16px] leading-relaxed text-ink/85 sm:grid-cols-2">
          <li>• Memastikan pengirim asli atau palsu.</li>
          <li>• Menggantikan laporan resmi ke bank atau polisi.</li>
          <li>• Memberi nasihat hukum, medis, atau keuangan.</li>
          <li>• Menjamin pesan aman hanya karena skornya rendah.</li>
        </ul>
        <p className="mt-4 text-[15px] text-ink/75">
          Jika skor rendah tetapi pesan meminta uang, data pribadi, atau kode, tetap
          berhenti dan verifikasi lewat saluran resmi.
        </p>
      </section>
    </div>
  );
}
