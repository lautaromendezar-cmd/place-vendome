import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { SITE_CONTENT_TAG } from "@/lib/sanity/content";

/**
 * Sanity llama a esta ruta cada vez que el cliente publica un cambio.
 * Tira el caché del contenido y el sitio se regenera con lo nuevo en segundos.
 *
 * Se configura una sola vez en sanity.io/manage → API → Webhooks, apuntando a
 * https://<dominio>/api/revalidate con el mismo secreto de SANITY_REVALIDATE_SECRET.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return new NextResponse(
      "Falta SANITY_REVALIDATE_SECRET en el entorno.",
      { status: 500 },
    );
  }

  try {
    const { isValidSignature } = await parseBody<{ _type: string }>(
      request,
      secret,
    );

    // Sin firma válida, el request no viene de Sanity.
    if (!isValidSignature) {
      return new NextResponse("Firma inválida.", { status: 401 });
    }

    revalidateTag(SITE_CONTENT_TAG);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("[revalidate] Falló el webhook de Sanity", error);
    return new NextResponse("Error procesando el webhook.", { status: 500 });
  }
}
