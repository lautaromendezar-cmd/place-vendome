"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Brand, HeroContent, WhatsAppConfig } from "@/lib/types";

export default function Hero({
  content,
  brand,
  whatsapp,
}: {
  content: HeroContent;
  brand: Brand;
  whatsapp: WhatsAppConfig;
}) {
  // El video solo se monta en desktop: en mobile no se descarga ni un byte.
  const [showVideo, setShowVideo] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    setShowVideo(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setShowVideo(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Parallax leve del fondo (desactivado si el usuario prefiere menos movimiento)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = mediaRef.current;
        if (!el) return;
        const y = Math.min(window.scrollY, window.innerHeight);
        el.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink"
    >
      <div ref={mediaRef} className="absolute inset-x-0 -top-[12%] h-[124%] will-change-transform">
        <Image
          src={content.fallbackImage.src}
          alt={content.fallbackImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {showVideo && (
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            src={content.videoSrc}
            poster={content.fallbackImage.src}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        )}
      </div>
      {/* Velo para legibilidad: capa plana + gradiente */}
      <div className="absolute inset-0 bg-ink/30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/30 to-ink/70"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-full flex-col items-center px-6 text-center">
        {/* El logo es raster (PNG): se muestra a su tamaño nativo, sin animar, para que quede nítido */}
        <Image
          src={brand.logoIvory}
          alt={brand.name}
          width={340}
          height={264}
          priority
          className="w-52 md:w-64"
        />
        <p
          className="hero-rise mt-10 max-w-full font-display text-xl font-light italic tracking-wide text-cream md:text-3xl"
          style={{ animationDelay: "0.2s" }}
        >
          {content.tagline}
        </p>
        <p
          className="hero-rise mt-5 text-xs uppercase tracking-[0.5em] text-gold-light md:text-sm"
          style={{ animationDelay: "0.4s" }}
        >
          {content.location}
        </p>
        <a
          href={`https://wa.me/${whatsapp.phone}?text=${encodeURIComponent(whatsapp.message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-rise mt-11 bg-gold px-11 py-4 text-[0.78rem] uppercase tracking-[0.35em] text-ink transition-colors duration-300 hover:bg-gold-light"
          style={{ animationDelay: "0.6s" }}
        >
          {content.ctaLabel}
        </a>
      </div>

      <a
        href="#concepto"
        className="hero-rise absolute bottom-8 z-10 text-[0.6rem] uppercase tracking-[0.4em] text-cream/70 transition-colors hover:text-gold"
        style={{ animationDelay: "0.9s" }}
      >
        {content.scrollHint}
      </a>
    </section>
  );
}
