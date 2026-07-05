import Reveal from "./Reveal";

/**
 * Encabezado de sección: eyebrow tracking amplio + titular serif en negrita.
 * `headline` admite "\n" para cortes de línea deliberados.
 */
export default function SectionHeading({
  eyebrow,
  headline,
  dark = false,
  align = "center",
}: {
  eyebrow: string;
  headline: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left"}`}
    >
      <p
        className={`text-[0.7rem] font-normal uppercase tracking-[0.45em] ${
          dark ? "text-gold" : "text-stone"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 max-w-3xl font-display text-4xl leading-[1.12] font-semibold md:text-5xl lg:text-[3.4rem] ${
          dark ? "text-gold-light" : "text-ink"
        }`}
      >
        {headline.split("\n").map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
    </Reveal>
  );
}
