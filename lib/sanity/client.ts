import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Servimos desde la CDN de Sanity: más rápido y más barato.
  // El contenido igual se ve al instante porque el webhook revalida el caché de Next.
  useCdn: true,
  perspective: "published",
});
