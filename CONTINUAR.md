# Continuar en otra PC

Estado al 16-jul-2026. Traspaso entre máquinas.

## ✅ Dónde quedó todo (leer esto primero)

**EL SITIO ESTÁ EN VIVO en https://placevendome.com.ar.** El cliente delegó el dominio
en nic.ar (los NS son `hermes/artemis.dns-parking.com`, verificado contra `c.dns.ar`),
el dominio quedó enganchado a la app buena de Hostinger, y **los 4 chequeos de deploy
pasan contra el dominio real** (verificado el 16-jul-2026):

1. `x-powered-by: Next.js` — la app Node tiene el control, no el placeholder PHP.
2. El HTML sirve imágenes desde `cdn.sanity.io` — el contenido sale de Sanity.
3. `/studio` da 200 y la API de Sanity devuelve `Access-Control-Allow-Credentials:
   true` para el origen `https://placevendome.com.ar` — el CORS está configurado.
4. `npm run revalidate -- https://placevendome.com.ar` → `200 {"revalidated":true}`.

La app duplicada rota (`firebrick-horse-539237`) **ya fue borrada** — no responde.
Vercel sigue arriba como rollback (correcto: no bajarlo hasta que Hostinger lleve unos
días estable).

**Lo único sin verificar: la URL del webhook de Sanity.** El 14-jul apuntaba a
`https://place-vendome.vercel.app/api/revalidate`. Si nadie la movió, el cliente
publica y se revalida el sitio equivocado. Se chequea en sanity.io/manage → API →
Webhooks (o `npx sanity login` + `npx sanity hook list`). Tiene que apuntar a
`https://placevendome.com.ar/api/revalidate`, mismo secreto.

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

`SANITY_REVALIDATE_SECRET` es el único que no se deduce. En la PC nueva, sacalo de
**hPanel → tu Web App → Environment Variables** (Hostinger sí deja leer el valor; Vercel
no).

Si no lo podés recuperar de ningún lado, **rotalo**: es gratis, porque su único
consumidor es el webhook. Generá uno con `openssl rand -hex 32`, cargalo en hPanel,
**redeployá** (sin eso no toma efecto), y pegá el mismo valor en el campo *Secret* del
webhook en sanity.io/manage. Tiene que quedar idéntico en los dos lados o
`/api/revalidate` devuelve 401 en cada publicación del cliente. Se rotó así el
14-jul-2026.

Para verificar que un entorno tiene el secreto correcto:
`npm run revalidate -- https://<url>` → 200 es correcto, 401 es que no coinciden.

`SANITY_API_WRITE_TOKEN` no se baja ni se necesita: era solo para la carga inicial,
que ya está hecha. El sitio en producción únicamente lee.

## Dónde está todo

- **Dominio final:** https://placevendome.com.ar (nic.ar, a nombre del cliente).
- **Hosting: Hostinger** (plan "Ilimitado" = Business Web Hosting), Web App de Node.js
  importada desde GitHub. **Build automático en cada push a `main`**, igual que Vercel.
  Las 4 variables de entorno se cargan en hPanel → Environment Variables.
  - **La app buena es `mediumslateblue-chicken-717173.hostingersite.com`.** Pasó los 4
    chequeos de más abajo.
  - **`firebrick-horse-539237.hostingersite.com` es una app duplicada y rota** (sirve el
    HTML pero da 404 en todos los estáticos). **Borrarla.** Ver *Trampas*.
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

- [x] **Delegación en nic.ar** — el cliente la hizo (verificado 16-jul contra `c.dns.ar`).
- [x] Enganchar `placevendome.com.ar` a la Web App en hPanel (SSL emitido, sirve HTTPS).
- [x] **CORS en Sanity** para `https://placevendome.com.ar`, con *Allow credentials*
      (verificado: la API devuelve `Access-Control-Allow-Credentials: true`).
- [x] **Webhook de Sanity movido al dominio final** (16-jul-2026): apunta a
      `https://placevendome.com.ar/api/revalidate`, dataset `production`, Enabled.
      Queda probarlo de punta a punta con la primera publicación real del cliente.
- [x] Correr los 4 chequeos de *Cómo probar un deploy* contra el dominio real
      (pasaron los 4 el 16-jul-2026).
- [ ] Recién ahí: dar de baja Vercel (esperar unos días de estabilidad; al 16-jul
      sigue arriba como rollback).

### Urgente: migrar la forma de las fotos (16-jul-2026)

El cliente no puede subir fotos desde el panel: el seed guardó cada `picture.asset`
como referencia pelada en vez del objeto `image` que declara el schema, y el Studio
crashea al subir (“Key "_upload" not allowed in ref”). Los textos se editan bien;
**solo las fotos están rotas**. El fix está en el repo:

