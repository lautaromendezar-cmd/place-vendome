"use client";

import { useState } from "react";
import Image from "next/image";
import type { AmenitiesContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

export default function Amenities({ content }: { content: AmenitiesContent }) {
  const [active, setActive] = useState(0);

  return (
    <section id="amenities" className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading
          eyebrow={content.eyebrow}
          headline={content.headline}
          dark
        />

        {/* Showcase interactivo (desktop): lista + foto que se revela al hover */}
        <Reveal className="mt-16 hidden md:mt-24 lg:block">
          <div className="grid grid-cols-2 gap-14">
            {/* Foto grande con crossfade */}
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              {content.showcase.map((a, i) => (
                <Image
                  key={a.image.src}
                  src={a.image.src}
                  alt={a.image.alt}
                  fill
                  sizes="45vw"
                  className={`object-cover transition-[opacity,transform] duration-700 ease-out ${
                    i === active
                      ? "scale-100 opacity-100"
                      : "scale-105 opacity-0"
                  }`}
                />
              ))}
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/20"
                aria-hidden="true"
              />
            </div>

            {/* Lista */}
            <ul className="flex flex-col justify-center">
              {content.showcase.map((a, i) => {
                const on = i === active;
                return (
                  <li key={a.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group flex w-full items-center gap-5 border-b border-cream/10 py-5 text-left transition-colors duration-300"
                    >
                      <span className="w-8 shrink-0 font-display text-sm text-gold-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.icon}
                        alt=""
                        aria-hidden="true"
                        className={`h-8 w-8 shrink-0 object-contain transition-transform duration-300 ${
                          on ? "scale-110" : ""
                        }`}
                      />
                      <span
                        className={`font-display text-2xl font-light transition-all duration-300 xl:text-[1.75rem] ${
                          on
                            ? "translate-x-1 text-gold-light"
                            : "text-cream/75 group-hover:text-cream"
                        }`}
                      >
                        {a.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* Showcase (mobile/tablet): cards apiladas */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
          {content.showcase.map((a, i) => (
            <Reveal key={a.name} delay={(i % 2) * 100}>
              <figure className="group relative aspect-[4/3] overflow-hidden">
                <Image
                  src={a.image.src}
                  alt={a.image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent"
                  aria-hidden="true"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.icon} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
                  <span className="font-display text-lg font-light text-gold-light">
                    {a.name}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Desglose de acceso */}
        <div className="mt-20 grid gap-10 border-t border-gold/15 pt-14 md:mt-28 md:grid-cols-3 md:gap-8">
          {content.groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 120}>
              <h3 className="text-[0.68rem] uppercase tracking-[0.32em] text-gold">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-3 text-sm font-light leading-relaxed text-cream/70">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
