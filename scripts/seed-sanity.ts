/**
 * Carga inicial del panel.
 *
 * Sube a Sanity todas las fotos que hoy viven en /public y crea las secciones
 * con el contenido actual de content/site.ts. Así el cliente abre el panel y
 * encuentra el sitio tal como está, no formularios en blanco.
 *
 * Uso (una sola vez, con el proyecto ya creado):
 *   npm run sanity:seed
 *
 * Es idempotente: si lo corrés de nuevo, reemplaza las secciones por el contenido
 * de content/site.ts. Ojo con eso: pisa lo que el cliente haya editado en el panel.
 */
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@sanity/client";

import { site } from "../content/site";
import type { ImageAsset, StatementSegment } from "../lib/types";

const projectId = requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = requireEnv("NEXT_PUBLIC_SANITY_DATASET");
const token = requireEnv("SANITY_API_WRITE_TOKEN");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-13",
  useCdn: false,
});

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Una misma foto puede usarse en dos secciones: se sube una sola vez. */
const uploaded = new Map<string, string>();

async function uploadImage(src: string): Promise<string> {
  const cached = uploaded.get(src);
  if (cached) return cached;

  const filePath = path.join(PUBLIC_DIR, src);
  const buffer = await readFile(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(src),
  });

  uploaded.set(src, asset._id);
  console.log(`  ✓ ${src}`);
  return asset._id;
}

async function uploadFile(src: string): Promise<string> {
  const buffer = await readFile(path.join(PUBLIC_DIR, src));
  const asset = await client.assets.upload("file", buffer, {
    filename: path.basename(src),
  });
  console.log(`  ✓ ${src}`);
  return asset._id;
}

/** { src, alt } de site.ts → el objeto `picture` que espera el schema. */
async function picture(image: ImageAsset) {
  return {
    _type: "picture",
    _key: randomUUID(),
    asset: { _type: "reference", _ref: await uploadImage(image.src) },
    alt: image.alt,
  };
}

async function captioned(image: ImageAsset & { caption: string }) {
  return {
    _type: "captionedPicture",
    _key: randomUUID(),
    asset: { _type: "reference", _ref: await uploadImage(image.src) },
    alt: image.alt,
    caption: image.caption,
  };
}

/** Todo ítem de un array de objetos necesita su propio _key en Sanity. */
function keyed<T extends object>(items: T[]) {
  return items.map((item) => ({ ...item, _key: randomUUID() }));
}

/**
 * Inversa de parseStatement(): los segmentos en itálica vuelven a ser *asteriscos*,
 * que es como el cliente los va a editar en el panel.
 */
function toStatementText(segments: StatementSegment[]): string {
  return segments
    .map((segment) => (segment.em ? `*${segment.text}*` : segment.text))
    .join("");
}

async function main() {
  console.log(`\nSubiendo imágenes a ${projectId}/${dataset}...\n`);

  const documents: Record<string, unknown>[] = [
    {
      _id: "settings",
      _type: "settings",
      whatsapp: {
        phone: site.whatsapp.phone,
        message: site.whatsapp.message,
      },
      meta: {
        title: site.meta.title,
        description: site.meta.description,
      },
    },
    {
      _id: "hero",
      _type: "heroSection",
      tagline: site.hero.tagline,
      location: site.hero.location,
      ctaLabel: site.hero.ctaLabel,
      scrollHint: site.hero.scrollHint,
      fallbackImage: await picture(site.hero.fallbackImage),
    },
    {
      _id: "concept",
      _type: "conceptSection",
      eyebrow: site.concept.eyebrow,
      headline: site.concept.headline,
      paragraphs: site.concept.paragraphs,
      highlight: site.concept.highlight,
      image: await picture(site.concept.image),
    },
    {
      _id: "gallery",
      _type: "gallerySection",
      eyebrow: site.gallery.eyebrow,
      headline: site.gallery.headline,
      images: await Promise.all(site.gallery.images.map(picture)),
    },
    {
      _id: "amenities",
      _type: "amenitiesSection",
      eyebrow: site.amenities.eyebrow,
      headline: site.amenities.headline,
      showcase: await Promise.all(
        site.amenities.showcase.map(async (item) => ({
          _type: "amenityShowcaseItem",
          _key: randomUUID(),
          name: item.name,
          icon: item.icon,
          pending: item.pending ?? false,
          image: await picture(item.image),
        })),
      ),
      groups: keyed(
        site.amenities.groups.map((group) => ({
          _type: "amenityGroup",
          title: group.title,
          items: group.items,
        })),
      ),
    },
    {
      _id: "typologies",
      _type: "typologiesSection",
      eyebrow: site.typologies.eyebrow,
      headline: site.typologies.headline,
      stats: keyed(
        site.typologies.stats.map((stat) => ({
          _type: "typologyStat",
          ...stat,
        })),
      ),
      features: site.typologies.features,
      note: site.typologies.note,
    },
    {
      _id: "terminaciones",
      _type: "terminacionesSection",
      eyebrow: site.terminaciones.eyebrow,
      headline: site.terminaciones.headline,
      intro: site.terminaciones.intro,
      items: await Promise.all(
        site.terminaciones.items.map(async (item) => ({
          _type: "terminacionItem",
          _key: randomUUID(),
          title: item.title,
          note: item.note,
          wide: item.wide ?? false,
          image: await picture(item.image),
        })),
      ),
    },
    {
      _id: "lifestyle",
      _type: "lifestyleSection",
      eyebrow: site.lifestyle.eyebrow,
      backgroundImage: await picture(site.lifestyle.backgroundImage),
      statementText: toStatementText(site.lifestyle.statement),
    },
    {
      _id: "location",
      _type: "locationSection",
      eyebrow: site.location.eyebrow,
      headline: site.location.headline,
      intro: site.location.intro,
      paragraphs: site.location.paragraphs,
      address: site.location.address,
      mapQuery: site.location.mapQuery,
      connectivity: site.location.connectivity,
      neighborhood: await Promise.all(site.location.neighborhood.map(captioned)),
      highlights: keyed(
        site.location.highlights.map((highlight) => ({
          _type: "locationHighlight",
          ...highlight,
        })),
      ),
    },
    {
      _id: "contact",
      _type: "contactSection",
      eyebrow: site.contact.eyebrow,
      headline: site.contact.headline,
      whatsappNote: site.contact.whatsappNote,
      whatsappButton: site.contact.whatsappButton,
      successMessage: site.contact.successMessage,
      image: await picture(site.contact.image),
    },
    {
      _id: "catalog",
      _type: "catalogSection",
      eyebrow: site.catalog.eyebrow,
      headline: site.catalog.headline,
      description: site.catalog.description,
      ctaLabel: site.catalog.ctaLabel,
      file: {
        _type: "file",
        asset: { _type: "reference", _ref: await uploadFile(site.catalog.fileUrl) },
      },
    },
  ];

  console.log("\nCreando las secciones...\n");

  const tx = documents.reduce(
    (transaction, doc) => transaction.createOrReplace(doc as never),
    client.transaction(),
  );
  await tx.commit();

  for (const doc of documents) console.log(`  ✓ ${doc._id}`);

  console.log(
    `\nListo: ${uploaded.size} imágenes y ${documents.length} secciones.`,
  );
  console.log("Entrá a /studio para verlas.\n");
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `\nFalta ${name}. Completá .env.local (copiá .env.example) antes de correr esto.\n`,
    );
    process.exit(1);
  }
  return value;
}

main().catch((error) => {
  console.error("\nLa carga inicial falló:\n", error);
  process.exit(1);
});