1. [x] Query tolerante a ambas formas (`coalesce` en `lib/sanity/queries.ts`).
2. [x] Deployado (commit `6b94b93`, build de Hostinger completado 16-jul 12:07).
3. [x] Token temporal `fix-pictures-temporal` creado (rol Editor).
4. [x] Migración aplicada: **42 fotos corregidas** en 9 documentos + 2 borradores
       (los borradores del cliente en Portada y Terminaciones se migraron sin
       perder sus cambios). Verificado: el dato quedó como objeto `image` y el
       sitio siguió sirviendo las fotos sin corte.
5. [x] Subida probada de punta a punta (16-jul 12:32): foto nueva de cocheras subida
       desde `/studio`, publicada, y visible en el HTML del dominio en segundos.
6. [x] Token sacado de `.env.local`. **Verificar que `fix-pictures-temporal` esté
       borrado en sanity.io/manage → API → Tokens** (se creó con expiración corta,
       así que se muere solo igual, pero mejor borrarlo a mano).

**Cierre (16-jul-2026, tarde):** el cliente editó textos y fotos desde el panel,
publicó, y los cambios se vieron en el sitio con el CDN activo. Flujo completo
funcionando sin intervención.

### Después

- [x] **Token de escritura borrado** (16-jul-2026). Se llamaba `paneladmin` (rol
      Editor, el del seed). No queda ningún token en el proyecto; si algún día hace
      falta escribir por script, se crea uno nuevo en API → Tokens.
- [x] **Cliente invitado** a Sanity con rol **Editor** y manual PDF enviado
      (16-jul-2026). Falta la prueba de punta a punta: cuando publique su primer
      cambio, verificar que aparezca en `https://placevendome.com.ar` (eso valida el
      webhook nuevo con una publicación real).
- [ ] **Casillas de correo** en Hostinger, si el cliente las llega a querer. Hoy dijo
      que no usa mail del dominio (ver *Zona DNS vieja*).
- [x] **Manual en PDF** para el cliente explicando el panel (16-jul-2026): fuente en
      `docs/manual-panel.html`, PDF en `docs/Manual-Panel-Place-Vendome.pdf`. Para
      regenerarlo tras un cambio: abrir el HTML con Edge headless
      (`msedge --headless --no-pdf-header-footer --print-to-pdf=...`).
      Ojo: el proyecto de Sanity está en **Growth Trial**; el rol Editor es de Growth.
      Cuando el trial venza y baje a Free, todos los miembros pasan a Administrator.
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

## Trampas de Hostinger (ya pagadas, no volver a pisarlas)

**Enganchá el dominio DESDE ADENTRO de la app, nunca por el asistente de "Agregar sitio
web".** Volver a pasar por el asistente **crea una Web App duplicada** con URL temporal
nueva, y la vieja se queda sin archivos estáticos. Así nació `firebrick-horse`, que
sirve el HTML pero da 404 en el logo, las fuentes y el JS. Business son **5 Web Apps**:
cada duplicado te come un slot.

**Hostinger sirve `/public` y los estáticos perfectamente.** Si ves 404 masivos en
assets, sospechá de una app duplicada antes que del hosting. El síntoma engaña porque el
HTML sigue saliendo de caché (`x-hcdn-cache-status: HIT`) y el sitio *parece* vivo.

**El bot Kodee miente.** Es el asistente de ventas, no soporte. Te va a decir que las
Web Apps son ilimitadas; la página de producto dice 5 en Business. Contrastá siempre.

**Después de cada deploy: purgar el caché del CDN** (hPanel → Rendimiento → CDN →
Purgar caché). El CDN de Hostinger cachea el HTML de las páginas según el
`s-maxage` que manda Next (= el `revalidate` de `lib/sanity/content.ts`), así que
un nodo puede seguir sirviendo HTML de un build viejo que apunta a CSS/JS que el
deploy nuevo borró → el sitio se ve sin estilos y un Ctrl+F5 no lo arregla,
porque el caché no está en el navegador. Pasó el 16-jul-2026.

**El CDN también demora las publicaciones del cliente.** El webhook revalida el
caché de Next, pero el CDN no se entera y sirve su copia hasta que vence el
`s-maxage`. Por eso el `revalidate` está en **60** (16-jul-2026): lo que el
cliente publica tarda a lo sumo un minuto en verse, para todo el mundo. No
subirlo de vuelta a 3600 sin recordar esto. El "modo desarrollo" del CDN en
hPanel puentea el caché para probar, pero se apaga solo (~3 h) y no es solución.

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
