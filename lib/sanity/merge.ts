/**
 * Mergea el contenido que viene de Sanity sobre los valores por defecto de content/site.ts.
 *
 * Reglas:
 * - null / undefined → gana el default. Un campo que el cliente todavía no cargó
 *   (o una sección que ni existe en el panel) nunca deja un hueco en el sitio.
 * - Los arrays se reemplazan enteros, no se fusionan ítem por ítem. Si el cliente
 *   dejó la galería en 3 fotos, el sitio muestra 3, no 3 + las 10 viejas.
 * - Los objetos se recorren campo por campo.
 */
export function mergeContent<T>(base: T, override: unknown): T {
  if (override === null || override === undefined) return base;

  if (Array.isArray(override)) return override as T;

  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
      if (value === null || value === undefined) continue;
      result[key] = mergeContent((base as Record<string, unknown>)[key], value);
    }
    return result as T;
  }

  return override as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value)
  );
}
