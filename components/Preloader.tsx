"use client";

import { useEffect, useRef, useState } from "react";
import type { Brand } from "@/lib/types";

type Phase = "spin" | "exit" | "gone";

export default function Preloader({ brand }: { brand: Brand }) {
  const [phase, setPhase] = useState<Phase>("spin");
  const crestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Bloquear scroll mientras el preloader está activo
    document.body.style.overflow = "hidden";

    const startExit = () => {
      const crest = crestRef.current;
      const heroLogo = document.querySelector<HTMLElement>("[data-hero-logo]");
      if (crest && heroLogo) {
        const rect = heroLogo.getBoundingClientRect();
        // Objetivo: la cresta del logo del hero (parte superior del lockup)
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height * 0.2;
        const targetW = rect.width * 0.42; // ancho aprox. de la cresta en el hero
        const ringDiameter = 236; // diámetro visible del anillo dentro del contenedor
        const scale = Math.max(targetW / ringDiameter, 0.12);
        const dx = targetX - window.innerWidth / 2;
        const dy = targetY - window.innerHeight / 2;
        crest.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        crest.style.opacity = "0";
      }
      setPhase("exit");
      // liberar scroll y desmontar tras la transición
      window.setTimeout(() => {
        document.body.style.overflow = "";
        setPhase("gone");
      }, 1250);
    };

    const minDelay = reduce ? 350 : 1900;
    const t = window.setTimeout(startExit, minDelay);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink transition-opacity duration-700 ease-out ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={crestRef}
        className="relative h-[300px] w-[300px]"
        style={{
          transition:
            "transform 1.1s cubic-bezier(0.65,0,0.35,1), opacity 0.6s ease-out 0.5s",
        }}
      >
        {/* Anillo de texto girando (SVG, nítido) */}
        <svg
          viewBox="0 0 300 300"
          className="preloader-ring absolute inset-0 h-full w-full"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          <defs>
            <path
              id="preloader-circle"
              d="M32,150 A118,118 0 1,1 268,150 A118,118 0 1,1 32,150"
              fill="none"
            />
          </defs>
          <text
            fill="#bfa268"
            fontSize="21"
            letterSpacing="3.5"
            style={{ fontWeight: 500 }}
          >
            <textPath
              href="#preloader-circle"
              startOffset="0"
              textLength="741"
              lengthAdjust="spacing"
            >
              PLACE VENDÔME ✦ BUENOS AIRES ✦
            </textPath>
          </text>
        </svg>

        {/* Monograma PV estático al centro */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brand.crestMono}
          alt=""
          className="absolute left-1/2 top-1/2 h-[86px] w-auto -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
