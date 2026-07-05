import Image from "next/image";
import type { AmenitiesContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

export default function Amenities({ content }: { content: AmenitiesContent }) {
  return (
    <section id="amenities" className="bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading
          eyebrow={content.eyebrow}
          headline={content.headline}
          dark
        />

        {/* Grilla de íconos: 3x3, cada uno en aro dorado con hover */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:mt-24 md:gap-x-10 md:gap-y-16">
          {content.icons.map((a, i) => (
            <Reveal
              key={a.icon}
              delay={i * 70}
              className="group flex flex-col items-center text-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/25 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:border-gold group-hover:bg-gold/10 md:h-24 md:w-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.icon}
                  alt=""
                  aria-hidden="true"
                  className="h-9 w-9 object-contain transition-transform duration-500 ease-out group-hover:scale-110 md:h-11 md:w-11"
                />
              </span>
              <p className="mt-5 max-w-[11rem] font-display text-base font-medium leading-snug text-gold-light transition-colors duration-500 group-hover:text-cream md:text-lg">
                {a.label}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Detalle por grupos: cards con imagen */}
        <div className="mt-20 grid gap-6 md:mt-32 md:grid-cols-3">
          {content.groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 140}>
              <article className="group relative h-full overflow-hidden">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={group.image.src}
                    alt={group.image.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5"
                    aria-hidden="true"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-display text-xl font-semibold leading-tight text-gold-light">
                    {group.title}
                  </h3>
                  <div className="mt-3 h-px w-10 bg-gold/70" aria-hidden="true" />
                  <ul className="mt-4 space-y-2 text-sm font-light leading-relaxed text-cream/85">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
