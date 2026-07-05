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

        {/* Grilla de íconos: 2 columnas */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-x-16 gap-y-10 sm:grid-cols-2 md:mt-24 md:gap-y-12">
          {content.icons.map((a, i) => (
            <Reveal
              key={a.icon}
              delay={(i % 2) * 100}
              className="flex items-center gap-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.icon}
                alt=""
                aria-hidden="true"
                className="h-12 w-12 shrink-0 object-contain md:h-14 md:w-14"
              />
              <p className="font-display text-lg font-light text-gold-light md:text-xl">
                {a.label}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Detalle por grupos */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-12 border-t border-gold/20 pt-16 md:mt-28 md:grid-cols-3 md:gap-8">
          {content.groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 120}>
              <h3 className="text-[0.68rem] uppercase tracking-[0.35em] text-gold">
                {group.title}
              </h3>
              <ul className="mt-6 space-y-3 text-sm font-light leading-relaxed text-cream/75">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
