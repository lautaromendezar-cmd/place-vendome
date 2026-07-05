import Image from "next/image";
import type { LifestyleContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/**
 * Grilla en blanco y negro (renders desaturados vía CSS).
 * Al hover recuperan el color: la vida en Place Vendôme, revelada.
 */
export default function Lifestyle({ content }: { content: LifestyleContent }) {
  return (
    <section id="lifestyle" className="bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading
          eyebrow={content.eyebrow}
          headline={content.headline}
          dark
        />

        <div className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-3 md:gap-5">
          {content.images.map((img, i) => (
            <Reveal key={img.src} delay={(i % 3) * 100}>
              <div className="group relative aspect-square overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
