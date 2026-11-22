import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  Clock3,
  Lock,
  MessageSquareQuote,
} from "lucide-react";
import { Analyzer } from "@/components/analyzer";
import { HeroPreview } from "@/components/hero-preview";
import { Marquee } from "@/components/magicui/marquee";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PRINCIPLES = [
  "Tidak pernah bilang “pasti aman”",
  "120 sumber terverifikasi",
  "Tepat tiga langkah aman",
  "Teks mentah tidak disimpan",
  "Bahasa kelas 6",
  "Tetap hidup tanpa cloud",
];

const STEPS = [
  {
    number: "01",
    title: "Periksa tandanya",
    body: "Pesan dicocokkan dengan 25 pola penipuan yang dikenal, lalu ditimbang dengan bukti yang meredakan — seperti nomor resmi di belakang kartu.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Pahami alasannya",
    body: "Penjelasan satu paragraf pada tingkat baca kelas 6. Setiap panduan merujuk ke sumber resmi yang bisa Anda buka sendiri.",
    icon: MessageSquareQuote,
  },
  {
    number: "03",
    title: "Lakukan tiga langkah",
    body: "Bukan daftar panjang: tepat tiga tindakan yang selesai di bawah lima menit, dimulai dari jangan klik dan jangan balas.",
    icon: Clock3,
  },
];

