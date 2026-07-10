"use client";

import { useEffect, useRef } from "react";

/**
 * Video del hero con loop sin corte: en lugar de reiniciar de golpe (loop nativo),
 * usa dos <video> con el mismo clip y hace un fundido cruzado cuando uno está por
 * terminar, arrancando el otro desde el principio. El salto final→inicio se
 * disuelve en vez de notarse el corte.
 */
const FADE = 0.9; // segundos de crossfade (coincide con la transición CSS)

export default function HeroVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    let active = a;
    let hidden = b;
    let armed = false;

    const swap = () => {
      hidden.currentTime = 0;
      void hidden.play().catch(() => {});
      hidden.style.opacity = "1";
      active.style.opacity = "0";
      [active, hidden] = [hidden, active];
      armed = false;
    };

    const onTime = (e: Event) => {
      const v = e.target as HTMLVideoElement;
      if (v !== active || armed) return;
      const dur = v.duration;
      if (!dur || Number.isNaN(dur)) return;
      if (v.currentTime >= dur - FADE) {
        armed = true;
        swap();
      }
    };

    a.addEventListener("timeupdate", onTime);
    b.addEventListener("timeupdate", onTime);
    void a.play().catch(() => {});

    return () => {
      a.removeEventListener("timeupdate", onTime);
      b.removeEventListener("timeupdate", onTime);
    };
  }, [src]);

  const common =
    "hero-video absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-linear";

  return (
    <>
      <video
        ref={aRef}
        className={common}
        style={{ opacity: 1 }}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={bRef}
        className={common}
        style={{ opacity: 0 }}
        src={src}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </>
  );
}
