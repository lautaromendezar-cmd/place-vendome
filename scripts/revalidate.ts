/**
 * Tira el caché de contenido del sitio, igual que lo haría Sanity al publicar.
 *
 *   npm run revalidate                          → contra NEXT_PUBLIC_SITE_URL
 *   npm run revalidate -- https://otro.sitio    → contra una URL puntual
 *
 * ¿Cuándo se usa? Después de un deploy TUYO (un cambio de código, no del panel).
 *
 * El webhook de Sanity solo dispara cuando el cliente publica. Si el último que
 * tocó algo fuiste vos, no dispara nadie: el deploy nuevo puede reconstruirse con
 * una respuesta de Sanity cacheada y dejar el sitio mostrando contenido viejo
 * hasta que venza el revalidate de 1h de lib/sanity/content.ts. Esto lo fuerza.
 *
 * Sirve además para probar que un entorno tiene bien cargado el secreto: si
 * devuelve 401, el SANITY_REVALIDATE_SECRET del server no es el que tenés acá.
 */

import { createHmac } from "node:crypto";

async function main(): Promise<void> {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const target = process.argv[2] ?? process.env.NEXT_PUBLIC_SITE_URL;

  if (!secret) {
    fail("Falta SANITY_REVALIDATE_SECRET. Está en .env.local.");
  }
  if (!target) {
    fail("No sé contra qué sitio revalidar: pasá una URL o definí NEXT_PUBLIC_SITE_URL.");
  }

  const endpoint = new URL("/api/revalidate", target).toString();

  /**
   * La misma firma que manda Sanity y que valida parseBody() de next-sanity:
   * HMAC-SHA256 sobre "<timestamp>.<body>", en base64url.
   */
  const body = JSON.stringify({ _type: "manual", _id: "manual" });
  const timestamp = Date.now();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("base64url");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "sanity-webhook-signature": `t=${timestamp},v1=${signature}`,
    },
    body,
  });

  const text = await response.text();

  if (!response.ok) {
    fail(
      `${endpoint} respondió ${response.status}: ${text}` +
        (response.status === 401
          ? "\n\n401 = el secreto del server no coincide con el de tu .env.local.\n" +
            "Ojo: cambiar la variable en el hosting no hace efecto hasta redeployar."
          : ""),
    );
  }

  console.log(`✓ Revalidado ${endpoint}`);
  console.log(`  ${text}`);
}

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
