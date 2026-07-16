import "server-only";

import { site } from "@/content/site";
import type {
  AmenitiesContent,
  CatalogContent,
  ConceptContent,
  ContactContent,
  GalleryContent,
  HeroContent,
  LifestyleContent,
  LocationContent,
  SiteContent,
  StatementSegment,
  TerminacionesContent,
  TypologiesContent,
  WhatsAppConfig,
} from "@/lib/types";

import { sanityClient } from "./client";
import { mergeContent } from "./merge";
import { siteContentQuery } from "./queries";

/** Etiqueta de caché que revalida el webhook de Sanity (app/api/revalidate). */
export const SITE_CONTENT_TAG = "site-content";

/**
 * El contenido del sitio: content/site.ts como base, con lo editado en el panel encima.
 *
 * Si Sanity no responde, el sitio se sirve igual con los valores de content/site.ts.
 * Una caída del CMS no puede tirar abajo la web del cliente.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const remote = await fetchContent();
  if (!remote) return site;

  const { settings, lifestyle, ...sections } = remote;

  return mergeContent(site, {
    ...sections,
    meta: settings?.meta,
    whatsapp: settings?.whatsapp,
    lifestyle: lifestyle && {
      eyebrow: lifestyle.eyebrow,
      backgroundImage: lifestyle.backgroundImage,
      statement: parseStatement(lifestyle.statementText),
    },
  });
}

/**
 * Lo que devuelve siteContentQuery. Todo es opcional a propósito: una sección que
 * el cliente todavía no tocó vuelve como null, y ahí manda content/site.ts.
 *
 * Los campos que NO están acá (marca, menú, planos, labels, legales) nunca salen
 * del código: no son editables desde el panel.
 */
type Editable<T> = Partial<T> | null;

interface RemoteContent {
  settings: Editable<{
    whatsapp: Pick<WhatsAppConfig, "phone" | "message">;
    meta: SiteContent["meta"];
  }>;
  hero: Editable<HeroContent>;
  concept: Editable<ConceptContent>;
  gallery: Editable<GalleryContent>;
  amenities: Editable<AmenitiesContent>;
  typologies: Editable<TypologiesContent>;
  terminaciones: Editable<TerminacionesContent>;
  /** En el panel la frase es texto plano con *asteriscos*, no el array de segmentos. */
  lifestyle: Editable<
    Omit<LifestyleContent, "statement"> & { statementText: string }
  >;
  location: Editable<LocationContent>;
  contact: Editable<ContactContent>;
  catalog: Editable<CatalogContent>;
}

async function fetchContent(): Promise<RemoteContent | null> {
  try {
    return await sanityClient.fetch<RemoteContent>(
      siteContentQuery,
      {},
      {
        next: {
          tags: [SITE_CONTENT_TAG],
          // Red de seguridad por si un webhook se pierde — y, más importante,
          // este valor sale como `s-maxage` en el Cache-Control del HTML: es el
          // tiempo MÁXIMO que el CDN de Hostinger puede servir una página vieja
          // después de que el cliente publica. Con 3600 los visitantes veían
          // contenido de hasta una hora atrás (el webhook revalida Next, pero el
          // CDN tiene su propio caché y no se entera). Con 60, un minuto a lo sumo.
          revalidate: 60,
        },
      },
    );
  } catch (error) {
    console.error(
      "[sanity] No se pudo leer el contenido; se sirve content/site.ts",
      error,
    );
    return null;
  }
}

/**
 * "el lujo no se *muestra*: se *habita*"
 *   → [{text: "el lujo no se "}, {text: "muestra", em: true}, ...]
 *
 * Los asteriscos son la forma en que el cliente marca itálicas desde el panel,
 * sin tener que entender el array de segmentos que consume el componente.
 */
export function parseStatement(
  text: string | null | undefined,
): StatementSegment[] | undefined {
  if (!text) return undefined;

  const segments: StatementSegment[] = [];

  for (const part of text.split(/(\*[^*]+\*)/g)) {
    if (!part) continue;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      segments.push({ text: part.slice(1, -1), em: true });
    } else {
      segments.push({ text: part });
    }
  }

  return segments.length > 0 ? segments : undefined;
}
