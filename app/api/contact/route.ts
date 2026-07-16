import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Recibe los dos formularios del sitio (consulta de Contacto y pedido del
 * Catálogo) y los manda por mail a la casilla del emprendimiento usando el
 * SMTP de Hostinger — la misma casilla envía y recibe, sin servicios de
 * terceros.
 *
 * Variables de entorno (en hPanel → Environment Variables y en .env.local):
 *   SMTP_HOST  smtp.hostinger.com
 *   SMTP_PORT  465
 *   SMTP_USER  contacto@placevendome.com.ar
 *   SMTP_PASS  la contraseña de esa casilla
 */

interface ContactPayload {
  tipo?: "consulta" | "catalogo";
  nombre?: string;
  email?: string;
  celular?: string;
  dormitorios?: string;
  mensaje?: string;
  /** Honeypot: los humanos no lo ven; si viene con algo, es un bot. */
  website?: string;
}

/** Corta cualquier campo a un largo razonable: nadie consulta en 2000 chars. */
function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[contact] Faltan variables SMTP en el entorno.");
    return new NextResponse("Servicio de correo no configurado.", {
      status: 500,
    });
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse("Cuerpo inválido.", { status: 400 });
  }

  // Bot que completó el campo invisible: se le responde OK y no se manda nada.
  if (clean(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const tipo = payload.tipo === "catalogo" ? "catalogo" : "consulta";
  const nombre = clean(payload.nombre, 120);
  const email = clean(payload.email, 200);
  const celular = clean(payload.celular, 40);
  const dormitorios = clean(payload.dormitorios, 40);
  const mensaje = clean(payload.mensaje, 2000);

  if (!nombre || (tipo === "consulta" ? !email || !mensaje : !celular)) {
    return new NextResponse("Faltan datos del formulario.", { status: 400 });
  }

  const subject =
    tipo === "catalogo"
      ? `Descarga de catálogo — ${nombre}`
      : `Consulta desde la web — ${nombre}`;

  const lines =
    tipo === "catalogo"
      ? [
          "Alguien descargó el catálogo desde el sitio.",
          "",
          `Nombre:  ${nombre}`,
          `Celular: ${celular}`,
        ]
      : [
          "Nueva consulta desde el formulario de contacto del sitio.",
          "",
          `Nombre:       ${nombre}`,
          `E-mail:       ${email}`,
          `Dormitorios:  ${dormitorios || "-"}`,
          "",
          "Mensaje:",
          mensaje,
        ];

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: Number(SMTP_PORT ?? 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"Sitio Place Vendôme" <${SMTP_USER}>`,
      to: SMTP_USER,
      // Responder desde la casilla le contesta directo al interesado.
      replyTo: email || undefined,
      subject,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("[contact] No se pudo enviar el mail", error);
    return new NextResponse("No se pudo enviar el mensaje.", { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