const FAQ = [
  {
    q: "Apakah ini menggantikan bank atau lembaga resmi?",
    a: "Tidak. VetShield hanya membantu Anda berhenti dan memeriksa. Untuk urusan rekening, bantuan, atau pajak, selalu gunakan nomor dan akun resmi yang Anda cari sendiri.",
  },
  {
    q: "Apakah teks pesan saya disimpan?",
    a: "Tidak. Yang disimpan hanya hash dan cuplikan yang sudah disamarkan, maksimal 7 hari. Anda juga bisa mematikan penyimpanan di formulir.",
  },
  {
    q: "Kenapa hasilnya tidak pernah bilang “pasti”?",
    a: "Karena tidak ada alat yang bisa memastikan identitas pengirim hanya dari teks. Kepastian palsu berbahaya; ketidakpastian yang jujur membuat Anda memeriksa lewat saluran yang benar.",
  },
  {
    q: "Apakah datanya nyata?",
    a: "Korpus evaluasi 500 pesan seluruhnya sintetis. Angkanya mengukur konsistensi internal, bukan performa dunia nyata. Kami menuliskannya apa adanya di halaman Data.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-forest/10">
        <div aria-hidden="true" className="hero-grid absolute inset-0" />
        <div className="relative mx-auto max-w-[1240px] px-5 pb-14 pt-12 sm:px-8 sm:pt-16 lg:pb-24 lg:pt-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div className="animate-fade-up">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-orange" />
                <p className="eyebrow text-forest/60">
                  Penipuan tidak selalu berbunyi seperti penipuan
                </p>
              </div>

              <h1 className="mt-5 font-display text-[clamp(3.4rem,8.6vw,6.6rem)] font-semibold leading-[0.9] text-forest-900">
                Berhenti.
                <br />
                Periksa.
                <br />
                <span className="italic text-orange">Tenang.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-forest/75 sm:text-[19px]">
                Tempel pesan yang membuat Anda ragu. VetShield menunjukkan tandanya,
                menjelaskan risikonya, dan memberi tiga langkah aman — tanpa menyebut
                Anda “pasti aman”.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="group">
                  <Link href="#analyzer">
                    Periksa pesan sekarang
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/practice">Coba latihan 2 menit</Link>
                </Button>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-0 border-y border-forest/15 py-4">
                {[
                  { value: "120", label: "sumber terverifikasi" },
                  { value: "3", label: "langkah aman" },
                  { value: "< 1 dtk", label: "waktu analisis" },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={index > 0 ? "border-l border-forest/15 pl-4" : "pr-4"}
                  >
                    <dd className="font-display text-[26px] font-semibold leading-none text-forest-900">
                      {item.value}
                    </dd>
                    <dt className="mt-1 text-[12px] leading-snug text-forest/70">{item.label}</dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="animate-fade-up [animation-delay:120ms]">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Prinsip VetShield" className="bg-forest-900 py-4 text-cream">
        <Marquee className="[--gap:2.75rem]">
          {PRINCIPLES.map((item) => (
            <span
              key={item}
              className="flex items-center gap-6 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.16em] text-cream/60"
            >
              <span aria-hidden="true" className="text-orange">✳</span>
              {item}
            </span>
          ))}
        </Marquee>
      </section>

      <section id="analyzer" className="scroll-mt-24 border-b border-forest/10 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <p className="eyebrow flex items-center gap-3 text-forest/65">
                <span className="font-mono text-orange">01</span> Pemeriksa pesan
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-[clamp(2.2rem,4.6vw,3.75rem)] font-semibold leading-[0.98] text-forest-900">
                Tempel pesannya. Kami bantu Anda berhenti sejenak.
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="text-[15px] leading-relaxed text-forest/65">
                Tidak perlu akun. Jangan sertakan kata sandi, PIN, atau nomor kartu
                lengkap. Hasil muncul dalam hitungan detik.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">
                  <Lock className="h-3 w-3" /> PII disamarkan
                </Badge>
                <Badge variant="outline">
                  <Clock3 className="h-3 w-3" /> 7 hari retensi
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Analyzer />
          </div>

          <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-forest/65">
            VetShield tidak bisa memeriksa identitas pengirim. Jika pesan meminta uang,
            data pribadi, atau kode, tetap berhenti — sekalipun skornya rendah.
          </p>
        </div>
      </section>

      <section className="border-b border-forest/10 bg-sage/60 py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow flex items-center gap-3 text-forest/65">
                <span className="font-mono text-orange">02</span> Cara kerja
              </p>
              <h2 className="mt-3 max-w-xl font-display text-[clamp(2.2rem,4.6vw,3.75rem)] font-semibold leading-[0.98] text-forest-900">
                Tiga lapis pemeriksaan. Satu keputusan yang bisa Anda pegang.
              </h2>
            </div>
            <p className="max-w-md text-[16px] leading-relaxed text-forest/70 lg:justify-self-end">
              Mesin mencocokkan pola, menimbang bukti yang meredakan, lalu memilih
              tindakan yang paling mengurangi risiko dalam lima menit. Anda tetap
              pemegang keputusan.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-forest/15 bg-forest/15 md:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.number} className="flex flex-col bg-paper p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] font-bold tracking-[0.1em] text-orange">
                      {step.number}
                    </span>
                    <Icon className="h-5 w-5 text-forest/70" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-10 font-display text-[27px] font-semibold leading-tight text-forest-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-forest/65">{step.body}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-3xl bg-forest-900 px-6 py-7 text-cream sm:flex-row sm:items-center sm:px-8">
            <p className="max-w-2xl font-display text-[clamp(1.5rem,3vw,2.2rem)] font-medium leading-tight">
              “Ketidakpastian yang jujur lebih aman daripada{" "}
              <span className="italic text-lime">kepastian palsu.</span>”
            </p>
            <Button asChild variant="outline" className="shrink-0 border-cream/25 text-cream hover:bg-cream/10 hover:text-cream">
              <Link href="/dashboard">
                Lihat metriknya <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-forest/10 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="eyebrow flex items-center gap-3 text-forest/65">
                <span className="font-mono text-orange">03</span> Latihan
              </p>
              <h2 className="mt-3 max-w-xl font-display text-[clamp(2.2rem,4.6vw,3.75rem)] font-semibold leading-[0.98] text-forest-900">
                Aturan yang menempel, bukan skor yang bikin malu.
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-forest/70">
                Setiap jawaban memberi satu aturan yang bisa dipakai lagi. Kesulitan naik
                setelah tiga jawaban benar dan turun setelah dua jawaban salah.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Umpan balik menjelaskan kenapa, bukan hanya benar atau salah.",
                  "Kategori terlemah diprioritaskan pada soal berikutnya.",
                  "Bisa dipakai bersama keluarga di satu ponsel.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] text-forest/75">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-forest-900">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/practice">
                    Mulai satu soal <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/assessment">Ukur sebelum & sesudah</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-6 h-24 w-24 rounded-full bg-orange/15 sm:h-32 sm:w-32"
              />
              <div className="relative rounded-3xl border border-line bg-paper p-5 shadow-card sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="muted">Keamanan akun</Badge>
                  <Badge variant="outline">SMS</Badge>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-forest/60">
                    Soal 04
                  </span>
                </div>
                <blockquote className="mt-5 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-forest-900">
                  “Ada login baru ke akun Anda. Verifikasi di secure-login.example.com
                  dengan kata sandi Anda.”
                </blockquote>
                <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border-2 border-forest bg-forest-50 px-4 py-3 text-[14px] font-semibold text-forest-900">
                    Ini penipuan
                  </div>
                  <div className="rounded-xl border border-line px-4 py-3 text-[14px] text-forest/60">
                    Ini pesan wajar
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-line bg-sage/50 px-4 py-3 text-[13px] leading-relaxed text-forest/70">
                  <strong className="text-forest-900">Kenapa:</strong> kata sandi hanya
                  dimasukkan di aplikasi resmi, bukan lewat tautan pesan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest-900 py-16 text-cream sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="eyebrow flex items-center gap-3 text-cream/65">
                <span className="font-mono text-lime">04</span> Bukti
              </p>
              <h2 className="mt-3 max-w-xl font-display text-[clamp(2.2rem,4.6vw,3.75rem)] font-semibold leading-[0.98]">
                Angka yang kami berani <span className="italic text-lime">tunjukkan.</span>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/60">
                Diukur pada 146 item uji sintetis yang tidak dipakai menyetel aturan.
                Bukan studi lapangan — dan kami tidak akan berpura-pura sebaliknya.
              </p>
              <Button asChild variant="outline" className="mt-7 border-cream/25 text-cream hover:bg-cream/10 hover:text-cream">
                <Link href="/dashboard">
                  Buka dashboard <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-cream/15 bg-cream/15">
              {[
                { value: 77.4, decimals: 1, suffix: "%", label: "akurasi", note: "baseline 57,5%" },
                { value: 93.3, decimals: 1, suffix: "%", label: "presisi penipuan", note: "sedikit alarm palsu" },
                { value: 6.6, decimals: 1, suffix: "%", label: "alarm palsu", note: "pesan wajar" },
                { value: 120, decimals: 0, suffix: "", label: "dokumen sumber", note: "40 situs terverifikasi" },
              ].map((stat) => (
                <div key={stat.label} className="bg-forest-900 p-5 sm:p-6">
                  <dd className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-none">
                    <NumberTicker
                      value={stat.value}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                    />
                  </dd>
                  <dt className="mt-2 text-[13px] font-semibold text-cream/80">{stat.label}</dt>
                  <p className="mt-0.5 text-[11px] text-cream/60">{stat.note}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-b border-forest/10 py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-forest/15 bg-sage p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-12">
            <div>
              <p className="eyebrow flex items-center gap-3 text-forest/65">
                <span className="font-mono text-orange">05</span> Ukur dampaknya
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[0.98] text-forest-900">
                Apakah latihan ini benar-benar membantu?
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-forest/70">
                Sepuluh soal sebelum dan sesudah latihan. Tanpa nama, tanpa email. Hasil
                hanya layak dibaca setelah minimal 20 responden.
              </p>
            </div>
            <Button asChild size="lg" className="justify-self-start lg:justify-self-end">
              <Link href="/assessment">
                Isi tes 3 menit <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="eyebrow text-forest/65">Pertanyaan umum</p>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3.2vw,2.5rem)] font-semibold leading-tight text-forest-900">
                Sebelum Anda menempel pesan pertama.
              </h2>
              <p className="mt-3 flex items-center gap-2 text-[13px] text-forest/65">
                <BarChart3 className="h-4 w-4" /> Transparan soal batasan, bukan hanya fitur.
              </p>
            </div>
            <Accordion type="single" collapsible className="border-t border-line">
              {FAQ.map((item, index) => (
                <AccordionItem key={item.q} value={`item-${index}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
