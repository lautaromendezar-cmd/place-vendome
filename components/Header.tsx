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
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Sección activa: la que ocupa el centro del viewport
  useEffect(() => {
    const ids = ["inicio", ...nav.map((n) => n.anchor)];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [nav]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Si se agranda a desktop con el overlay abierto, cerrarlo
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

          {/* Nav inline en desktop */}
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-x-7 lg:flex"
          >
            {nav.map((link) => {
              const isActive = active === link.anchor;
              return (
                <a
                  key={link.anchor}
                  href={`#${link.anchor}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative py-1 text-[0.68rem] uppercase tracking-[0.22em] transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-cream/85 hover:text-gold"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="group relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
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

        {/* Barra de progreso de lectura */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-transparent" aria-hidden="true">
          <div
            className="h-full bg-gold transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Overlay de navegación (tablet y mobile) */}
      <nav
        aria-label="Menú"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-5 md:gap-6">
          {nav.map((link, i) => {
            const isActive = active === link.anchor;
            return (
              <li key={link.anchor}>
                <a
                  href={`#${link.anchor}`}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "true" : undefined}
                  className={`font-display text-3xl font-light transition-all duration-500 hover:text-gold md:text-4xl ${
                    isActive ? "text-gold" : "text-cream"
                  } ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
