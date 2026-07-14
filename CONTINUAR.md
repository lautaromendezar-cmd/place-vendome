# Continuar en otra PC

Estado al 14-jul-2026. Traspaso entre máquinas.

## Arrancar en la PC nueva

```bash
git clone https://github.com/lautaromendezar-cmd/place-vendome.git
cd place-vendome
npm install

npx vercel login          # misma cuenta de siempre
npx vercel link --yes --project place-vendome
npx vercel env pull .env.local --environment=production

npm run dev               # sitio en :3000, panel en :3000/studio
```

**`vercel env pull` NO recupera los valores.** Las 4 variables están cargadas en
Vercel como *sensitive*: `vercel env ls` las lista, pero el `pull` las devuelve con
**string vacío**. Es a propósito, Vercel no las deja leer de vuelta. Y sin
`--environment=production` es peor todavía: baja el entorno Development, que está
vacío, y trae un `.env.local` con solo `VERCEL_OIDC_TOKEN`.

Tres de las cuatro se reconstruyen a mano con los datos de este mismo archivo:

```
NEXT_PUBLIC_SANITY_PROJECT_ID="ilht6do1"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SITE_URL="https://place-vendome.vercel.app"
SANITY_REVALIDATE_SECRET="<ver abajo>"
```

`SANITY_REVALIDATE_SECRET` es el único irrecuperable. Si lo perdés, **rotalo** —es
gratis, porque su único consumidor es el webhook—: generá uno con
`openssl rand -hex 32`, cargalo en Vercel en Production **y** Preview, redeployá, y
pegá el mismo valor en el campo *Secret* del webhook en sanity.io/manage. Se rotó
así el 14-jul-2026.

`SANITY_API_WRITE_TOKEN` no se baja ni se necesita: era solo para la carga inicial,
que ya está hecha. El sitio en producción únicamente lee.

## Dónde está todo

- **Sitio en vivo:** https://place-vendome.vercel.app
- **Panel del cliente:** https://place-vendome.vercel.app/studio
- **Sanity:** proyecto `place-vendome`, ID `ilht6do1`, dataset `production`.
  Se administra en sanity.io/manage.
- **Vercel:** proyecto `place-vendome`, deploy automático al pushear a `main`.
  Las 4 variables de entorno ya están cargadas en Production y Preview.

## Hecho

- Panel Sanity embebido en `/studio`, con las 10 secciones del sitio.
- Las 77 fotos de `/public` subidas a Sanity y las secciones sembradas con el
  contenido actual (`npm run sanity:seed`). **No volver a correr el seed**: pisa
  lo que el cliente haya editado.
- El sitio en producción sirve las fotos desde el CDN de Sanity (verificado).
- Variables cargadas en Vercel y deploy andando.
- **Webhook de Sanity andando** (14-jul-2026). Publicar en el panel revalida el sitio
  en segundos, verificado de punta a punta: se editó el `headline` de Concept desde
  `/studio`, se publicó, y el texto nuevo apareció en producción sin esperar.
  Está creado en sanity.io/manage → API → Webhooks: URL
  `https://place-vendome.vercel.app/api/revalidate`, dataset `production`,
  Create/Update/Delete, POST, con el secreto en *Secret*.
  El `revalidate: 3600` de `lib/sanity/content.ts` queda como red de seguridad por si
  un webhook se pierde; el camino normal es el webhook.

## Pendiente

- [ ] **Borrar el token `seed`** en sanity.io/manage → API → Tokens. Ya cumplió.
- [ ] **Invitar al cliente** a Sanity con rol **Editor** (no Administrator: no debe
      poder tocar schemas ni tokens).
- [ ] **DNS**: el dominio está en nic.ar a nombre del cliente y no comparte la clave
      fiscal. Plan: crear la zona en Cloudflare, pasarle los 2 nameservers y que él
      los cargue **una única vez** en nic.ar → Delegaciones. Desde ahí el DNS se
      maneja entero desde Cloudflare, sin volver a depender de él.
      Delegar a Cloudflare y **no** a Vercel: si mañana cambiás de hosting, no hay
      que pedirle la clave otra vez.
- [ ] **Hosting**: el plan free de Vercel es solo para uso no comercial. Para un
      sitio de un desarrollador inmobiliario corresponde Pro (~USD 20/mes), y va en
      lo que se le cobra al cliente.
- [ ] **Manual en PDF** para el cliente explicando el panel.
- [ ] Endpoints de los formularios de Contacto y Catálogo (siguen con `// TODO`).

## Tres gotchas que te van a morder

**Sanity queda fijo en la línea 4.x.** `sanity@5` usa `useEffectEvent`, que es de
React 19.2, pero Next 15 empaqueta su **propia** copia de React 19.1 para el App
Router: el build revienta aunque `node_modules` tenga React 19.2. La combinación que
funciona es `sanity@4.22` + `@sanity/vision@4` + `next-sanity@11` sobre Next 15.5.
Para saltar a Sanity 5 hay que subir a Next 16 primero.

**Next cachea las respuestas de Sanity en `.next/cache` entre builds.** Si editás algo
en el panel y no lo ves localmente, `rm -rf .next` y rebuildeá. En producción no pasa
porque el webhook tira el caché.

**Cambiar una env var en Vercel no hace nada hasta que redeployes.** Las variables se
congelan en el deploy: el sitio en vivo sigue corriendo con el valor viejo aunque
`vercel env ls` ya muestre el nuevo. Si rotás `SANITY_REVALIDATE_SECRET` y no
redeployás, Sanity firma con el secreto nuevo, producción valida contra el viejo y
`/api/revalidate` devuelve **401 "Firma inválida"** en cada publicación del cliente.
Para chequear que producción tiene el secreto vivo, sin depender de Sanity: firmá un
POST a mano —`sanity-webhook-signature: t=<ts>,v1=<base64url(HMAC-SHA256(secreto,
"<ts>.<body>"))>`— y esperá un `200 {"revalidated":true}`. Un POST sin firma tiene que
dar 401.

## Cómo está armado el contenido

`content/site.ts` **sigue siendo la base**. Sanity devuelve solo lo que el cliente
editó y se mergea encima (`lib/sanity/content.ts`). Si Sanity se cae, el sitio se
sirve igual desde el código — está probado.

Los nombres de campo del schema son **idénticos** a las claves de `SiteContent`
(`lib/types.ts`), por eso el merge es 1:1 y ningún componente sabe que existe un CMS.
Si agregás un campo, respetá esa regla.

- **Editable desde el panel:** textos, fotos de galería/amenities/terminaciones,
  WhatsApp, título y descripción para Google, y el PDF del catálogo.
- **Fijo en el código:** marca y logos, menú, planos, labels de los formularios y
  textos legales. El cliente no los puede romper.
- La frase de Lifestyle se escribe con `*asteriscos*` para las itálicas y se parsea a
  segmentos en `parseStatement()`.
