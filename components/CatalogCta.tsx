"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CatalogContent } from "@/lib/types";
import Reveal from "./ui/Reveal";

export default function CatalogCta({ content }: { content: CatalogContent }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: conectar endpoint (lead magnet) — hoy solo dispara la descarga
    setSent(true);
    const link = document.createElement("a");
    link.href = content.fileUrl;
    link.download = "";
    link.click();
  }

  return (
    <section id="catalogo" className="bg-cream">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center md:py-32">
        <Reveal className="flex flex-col items-center">
          <p className="text-[0.7rem] uppercase tracking-[0.45em] text-stone">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight md:text-5xl">
            {content.headline}
          </h2>
          <p className="mt-6 max-w-xl text-[0.98rem] font-light leading-relaxed text-stone">
            {content.description}
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setOpen(true);
            }}
            className="mt-10 cursor-pointer border border-ink bg-transparent px-12 py-4 text-[0.72rem] uppercase tracking-[0.4em] text-ink transition-colors duration-300 hover:border-gold hover:bg-gold"
          >
            {content.ctaLabel}
          </button>
        </Reveal>
      </div>

      {/* Modal lead magnet */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-6 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={content.modal.title}
            className="relative w-full max-w-sm bg-cream p-8 md:p-10"
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 cursor-pointer p-2 text-stone transition-colors hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>

            <h3 className="pr-6 font-display text-2xl font-light leading-snug">
              {content.modal.title}
            </h3>

            {sent ? (
              <p className="mt-8 border-t border-gold/50 pt-6 font-display text-lg font-light italic text-gold-dim">
                {content.modal.successMessage}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <input
                  className="field !border-ink/25 !text-ink placeholder:!text-stone/70 focus-visible:!border-gold-dim"
                  name="nombre"
                  placeholder={content.modal.nameLabel}
                  autoComplete="name"
                  required
                />
                <input
                  className="field !border-ink/25 !text-ink placeholder:!text-stone/70 focus-visible:!border-gold-dim"
                  name="celular"
                  type="tel"
                  placeholder={content.modal.phoneLabel}
                  autoComplete="tel"
                  required
                />
                <button
                  type="submit"
                  className="mt-2 w-full cursor-pointer bg-ink py-3.5 text-[0.72rem] uppercase tracking-[0.4em] text-cream transition-colors duration-300 hover:bg-gold hover:text-ink"
                >
                  {content.modal.submitLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
