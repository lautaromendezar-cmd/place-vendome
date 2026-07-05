"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Brand, NavLink } from "@/lib/types";

export default function Header({
  brand,
  nav,
}: {
  brand: Brand;
  nav: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          scrolled && !open
            ? "border-b border-gold/15 bg-ink/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <a
            href="#inicio"
            aria-label={brand.name}
            onClick={() => setOpen(false)}
            className="relative block h-9 w-24 md:h-11 md:w-28"
          >
            {/* Cresta dorada sobre el hero; cambia a marfil (alto contraste) sobre la barra negra */}
            <Image
              src={brand.crestGold}
              alt=""
              fill
              sizes="112px"
              className={`object-contain object-left transition-opacity duration-500 ${
                scrolled && !open ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src={brand.crestIvory}
              alt=""
              fill
              sizes="112px"
              className={`object-contain object-left transition-opacity duration-500 ${
                scrolled && !open ? "opacity-100" : "opacity-0"
              }`}
            />
          </a>

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="group relative z-50 flex h-10 w-10 items-center justify-center"
          >
            <span className="relative block h-3.5 w-7">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-gold transition-transform duration-300 ${
                  open ? "top-1/2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-px w-full bg-gold transition-transform duration-300 ${
                  open ? "bottom-1/2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Overlay de navegación */}
      <nav
        aria-label="Navegación principal"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-5 md:gap-6">
          {nav.map((link, i) => (
            <li key={link.anchor}>
              <a
                href={`#${link.anchor}`}
                onClick={() => setOpen(false)}
                className={`font-display text-3xl font-light text-cream transition-all duration-500 hover:text-gold md:text-4xl ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
