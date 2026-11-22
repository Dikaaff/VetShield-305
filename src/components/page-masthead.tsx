import type { ReactNode } from "react";

export function PageMasthead({
  index,
  eyebrow,
  title,
  lede,
  aside,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lede: string;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-forest/10">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-10 sm:px-8 sm:pb-12 sm:pt-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-3 text-forest/65">
              {index ? <span className="font-mono text-orange">{index}</span> : null}
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[0.95] text-forest-900">
              {title}
            </h1>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-md text-[16px] leading-relaxed text-forest/65">{lede}</p>
            {aside ? <div className="mt-4">{aside}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
