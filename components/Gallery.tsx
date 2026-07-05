import Image from "next/image";
import type { GalleryContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/**
 * Grilla editorial: filas que alternan una imagen ancha + una angosta,
 * en lugar de una grilla uniforme.
 */
export default function Gallery({ content }: { content: GalleryContent }) {
  return (
    <section id="galeria" className="bg-cream-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} />

        <div className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-6 md:gap-5">
          {content.images.map((img, i) => {
            // Patrón 6 columnas: ancho(4)+angosto(2), luego 3+3, invertido cada bloque
            const spans = ["md:col-span-4", "md:col-span-2", "md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-4"];
            const span = spans[i % spans.length];
            return (
              <Reveal
                key={img.src}
                delay={(i % 3) * 90}
                className={`${span} col-span-2 sm:col-span-1 md:h-auto`}
              >
                <div className="group relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
