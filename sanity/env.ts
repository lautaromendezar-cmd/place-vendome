/** Config compartida entre el Studio y el sitio. */

export const projectId = assert(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assert(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

/**
 * Fecha fija: le dice a Sanity con qué versión de su API hablamos.
 * No la muevas salvo que quieras adoptar features nuevas de la API.
 */
export const apiVersion = "2026-07-13";

function assert(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copiá .env.example a .env.local y completala.`,
    );
  }
  return value;
}
