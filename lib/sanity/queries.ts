import { defineQuery } from "next-sanity";

/**
 * Foto → el mismo shape que ImageAsset en lib/types.ts: { src, alt }
 *
 * El coalesce tolera las dos formas del campo `asset`:
 * - `asset.asset->url`: la forma correcta del tipo `image` (objeto que envuelve la
 *   referencia), que es lo que escribe el Studio cuando el cliente sube una foto.
 * - `asset->url`: la referencia pelada que dejó el seed original (scripts/
 *   fix-picture-shape.ts migra los documentos, pero esto cubre cualquier resto).
 */
const PICTURE = `{ "src": coalesce(asset.asset->url, asset->url), alt }`;
const CAPTIONED = `{ "src": coalesce(asset.asset->url, asset->url), alt, caption }`;

/**
 * Una sola consulta trae todo el contenido editable del sitio.
 * Cada clave devuelve null si esa sección todavía no se creó en el panel:
 * en ese caso el sitio usa el valor de content/site.ts.
 */
export const siteContentQuery = defineQuery(`{
  "settings": *[_id == "settings"][0]{
    whatsapp{ phone, message },
    meta{ title, description }
  },

  "hero": *[_id == "hero"][0]{
    tagline, location, ctaLabel, scrollHint,
    fallbackImage${PICTURE}
  },

  "concept": *[_id == "concept"][0]{
    eyebrow, headline, paragraphs, highlight,
    image${PICTURE}
  },

  "gallery": *[_id == "gallery"][0]{
    eyebrow, headline,
    images[]${PICTURE}
  },

  "amenities": *[_id == "amenities"][0]{
    eyebrow, headline,
    showcase[]{ name, icon, pending, image${PICTURE} },
    groups[]{ title, items }
  },

  "typologies": *[_id == "typologies"][0]{
    eyebrow, headline, stats[]{ value, label }, features, note
  },

  "terminaciones": *[_id == "terminaciones"][0]{
    eyebrow, headline, intro,
    items[]{ title, note, wide, image${PICTURE} }
  },

  "lifestyle": *[_id == "lifestyle"][0]{
    eyebrow, statementText,
    backgroundImage${PICTURE}
  },

  "location": *[_id == "location"][0]{
    eyebrow, headline, intro, paragraphs, address, mapQuery, connectivity,
    neighborhood[]${CAPTIONED},
    highlights[]{ title, text }
  },

  "contact": *[_id == "contact"][0]{
    eyebrow, headline, whatsappNote, whatsappButton, successMessage,
    image${PICTURE}
  },

  "catalog": *[_id == "catalog"][0]{
    eyebrow, headline, description, ctaLabel,
    "fileUrl": file.asset->url
  }
}`);
