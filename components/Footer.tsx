import Image from "next/image";
import type { Brand, FooterContent } from "@/lib/types";

export default function Footer({
  content,
  brand,
}: {
  content: FooterContent;
  brand: Brand;
}) {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-16 text-center md:py-20">
        <Image
          src={brand.logoGold}
          alt={brand.name}
          width={225}
          height={175}
          className="w-32 md:w-36"
        />
        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.4em] text-gold-light">
          {content.location}
        </p>
        <p className="mt-8 max-w-xl text-xs font-light leading-relaxed text-cream/40">
          {content.legal}
        </p>
        <p className="mt-6 text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
          {content.credit}
        </p>
      </div>
    </footer>
  );
}
