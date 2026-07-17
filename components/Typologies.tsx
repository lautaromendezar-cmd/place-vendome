"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { TypologiesContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

export default function Typologies({
  content,
}: {
  content: TypologiesContent;
}) {
  const [zoom, setZoom] = useState<string | null>(null);

  const zoomed = zoom
    ? content.units.find((u) => u.plan.src === zoom)
    : null;

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom]);

  return (
    <section id="tipologias" className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading
          eyebrow={content.eyebrow}
          headline={content.headline}
        />

        {/* Datos duros + diferenciales */}
        <Reveal className="mt-12 md:mt-16">
          <div className="grid grid-cols-3 gap-4 border-y border-ink/10 py-8">
            {content.stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl font-semibold leading-none text-ink md:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.25em] text-stone md:text-[0.66rem]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2">
            {content.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-stone"
              >
                <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Planos modelo (una tipología por plano) */}
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-10">
          {content.units.map((unit, i) => (
            <Reveal key={unit.label} delay={i * 120}>
              <article className="flex h-full flex-col">
                <button
                  type="button"
                  onClick={() => setZoom(unit.plan.src)}
                  aria-label={`${content.zoomHint}: ${unit.label}`}
                  className="group relative block w-full cursor-pointer overflow-hidden border border-ink/10 bg-white"
                >
                  <div className="relative aspect-[7/5] w-full">
                    <Image
                      src={unit.plan.src}
                      alt={unit.plan.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                  <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 bg-ink/85 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                    {content.zoomHint}
                  </span>
                </button>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    {unit.label}
                  </h3>
                  <span className="text-[0.62rem] uppercase tracking-[0.3em] text-gold-dim">
                    {unit.subtitle}
                  </span>
                </div>
                <p className="mt-2 text-sm font-light text-stone">
                  {unit.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 md:mt-16">
          <p className="mx-auto max-w-2xl text-center text-sm font-light leading-relaxed text-stone">
            {content.note}
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href={content.catalogCta.href}
              className="group inline-flex items-center gap-3 border-b border-gold/40 pb-1 text-[0.72rem] uppercase tracking-[0.28em] text-ink transition-colors duration-300 hover:border-gold hover:text-gold-dim"
            >
              {content.catalogCta.label}
              <svg
                width="17"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>

      {/* Zoom de plano */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.plan.alt}
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoom(null);
          }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setZoom(null)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center text-cream/70 transition-colors hover:text-gold"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          <figure className="flex max-h-full w-full max-w-5xl flex-col items-center">
            <div className="relative h-[74vh] w-full rounded-sm bg-white p-3 md:p-6">
              <div className="relative h-full w-full">
                <Image
                  src={zoomed.plan.src}
                  alt={zoomed.plan.alt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            </div>
            <figcaption className="mt-4 text-center text-xs font-light tracking-wide text-cream/70">
              {zoomed.label} · {zoomed.subtitle}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
