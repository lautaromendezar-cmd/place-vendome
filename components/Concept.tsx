"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Brand, ConceptContent } from "@/lib/types";

export default function Concept({
  content,
  brand,
}: {
  content: ConceptContent;
  brand: Brand;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const headlineLines = content.headline.split("\n");

  // Aparición al entrar en viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax de la foto al scrollear
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const section = sectionRef.current;
        const img = imgRef.current;
        if (!section || !img) return;
        const rect = section.getBoundingClientRect();
        // progreso relativo del centro de la sección respecto al viewport
        const progress =
          (window.innerHeight / 2 - (rect.top + rect.height / 2)) /
          window.innerHeight;
        img.style.transform = `translate3d(0, ${progress * 42}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const riseCls = `transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
    inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  return (
    <section
      id="concepto"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink"
    >
      <div className="relative mx-auto flex min-h-[92vh] max-w-[1600px] flex-col lg:flex-row">
        {/* Foto grande protagonista */}
        <div className="relative h-[54vh] w-full overflow-hidden sm:h-[62vh] lg:h-auto lg:w-[60%]">
          <div
            ref={imgRef}
            className="absolute inset-x-0 -inset-y-[8%] will-change-transform"
          >
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={`object-cover transition-[transform,opacity] duration-[1600ms] ease-out ${
                inView ? "scale-100 opacity-100" : "scale-[1.12] opacity-0"
              }`}
            />
          </div>
          {/* Fundido hacia el panel oscuro (abajo en mobile, a la derecha en desktop) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-ink/5 lg:to-ink"
            aria-hidden="true"
          />
        </div>

        {/* Panel de contenido */}
        <div className="relative z-10 flex w-full flex-col justify-center px-6 pb-16 sm:px-10 lg:w-[40%] lg:py-28 lg:pr-14 lg:pl-0">
          {/* Cresta como marca de agua sobre el panel */}
          <Image
            src={brand.crestGold}
            alt=""
            width={420}
            height={420}
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-6 hidden w-72 opacity-[0.06] lg:block"
          />

          {/* Eyebrow + título grande que invade la foto */}
          <div className="lg:-ml-[34%] lg:pr-4">
            <p
              className={`text-[0.7rem] uppercase tracking-[0.45em] text-gold ${riseCls}`}
            >
              {content.eyebrow}
            </p>
            <h2 className="mt-5 font-display font-semibold leading-[1.04] text-cream">
              {headlineLines.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <span
                    className={`block text-[2.4rem] sm:text-5xl lg:text-[4.6rem] ${riseCls}`}
                    style={{ transitionDelay: inView ? `${150 + i * 130}ms` : "0ms" }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          {/* Texto a un costado, contenido */}
          <div
            className={`mt-10 max-w-md lg:mt-14 lg:self-end ${riseCls}`}
            style={{ transitionDelay: inView ? "480ms" : "0ms" }}
          >
            <span className="block h-px w-12 bg-gold" aria-hidden="true" />
            <div className="mt-6 space-y-5 text-[0.95rem] font-light leading-relaxed text-cream/70">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-7 font-display text-xl font-light italic text-gold-light">
              {content.highlight}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
