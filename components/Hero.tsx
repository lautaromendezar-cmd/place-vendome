"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    setShowVideo(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setShowVideo(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink"
    >
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
      {/* Velo para legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/70"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-full flex-col items-center px-6 text-center">
        <Image
          src={brand.logoIvory}
          alt={brand.name}
          width={340}
          height={264}
          priority
          className="w-52 md:w-64"
        />
        <p className="mt-10 max-w-full font-display text-lg font-light italic tracking-wide text-cream md:text-2xl">
          {content.tagline}
        </p>
        <p className="mt-5 text-[0.68rem] uppercase tracking-[0.5em] text-gold-light">
          {content.location}
        </p>
        <a
          href={`https://wa.me/${whatsapp.phone}?text=${encodeURIComponent(whatsapp.message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 bg-gold px-10 py-4 text-[0.72rem] uppercase tracking-[0.35em] text-ink transition-colors duration-300 hover:bg-gold-light"
        >
          {content.ctaLabel}
        </a>
      </div>

      <a
        href="#concepto"
        className="absolute bottom-8 z-10 text-[0.6rem] uppercase tracking-[0.4em] text-cream/70 transition-colors hover:text-gold"
      >
        {content.scrollHint}
      </a>
    </section>
  );
}
