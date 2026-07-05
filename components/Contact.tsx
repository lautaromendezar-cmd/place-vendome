"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import type { ContactContent, WhatsAppConfig } from "@/lib/types";
import Reveal from "./ui/Reveal";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z" />
    </svg>
  );
}

export default function Contact({
  content,
  whatsapp,
}: {
  content: ContactContent;
  whatsapp: WhatsAppConfig;
}) {
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  const waHref = `https://wa.me/${whatsapp.phone}?text=${encodeURIComponent(whatsapp.message)}`;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: conectar endpoint (API route / CRM) — por ahora solo validación cliente
    setSent(true);
  }

  return (
    <section id="contacto" className="relative overflow-hidden bg-ink-soft">
      <Image
        src={content.image.src}
        alt={content.image.alt}
        fill
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div
        className="absolute inset-0 bg-ink/65"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl justify-center px-6 py-24 md:px-8 md:py-36">
        <Reveal className="w-full max-w-md">
          <div className="bg-ink/85 p-8 backdrop-blur-sm md:p-10">
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-gold">
              {content.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-cream md:text-[2rem]">
              {content.headline}
            </h2>

            {/* CTA principal: WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center gap-3 bg-gold py-4 text-[0.75rem] uppercase tracking-[0.3em] text-ink transition-colors duration-300 hover:bg-gold-light"
            >
              <WhatsAppGlyph className="h-5 w-5" />
              {content.whatsappButton}
            </a>
            <p className="mt-3 text-center text-xs font-light text-cream/55">
              {content.whatsappNote}
            </p>

            {/* Opción secundaria: dejar datos por mail */}
            {!sent && (
              <div className="mt-8 border-t border-cream/12 pt-6">
                <button
                  type="button"
                  onClick={() => setShowForm((v) => !v)}
                  aria-expanded={showForm}
                  className="flex w-full items-center justify-between text-left text-[0.7rem] uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-gold"
                >
                  {content.altToggle}
                  <span
                    className={`ml-3 transition-transform duration-300 ${showForm ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </span>
                </button>
              </div>
            )}

            {sent ? (
              <p className="mt-6 border-t border-gold/40 pt-6 font-display text-xl font-light italic text-gold-light">
                {content.successMessage}
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={`grid overflow-hidden transition-all duration-500 ease-out ${
                  showForm ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 space-y-5">
                  <input
                    className="field"
                    name="nombre"
                    placeholder={content.fields.name}
                    autoComplete="name"
                    required={showForm}
                    disabled={!showForm}
                  />
                  <input
                    className="field"
                    name="email"
                    type="email"
                    placeholder={content.fields.email}
                    autoComplete="email"
                    required={showForm}
                    disabled={!showForm}
                  />
                  <select
                    className="field text-cream/60 valid:text-cream"
                    name="dormitorios"
                    defaultValue=""
                    required={showForm}
                    disabled={!showForm}
                  >
                    <option value="" disabled>
                      {content.fields.bedrooms.label}
                    </option>
                    {content.fields.bedrooms.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <textarea
                    className="field resize-none"
                    name="mensaje"
                    rows={3}
                    placeholder={content.fields.message}
                    required={showForm}
                    disabled={!showForm}
                  />
                  <button
                    type="submit"
                    className="w-full cursor-pointer border border-gold/50 bg-transparent py-3.5 text-[0.72rem] uppercase tracking-[0.4em] text-gold-light transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    {content.submitLabel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
