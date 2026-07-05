# Place Vendôme — Landing institucional

Landing premium de una sola página para Place Vendôme (Liniers, Buenos Aires).
Next.js (App Router) + TypeScript + Tailwind CSS v4. Lista para deploy en Vercel.

## Correr

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
```

## Capa de contenido (para migrar a Sanity)

**Todo** el contenido (textos, rutas de imágenes, listas) vive en
[`content/site.ts`](content/site.ts), tipado por [`lib/types.ts`](lib/types.ts).
Los componentes solo reciben esos objetos: hacer el sitio editable es mapear
cada sección a un documento del CMS, sin tocar componentes.

## Assets

- Originales del cliente en `./material/` (excluida del deploy vía `.gitignore`).
- Los usados por el sitio están normalizados (kebab-case) en `./public/`.
- Logo e íconos: recoloreados a dorado/marfil sobre fondo transparente a partir
  de los originales (el logo original es un PNG de 225px — **pedir versión
  vectorial al cliente** para mejor nitidez).
- Planos (`E1-*`, `E2-*` y PDFs de plantas) quedan en `material/` para una
  próxima etapa; no se usan en la muestra.

## Pendientes (TODO)

- [ ] Número real de WhatsApp → `content/site.ts` (`whatsapp.phone`).
- [ ] Endpoint de los formularios de Contacto y Catálogo
      (`components/Contact.tsx` y `components/CatalogCta.tsx`, marcados con `// TODO`).
- [ ] Detalle de "Seguridad y Servicios generales" según brochure (placeholder en `site.ts`).
- [ ] Datos legales del desarrollador en el footer (placeholder en `site.ts`).
- [ ] GA4 / Pixel si se lanza pauta.
- [ ] Setear `NEXT_PUBLIC_SITE_URL` en Vercel con el dominio final (hoy usa
      `place-vendome.vercel.app` como base para las URLs de Open Graph / preview
      al compartir). El favicon y la `og-image.jpg` ya están generados.
