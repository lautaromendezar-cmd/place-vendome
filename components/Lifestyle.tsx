"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import type { LifestyleContent } from "@/lib/types";

type Token =
  | { type: "space"; text: string }
  | { type: "word"; text: string; em: boolean };

export default function Lifestyle({ content }: { content: LifestyleContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Aplanar el statement en tokens (palabras + espacios), preservando itálicas
  const tokens = useMemo<Token[]>(() => {
    const out: Token[] = [];
    for (const seg of content.statement) {
      for (const part of seg.text.split(/(\s+)/)) {
        if (part === "") continue;
        if (/^\s+$/.test(part)) out.push({ type: "space", text: part });
        else out.push({ type: "word", text: part, em: !!seg.em });
      }
    }
    return out;
  }, [content.statement]);

  // Pintado del texto + parallax del fondo, atados al scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".paint-word"));
    if (reduce) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const ih = window.innerHeight;
        const start = ih * 0.82;
        const end = ih * 0.42;
        for (const w of words) {
          const top = w.getBoundingClientRect().top;
          const t = Math.min(Math.max((start - top) / (start - end), 0), 1);
          w.style.opacity = (0.16 + 0.84 * t).toFixed(3);
        }
        const section = sectionRef.current;
        const bg = bgRef.current;
        if (section && bg) {
          const rect = section.getBoundingClientRect();
          const progress = (ih / 2 - (rect.top + rect.height / 2)) / ih;
          bg.style.transform = `translate3d(0, ${progress * 40}px, 0)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [tokens]);

  return (
    <section
      id="lifestyle"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink"
    >
      {/* Fondo con parallax + oscurecido para legibilidad */}
      <div
        ref={bgRef}
        className="absolute inset-x-0 -inset-y-[8%] will-change-transform"
      >
        <Image
          src={content.backgroundImage.src}
          alt={content.backgroundImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-ink/78" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-32 md:px-8 md:py-52">
        <p className="mb-10 text-[0.7rem] uppercase tracking-[0.45em] text-gold md:mb-14">
          {content.eyebrow}
        </p>
        <p
          ref={containerRef}
          className="font-display text-[2rem] font-medium leading-[1.28] text-cream sm:text-4xl md:text-5xl lg:text-[3.4rem] lg:leading-[1.24]"
        >
          {tokens.map((tk, i) =>
            tk.type === "space" ? (
              <span key={i}> </span>
            ) : (
              <span
                key={i}
                className={`paint-word ${tk.em ? "italic text-gold-light" : ""}`}
                style={{ opacity: 0.16, transition: "opacity 120ms linear" }}
              >
                {tk.text}
              </span>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
