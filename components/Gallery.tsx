"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryContent, ImageAsset } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";

/**
 * Galería horizontal: en desktop la sección se "pinea" y las imágenes se
 * desplazan de lado a medida que scrolleás (efecto tipo GSAP, hecho con
 * position:sticky + transform, sin librerías). En tablet/mobile es un carrusel
 * de swipe nativo. El caption va debajo de cada foto, siempre visible.
 */
export default function Gallery({ content }: { content: GalleryContent }) {
  const total = content.images.length;
  const [index, setIndex] = useState<number | null>(null);

  const pinWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [pinHeight, setPinHeight] = useState(0);

  // Alto del contenedor "pin" = distancia horizontal + un viewport (solo desktop)
  useEffect(() => {
    const compute = () => {
      const track = trackRef.current;
      if (!track) return;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!desktop || reduce) {
        setPinHeight(0);
        track.style.transform = "";
        return;
      }
      const distance = track.scrollWidth - window.innerWidth;
      setPinHeight(Math.max(distance, 0) + window.innerHeight);
    };
    const raf = requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
    };
  }, []);

  // Desplazamiento horizontal atado al scroll
  useEffect(() => {
    if (!pinHeight) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wrap = pinWrapRef.current;
        const track = trackRef.current;
        if (!wrap || !track) return;
        const distance = track.scrollWidth - window.innerWidth;
        const scrolled = Math.min(Math.max(-wrap.getBoundingClientRect().top, 0), distance);
        track.style.transform = `translate3d(${-scrolled}px, 0, 0)`;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${distance ? scrolled / distance : 0})`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pinHeight]);

  // Lightbox
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

  function Figure({
    img,
    i,
    widthClass,
    snap = false,
  }: {
    img: ImageAsset;
    i: number;
    widthClass: string;
    snap?: boolean;
  }) {
    return (
      <figure className={`shrink-0 ${widthClass} ${snap ? "snap-center" : ""}`}>
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
            sizes="(min-width: 1024px) 44vw, 80vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span className="pointer-events-none absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-cream/70 text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </button>
        <figcaption className="mt-4 flex items-baseline justify-between gap-6 border-t border-ink/10 pt-3">
          <span className="text-sm font-light text-stone">{img.alt}</span>
          <span className="shrink-0 text-[0.62rem] uppercase tracking-[0.25em] text-gold-dim">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
    );
  }

  return (
    <section id="galeria" className="bg-cream-soft">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 pt-24 md:px-8 md:pt-36">
        <SectionHeading
          eyebrow={content.eyebrow}
          headline={content.headline}
          align="left"
        />
        <p className="mb-2 hidden shrink-0 items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-stone lg:flex">
          Scrolleá para recorrer
          <svg width="26" height="8" viewBox="0 0 26 8" fill="none" aria-hidden="true">
            <path d="M0 4h24M20 1l4 3-4 3" stroke="currentColor" strokeWidth="1" />
          </svg>
        </p>
      </div>

      {/* Desktop: galería horizontal pineada */}
      <div
        ref={pinWrapRef}
        style={pinHeight ? { height: pinHeight } : undefined}
        className="relative mt-12 hidden lg:mt-16 lg:block"
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-start gap-10 px-8 will-change-transform xl:gap-14"
          >
            {content.images.map((img, i) => (
              <Figure
                key={img.src}
                img={img}
                i={i}
                widthClass="w-[44vw] xl:w-[38vw] max-w-[820px]"
              />
            ))}
            <div className="w-2 shrink-0" aria-hidden="true" />
          </div>
          {/* Progreso horizontal */}
          <div className="absolute bottom-10 left-8 right-8 h-px bg-ink/10">
            <div
              ref={progressRef}
              className="h-full origin-left bg-gold"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>

      {/* Tablet y mobile: carrusel de swipe nativo */}
      <div className="mt-10 lg:hidden">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {content.images.map((img, i) => (
            <Figure
              key={img.src}
              img={img}
              i={i}
              widthClass="w-[82vw] sm:w-[60vw]"
              snap
            />
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
              <Image src={active.src} alt={active.alt} fill sizes="90vw" className="object-contain" />
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
