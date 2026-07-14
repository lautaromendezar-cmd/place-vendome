# Place Vendôme — Landing institucional

Landing premium de una sola página para Place Vendôme (Liniers, Buenos Aires).
Next.js (App Router) + TypeScript + Tailwind CSS v4. Lista para deploy en Vercel.

## Correr

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
```

## Contenido: el panel del cliente

El cliente edita textos y fotos en **Sanity Studio**, servido dentro del mismo
sitio en `/studio`.

**`content/site.ts` sigue siendo la base**: Sanity devuelve solo lo que el cliente
editó y se mergea encima ([`lib/sanity/content.ts`](lib/sanity/content.ts)).
Dos consecuencias que importan:

- Si Sanity se cae o tarda, el sitio se sirve igual con los valores del código.
  Una caída del CMS no tira abajo la web.
- Lo que **no** está en los schemas nunca es editable: marca y logos, menú,
  planos, labels de los formularios y textos legales viven solo en el código,
  donde el cliente no los puede romper.

Los nombres de campo en Sanity son idénticos a las claves de `SiteContent`
([`lib/types.ts`](lib/types.ts)), por eso el merge es 1:1 y **los componentes no
saben que existe un CMS**. Si agregás un campo, respetá esa regla.

### Puesta en marcha (una sola vez)

```bash
cp .env.example .env.local     # completar con los datos del proyecto Sanity
npm run sanity:seed            # sube /public a Sanity y crea las secciones
npm run dev                    # el panel queda en /localhost:3000/studio
```

`sanity:seed` es idempotente pero **pisa lo que el cliente haya editado**: se
corre en la carga inicial y después no se toca más.

### Que el cliente vea sus cambios al instante

En sanity.io/manage → API → Webhooks, crear uno que apunte a
`https://<dominio>/api/revalidate` (POST) con el mismo secreto que
`SANITY_REVALIDATE_SECRET`. Sin eso los cambios igual salen, pero tardan hasta
1 hora (el `revalidate` de red de seguridad).

## Assets

- Originales del cliente en `./material/` (excluida del deploy vía `.gitignore`).
- Los usados por el sitio están normalizados (kebab-case) en `./public/`.
- Logo e íconos: recoloreados a dorado/marfil sobre fondo transparente a partir
  de los originales (el logo original es un PNG de 225px — **pedir versión
  vectorial al cliente** para mejor nitidez).
- Planos (`E1-*`, `E2-*` y PDFs de plantas) quedan en `material/` para una
  próxima etapa; no se usan en la muestra.

## Pendientes (TODO)

- [ ] Crear el proyecto en Sanity y completar `.env.local` + las variables en Vercel.
- [ ] Correr `npm run sanity:seed` e invitar al cliente como **Editor**
      (rol Editor, no Administrator: no debe poder tocar schemas ni tokens).
- [ ] Delegar el dominio de nic.ar a los nameservers de Cloudflare (lo hace el
      cliente con su clave fiscal, una única vez) y desde ahí apuntar a Vercel.
- [ ] Número real de WhatsApp → ahora se carga desde el panel (Ajustes generales).
- [ ] Endpoint de los formularios de Contacto y Catálogo
      (`components/Contact.tsx` y `components/CatalogCta.tsx`, marcados con `// TODO`).
- [ ] Detalle de "Seguridad y Servicios generales" según brochure (placeholder en `site.ts`).
- [ ] Datos legales del desarrollador en el footer (placeholder en `site.ts`).
- [ ] GA4 / Pixel si se lanza pauta.
- [ ] Setear `NEXT_PUBLIC_SITE_URL` en Vercel con el dominio final (hoy usa
      `place-vendome.vercel.app` como base para las URLs de Open Graph / preview
      al compartir). El favicon y la `og-image.jpg` ya están generados.
