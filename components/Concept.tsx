import Image from "next/image";
import type { Brand, ConceptContent } from "@/lib/types";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

export default function Concept({
  content,
  brand,
}: {
  content: ConceptContent;
  brand: Brand;
}) {
  return (
    <section id="concepto" className="relative overflow-hidden bg-cream">
      {/* Cresta como marca de agua */}
      <Image
        src={brand.crestGold}
        alt=""
        width={520}
        height={200}
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-16 w-[26rem] opacity-[0.07] md:w-[34rem]"
      />

      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-16 lg:gap-24">
          <Reveal delay={100}>
            <div className="space-y-6 text-[0.98rem] leading-relaxed font-light text-stone md:text-base">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="pt-2 font-display text-2xl font-light italic text-ink">
                {content.highlight}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <span
              className="absolute -bottom-4 -left-4 -z-10 h-full w-full border border-gold/40"
              aria-hidden="true"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
