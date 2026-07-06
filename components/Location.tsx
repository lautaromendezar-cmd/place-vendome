import Image from "next/image";
import type { LocationContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

export default function Location({ content }: { content: LocationContent }) {
  return (
    <section id="ubicacion" className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
        {/* Encabezado + intro */}
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow={content.eyebrow}
            headline={content.headline}
            align="left"
          />
          <Reveal delay={120}>
            <p className="mt-7 text-lg font-light leading-relaxed text-stone md:text-xl">
              {content.intro}
            </p>
          </Reveal>
        </div>

        {/* Fotos del barrio */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3 md:mt-20 md:gap-6">
          {content.neighborhood.map((n, i) => (
            <Reveal key={n.src} delay={i * 120}>
              <figure className="group">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={n.src}
                    alt={n.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-gold" aria-hidden="true" />
                  <span className="font-display text-lg font-light italic text-ink">
                    {n.caption}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Mapa + destacados + conectividad */}
        <div className="mt-16 grid items-start gap-12 md:mt-24 md:grid-cols-5 md:gap-16">
          <Reveal className="md:col-span-3">
            <div className="relative aspect-[16/11] w-full overflow-hidden border border-gold/25">
              <Image
                src={content.mapImage.src}
                alt={content.mapImage.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-stone">
              {content.address}
            </p>
          </Reveal>

          <Reveal delay={150} className="md:col-span-2">
            <div className="space-y-6 text-[0.98rem] font-light leading-relaxed text-stone">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <dl className="mt-10 space-y-6 border-t border-ink/10 pt-8">
              {content.highlights.map((h) => (
                <div key={h.title}>
                  <dt className="text-[0.66rem] uppercase tracking-[0.3em] text-gold-dim">
                    {h.title}
                  </dt>
                  <dd className="mt-1.5 text-sm font-light leading-relaxed text-ink">
                    {h.text}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {content.connectivity.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.22em] text-stone"
                >
                  <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
