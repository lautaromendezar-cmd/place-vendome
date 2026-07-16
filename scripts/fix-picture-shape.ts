/**
 * Migración puntual (16-jul-2026): arregla la forma de las fotos que dejó el seed.
 *
 * El seed original guardó cada `picture`/`captionedPicture` con el campo `asset`
 * como referencia pelada ({ _type: "reference", _ref }), pero el schema lo declara
 * de tipo `image`, que es un objeto que ENVUELVE esa referencia. Con la forma
 * pelada el sitio renderizaba igual (la query hacía `asset->url`), pero el Studio
 * no podía reemplazar ninguna foto: al subir, el marcador de progreso `_upload`
 * caía adentro del ref y la API rechazaba la mutación con
 * “Key "_upload" not allowed in ref” → crash del Structure tool.
 *
 * Este script envuelve cada referencia pelada en su objeto image:
 *   asset: { _ref }  →  asset: { _type: "image", asset: { _ref } }
 *
 * Toca los documentos publicados Y sus borradores (si existen). Es idempotente:
 * las fotos que ya tienen la forma correcta no se tocan.
 *
 * Uso:
 *   1. Deployar primero la query tolerante (lib/sanity/queries.ts con coalesce).
 *   2. Crear un token de escritura (rol Editor) en sanity.io/manage → API → Tokens
 *      y ponerlo en .env.local como SANITY_API_WRITE_TOKEN.
 *   3. npm run sanity:fix-pictures        ← muestra qué cambiaría, sin escribir
 *   4. npm run sanity:fix-pictures -- --apply
 *   5. Borrar el token. Avisar que nadie edite el panel mientras corre.
 */
import { createClient } from "@sanity/client";

const projectId = requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = requireEnv("NEXT_PUBLIC_SANITY_DATASET");
const token = requireEnv("SANITY_API_WRITE_TOKEN");

const apply = process.argv.includes("--apply");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-13",
  useCdn: false,
});

/** Los singletons del sitio. Los que no tienen fotos salen ilesos igual. */
const DOC_IDS = [
  "settings",
  "hero",
  "concept",
  "gallery",
  "amenities",
  "typologies",
  "terminaciones",
  "lifestyle",
  "location",
  "contact",
  "catalog",
];

/** ¿Es una referencia pelada donde el schema espera un objeto image? */
function isBareRef(value: unknown): value is { _ref: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Record<string, unknown>)._type === "reference" &&
    typeof (value as Record<string, unknown>)._ref === "string"
  );
}

let fixedCount = 0;

/** Recorre el documento y envuelve cada asset pelado. Devuelve si cambió algo. */
function fix(node: unknown): boolean {
  if (Array.isArray(node)) {
    return node.map(fix).some(Boolean);
  }
  if (typeof node !== "object" || node === null) return false;

  const obj = node as Record<string, unknown>;
  let changed = false;

  if (
    (obj._type === "picture" || obj._type === "captionedPicture") &&
    isBareRef(obj.asset)
  ) {
    // Solo _type y _ref: si un intento de subida fallido dejó basura (_upload)
    // dentro del ref, acá se descarta.
    obj.asset = {
      _type: "image",
      asset: { _type: "reference", _ref: obj.asset._ref },
    };
    fixedCount += 1;
    changed = true;
  }

  for (const value of Object.values(obj)) {
    if (fix(value)) changed = true;
  }
  return changed;
}

async function migrateDoc(id: string) {
  const doc = await client.getDocument(id);
  if (!doc) return;

  const before = fixedCount;
  if (!fix(doc)) {
    console.log(`  = ${id} (sin cambios)`);
    return;
  }

  if (apply) {
    await client.createOrReplace(doc);
    console.log(`  ✓ ${id}: ${fixedCount - before} foto(s) corregida(s)`);
  } else {
    console.log(`  → ${id}: corregiría ${fixedCount - before} foto(s)`);
  }
}

async function main() {
  console.log(
    apply
      ? `Migrando fotos en ${projectId}/${dataset}…`
      : `Simulación (sin escribir). Para aplicar: npm run sanity:fix-pictures -- --apply`,
  );

  for (const id of DOC_IDS) {
    await migrateDoc(id);
    await migrateDoc(`drafts.${id}`);
  }

  console.log(
    apply
      ? `\nListo: ${fixedCount} foto(s) migrada(s). Probá subir una foto desde /studio.`
      : `\nTotal a corregir: ${fixedCount} foto(s).`,
  );
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Falta la variable de entorno ${name} (ver .env.example).`);
    process.exit(1);
  }
  return value;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
