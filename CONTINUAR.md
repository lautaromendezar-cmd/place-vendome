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

- **Dominio final:** https://placevendome.com.ar (nic.ar, a nombre del cliente).
- **Hosting: Hostinger** (plan "Ilimitado" = Business Web Hosting), Web App de Node.js
  importada desde GitHub. **Build automático en cada push a `main`**, igual que Vercel.
  URL temporal mientras propaga el DNS: `firebrick-horse-539237.hostingersite.com`.
  Las 4 variables de entorno se cargan en hPanel → Environment Variables.
- **Panel del cliente:** `/studio` sobre el dominio de arriba.
- **Sanity:** proyecto `place-vendome`, ID `ilht6do1`, dataset `production`.
  Se administra en sanity.io/manage.
- **Vercel:** `place-vendome.vercel.app`. **Es el rollback, no el sitio.** No borrar el
  proyecto hasta que Hostinger lleve unos días estable.

### Migrar a Hostinger: lo que hay que tocar además del deploy

Tres cosas fuera del repo, y si te olvidás una parece que la migración falló:

1. **CORS en Sanity** (sanity.io/manage → API → CORS Origins): agregar el origen nuevo
   **con "Allow credentials" tildado**. Sin esto `/studio` carga pero no deja loguear.
2. **URL del webhook** (API → Webhooks): apuntarla al dominio nuevo. Si sigue en el
   dominio viejo, el cliente publica y se revalida el sitio equivocado.
3. **`NEXT_PUBLIC_SITE_URL`**: solo afecta el `metadataBase` (Open Graph / canonical),
   no el render. Se puede poner el dominio final desde el principio.

Para verificar un entorno nuevo sin depender del cliente, ver *Cómo probar un deploy*.

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

### Para terminar de publicar (en este orden)

- [ ] **Delegación en nic.ar**: la hace el **cliente** (el dominio está a su nombre y no
      comparte la clave fiscal). Tiene que reemplazar los nameservers por
      `hermes.dns-parking.com` y `artemis.dns-parking.com`. Es el paso más lento y el
      único que no controlás: mandáselo primero, no último.
- [ ] Enganchar `placevendome.com.ar` a la Web App en hPanel (el SSL se emite solo).
- [ ] **CORS en Sanity** para `https://placevendome.com.ar`, con *Allow credentials*.
- [ ] **Mover la URL del webhook** de Sanity al dominio final. Hasta que lo hagas, el
      cliente publica y se revalida el sitio viejo de Vercel.
- [ ] Correr los 4 chequeos de *Cómo probar un deploy* contra el dominio real.
- [ ] Recién ahí: dar de baja Vercel (esperar unos días de estabilidad).

### Después

- [ ] **Borrar el token `seed`** en sanity.io/manage → API → Tokens. Ya cumplió.
- [ ] **Invitar al cliente** a Sanity con rol **Editor** (no Administrator: no debe
      poder tocar schemas ni tokens).
- [ ] **Casillas de correo** en Hostinger, si el cliente las llega a querer. Hoy dijo
      que no usa mail del dominio (ver *Zona DNS vieja*).
- [ ] **Manual en PDF** para el cliente explicando el panel.
- [ ] Endpoints de los formularios de Contacto y Catálogo (siguen con `// TODO`).
- [ ] `placevendome.ar`: confirmar si está registrado y, si sí, 301 al `.com.ar`.

### Rendimiento, para mirar cuando esté en vivo

- [ ] `next.config.ts` genera **AVIF**, que es caro de computar. En Vercel lo cacheaba el
      edge; en Hostinger la primera visita de cada imagen paga la conversión en el
      server. Con 77 imágenes, el primer recorrido va lento hasta que se llena el caché
      en disco. Si molesta, sacar AVIF y dejar solo WebP.

## Cómo probar un deploy sin depender del cliente

Cuatro chequeos. Los tres primeros son curl; el cuarto es el que importa.

1. **¿Corre Next como server?** Que la respuesta **no** traiga `x-powered-by: PHP`
   (eso es el placeholder de Hostinger: significa que la app Node no tomó el control).
2. **¿El contenido sale de Sanity o del código?** Buscar en el HTML un texto que el
   cliente haya editado desde el panel. Si aparece el valor viejo de `content/site.ts`,
   el sitio está sirviendo solo el fallback: o el fetch server-side no anda, o las
   variables de entorno están mal cargadas. Este chequeo es el que desenmascara una
   migración a medias, porque el sitio *parece* andar igual.
3. **¿`/studio` responde 200?** Ojo: un 200 **no** prueba que el login ande. Eso es CORS,
   y se verifica aparte pegándole a la API de Sanity con el header `Origin` del dominio
   nuevo: tiene que devolver `Access-Control-Allow-Credentials: true`.
4. **`npm run revalidate -- https://<url>`** → tiene que dar `200 {"revalidated":true}`.
   Esta es la prueba de fuego: si da 200, el ISR y `revalidateTag` funcionan en ese
   hosting y el webhook de Sanity va a andar ahí. Si da 401, el secreto del server no
   coincide con el de tu `.env.local`.

## Zona DNS vieja de placevendome.com.ar (por si hay que volver)

Antes de delegar a Hostinger, el dominio estaba en los nameservers de `wcaup.com`
(proveedor anterior), con un sitio viejo y un setup de correo completo. **El cliente
confirmó que no usa esas casillas**, así que no se preservaron. Queda anotado porque al
delegar, la zona vieja desaparece y estos valores ya no se pueden leer:

```
A     @        190.210.132.170      (sitio anterior)
A     www      190.210.132.170
MX    @        mxin1.wcaup.com      (prioridad 10)
TXT   @        v=spf1 mx a ip4:190.210.9.0/24 ip4:190.210.132.0/24 ~all
A     smtp     190.210.132.173
A     imap     190.210.132.172
A     pop      190.210.132.172
A     ftp      190.210.132.170
```

Si aparece alguien de la oficina del cliente diciendo que no le llegan los mails: eran
estos registros. Se recrean el `MX`, el `TXT` y los `A` de smtp/imap/pop en la zona de
Hostinger. **Y no dar de baja el hosting viejo**: las casillas viven en ese servidor,
no en el DNS. El DNS solo dice dónde están.

`placevendome.ar`: da NXDOMAIN, no tiene delegación. No se pudo confirmar desde afuera
si está registrado (nic.ar no expone RDAP ni whois público). Verificar en *Mis dominios*
dentro de nic.ar. Si existe, delegarlo también y redirigir con un 301 al `.com.ar`.

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
