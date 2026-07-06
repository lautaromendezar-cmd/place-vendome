"use client";

import { useEffect, useMemo, useRef } from "react";
import type { LifestyleContent } from "@/lib/types";

type Token =
  | { type: "space"; text: string }
  | { type: "word"; text: string; em: boolean };

export default function Lifestyle({ content }: { content: LifestyleContent }) {
  const containerRef = useRef<HTMLParagraphElement>(null);

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

  // Pintado atado al scroll: cada palabra pasa de tenue a plena al cruzar una banda del viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = Array.from(
      el.querySelectorAll<HTMLElement>(".paint-word"),
    );
    if (reduce) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const paint = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const ih = window.innerHeight;
        const start = ih * 0.82; // debajo de esta línea: tenue
        const end = ih * 0.42; // arriba de esta línea: pleno
        for (const w of words) {
          const top = w.getBoundingClientRect().top;
          const t = Math.min(Math.max((start - top) / (start - end), 0), 1);
          w.style.opacity = (0.18 + 0.82 * t).toFixed(3);
        }
      });
    };
    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
    return () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
      cancelAnimationFrame(raf);
    };
  }, [tokens]);

  let wi = 0;
  return (
    <section id="lifestyle" className="bg-cream-soft">
      <div className="mx-auto max-w-5xl px-6 py-32 md:px-8 md:py-52">
        <p className="mb-10 text-[0.7rem] uppercase tracking-[0.45em] text-gold-dim md:mb-14">
          {content.eyebrow}
        </p>
        <p
          ref={containerRef}
          className="font-display text-[2rem] font-medium leading-[1.28] text-ink sm:text-4xl md:text-5xl lg:text-[3.4rem] lg:leading-[1.24]"
        >
          {tokens.map((tk, i) =>
            tk.type === "space" ? (
              <span key={i}> </span>
            ) : (
              <span
                key={i}
                className={`paint-word ${tk.em ? "italic" : ""}`}
                style={{ opacity: 0.18, transition: "opacity 120ms linear" }}
                data-w={wi++}
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
