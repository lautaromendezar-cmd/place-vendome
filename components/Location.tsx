import Image from "next/image";
import type { LocationContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

export default function Location({ content }: { content: LocationContent }) {
  return (
    <section id="ubicacion" className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} />

        <div className="mt-14 grid items-center gap-12 md:mt-20 md:grid-cols-5 md:gap-16">
          <Reveal className="md:col-span-3">
            <div className="relative aspect-[16/11] w-full overflow-hidden border border-gold/30">
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
            <div className="space-y-6 text-[0.98rem] font-light leading-relaxed text-stone md:text-base">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <ul className="mt-10 space-y-3">
              {content.connectivity.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 text-[0.72rem] uppercase tracking-[0.3em] text-ink"
                >
                  <span className="h-px w-8 bg-gold" aria-hidden="true" />
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
