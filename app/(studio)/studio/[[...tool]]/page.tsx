/**
 * El panel de contenido, servido dentro del mismo sitio: /studio
 * Toda la ruta la maneja Sanity Studio del lado del cliente.
 */
import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
