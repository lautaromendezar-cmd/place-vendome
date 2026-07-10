import Image from "next/image";
import type { TerminacionesContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/**
 * Terminaciones: fotos reales de detalles (cocina, baño, aberturas, puerta).
 * Las fotos horizontales (wide) se muestran como feature a lo ancho; el resto,
 * verticales, en una grilla de cards altas. Todo se maneja desde el contenido.
 */
export default function Terminaciones({
  content,
}: {
  content: TerminacionesContent;
}) {
  const wide = content.items.filter((i) => i.wide);
  const grid = content.items.filter((i) => !i.wide);

  return (
    <section id="terminaciones" className="bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading
          eyebrow={content.eyebrow}
          headline={content.headline}
          dark
        />
        {content.intro && (
          <Reveal className="mx-auto mt-6 max-w-2xl text-center">
            <p className="text-base font-light leading-relaxed text-cream/70">
              {content.intro}
            </p>
          </Reveal>
        )}

        {/* Feature(s) horizontales */}
        {wide.map((item) => (
          <Reveal key={item.image.src} className="mt-14 md:mt-20">
            <figure className="group relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent"
                aria-hidden="true"
              />
              <figcaption className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center gap-2 p-8 md:p-12">
                <h3 className="font-display text-2xl font-light text-gold-light md:text-3xl">
                  {item.title}
                </h3>
                {item.note && (
                  <p className="text-sm font-light leading-relaxed text-cream/75">
                    {item.note}
                  </p>
                )}
              </figcaption>
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/15"
                aria-hidden="true"
              />
            </figure>
          </Reveal>
        ))}

        {/* Grilla de detalles verticales */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {grid.map((item, i) => (
            <Reveal key={item.image.src} delay={(i % 4) * 80}>
              <figure className="group relative overflow-hidden">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4">
                  <span className="font-display text-base font-light text-gold-light">
                    {item.title}
                  </span>
                  {item.note && (
                    <span className="text-[0.72rem] font-light leading-snug text-cream/65">
                      {item.note}
                    </span>
                  )}
                </figcaption>
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/10"
                  aria-hidden="true"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
