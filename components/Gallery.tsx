"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/**
 * Grilla editorial (filas que alternan ancho/angosto) con lightbox:
 * click en cualquier render lo abre a pantalla completa, con teclado y flechas.
 */
export default function Gallery({ content }: { content: GalleryContent }) {
  const [index, setIndex] = useState<number | null>(null);
  const total = content.images.length;
  const spans = [
    "md:col-span-4",
    "md:col-span-2",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-2",
    "md:col-span-4",
  ];

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % total)),
    [total],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  const active = index === null ? null : content.images[index];

  return (
    <section id="galeria" className="bg-cream-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} />

        <div className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-6 md:gap-5">
          {content.images.map((img, i) => (
            <Reveal
              key={img.src}
              delay={(i % 3) * 90}
              className={`${spans[i % spans.length]} col-span-2 sm:col-span-1`}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ampliar: ${img.alt}`}
                className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span
                  className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20"
                  aria-hidden="true"
                />
                <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-cream/70 text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={close}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center text-cream/70 transition-colors hover:text-gold"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Anterior"
            onClick={prev}
            className="absolute left-3 z-10 flex h-12 w-12 cursor-pointer items-center justify-center text-cream/70 transition-colors hover:text-gold md:left-6"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <path d="M16 4L7 13l9 9" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>

          <figure className="relative flex max-h-full max-w-5xl flex-col items-center">
            <div className="relative h-[70vh] w-[86vw] max-w-5xl">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-xs font-light tracking-wide text-cream/70">
              {active.alt}
              <span className="ml-3 text-gold/70">
                {(index ?? 0) + 1} / {total}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="Siguiente"
            onClick={next}
            className="absolute right-3 z-10 flex h-12 w-12 cursor-pointer items-center justify-center text-cream/70 transition-colors hover:text-gold md:right-6"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <path d="M10 4l9 9-9 9" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
