import { ShieldMark } from "@/components/brand";

export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[500px] px-1 pb-6 sm:px-4 lg:max-w-none lg:px-0">
      <div
        aria-hidden="true"
        className="absolute -right-2 top-8 h-[74%] w-[82%] rounded-[46%_54%_44%_56%/52%_44%_56%_48%] bg-sage sm:right-0"
      />

      <div className="relative z-10 rounded-[26px] border border-forest-900/30 bg-forest-900 p-4 text-cream shadow-lift sm:p-5 lg:rotate-[-1.5deg]">
        <div className="flex items-center justify-between gap-3 border-b border-cream/15 pb-3">
          <div className="flex items-center gap-2">
            <ShieldMark tone="cream" className="h-6" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-cream/60">
              Pemeriksaan terakhir
            </span>
          </div>
          <span className="rounded-full border border-cream/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cream/70">
            SMS
          </span>
        </div>

        <p className="mt-4 font-display text-[17px] leading-snug text-cream/95 sm:text-[18px]">
          “PENTING: akun Anda akan diblokir hari ini. Kirim kode OTP Anda ke nomor ini.”
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-cream/65">Skor risiko</p>
            <p className="font-display text-[42px] font-semibold leading-none">
              82<span className="text-lg text-cream/60">/100</span>
            </p>
          </div>
          <span className="rounded-full bg-orange px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]">
            Risiko tinggi
          </span>
        </div>

        <ul className="mt-4 space-y-1.5 border-t border-cream/15 pt-3 text-[13px] text-cream/70">
          <li className="flex gap-2">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-orange" />
            Meminta kode OTP lewat pesan
          </li>
          <li className="flex gap-2">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-orange" />
            Mengancam akun diblokir hari ini
          </li>
        </ul>

        <div className="mt-4 rounded-xl bg-cream/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cream/65">
            Tiga langkah aman
          </p>
          <ol className="mt-2 grid grid-cols-1 gap-1.5 text-[12.5px] text-cream/80">
            <li className="flex gap-2"><span className="font-mono text-cream/60">01</span> Jangan balas atau kirim kode.</li>
            <li className="flex gap-2"><span className="font-mono text-cream/60">02</span> Telepon nomor di belakang kartu.</li>
            <li className="flex gap-2"><span className="font-mono text-cream/60">03</span> Minta teman menemani.</li>
          </ol>
        </div>
      </div>

      <div className="relative z-20 -mt-3 ml-auto w-[88%] rounded-2xl border border-line bg-paper p-4 shadow-lift sm:w-[80%] lg:rotate-[1.5deg]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-forest/65">
            Kode OTP asli
          </p>
          <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-900">
            Tampak wajar
          </span>
        </div>
        <p className="mt-2 text-[13.5px] leading-snug text-forest/80">
          “Jangan bagikan kode ini kepada siapa pun. Jika Anda tidak meminta kode ini,
          abaikan pesan ini.”
        </p>
        <p className="mt-2 border-t border-line pt-2 text-[11px] text-forest/65">
          Sumber: FTC · terverifikasi
        </p>
      </div>

      <div className="absolute bottom-0 left-4 z-30 hidden items-center gap-2 rounded-full bg-orange px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lift sm:flex lg:-left-4">
        3 langkah · &lt; 5 menit
      </div>
    </div>
  );
}
