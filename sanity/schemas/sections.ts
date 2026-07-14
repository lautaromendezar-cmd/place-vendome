import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Un documento por sección del sitio (singletons: existe uno solo de cada uno).
 *
 * REGLA: el nombre de cada campo es idéntico a su clave en SiteContent (lib/types.ts).
 * Gracias a eso, lo que devuelve Sanity se mergea 1:1 sobre content/site.ts y los
 * componentes no cambian. Si agregás un campo acá, usá exactamente el nombre de la clave.
 *
 * Lo estructural (logos, menú, planos, labels de formularios, textos legales) NO está acá
 * a propósito: vive en content/site.ts para que el cliente no pueda romper el diseño.
 */

/** Los 9 íconos de marca disponibles. El cliente elige de la lista, no sube archivos. */
const ICON_OPTIONS = [
  { title: "Parque", value: "/icons/icon-parque.png" },
  { title: "Piscina", value: "/icons/icon-piscina.png" },
  { title: "Piscina cubierta", value: "/icons/icon-piscina-cubierta.png" },
  { title: "Gimnasio", value: "/icons/icon-gimnasio.png" },
  { title: "Yoga", value: "/icons/icon-yoga.png" },
  { title: "Parrilla", value: "/icons/icon-parrilla.png" },
  { title: "Cochera", value: "/icons/icon-cochera.png" },
  { title: "Juegos", value: "/icons/icon-juegos.png" },
  { title: "Laundry", value: "/icons/icon-laundry.png" },
];

/** Campos que se repiten en el encabezado de casi todas las secciones. */
const eyebrow = defineField({
  name: "eyebrow",
  title: "Antetítulo",
  description: "La palabra chica arriba del título. Ej: “Galería”.",
  type: "string",
  validation: (rule) => rule.required(),
});

const headline = defineField({
  name: "headline",
  title: "Título",
  description:
    "Título grande de la sección. Podés cortar el renglón donde quieras: cada Enter es un salto de línea real en el sitio.",
  type: "text",
  rows: 2,
  validation: (rule) => rule.required(),
});

export const heroSection = defineType({
  name: "heroSection",
  title: "Portada",
  type: "document",
  fields: [
    defineField({
      name: "tagline",
      title: "Frase principal",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Ubicación",
      description: "La línea chica en mayúsculas. Ej: “LINIERS · BUENOS AIRES”.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del botón",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "scrollHint",
      title: "Texto de “bajar”",
      description: "La palabra abajo de todo que invita a scrollear. Ej: “Descubrir”.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fallbackImage",
      title: "Foto de portada",
      description:
        "Se ve en celulares y mientras carga el video. El video de fondo no se edita desde acá.",
      type: "picture",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Portada" }) },
});

export const conceptSection = defineType({
  name: "conceptSection",
  title: "Concepto",
  type: "document",
  fields: [
    eyebrow,
    headline,
    defineField({
      name: "paragraphs",
      title: "Párrafos",
      description: "Cada ítem de la lista es un párrafo. Arrastrá para reordenarlos.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "highlight",
      title: "Frase destacada",
      description: "La línea resaltada debajo de los párrafos.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "picture",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Concepto" }) },
});

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Galería",
  type: "document",
  fields: [
    eyebrow,
    headline,
    defineField({
      name: "images",
      title: "Fotos",
      description:
        "Agregá, sacá y arrastrá para reordenar. El orden acá es el orden en el sitio.",
      type: "array",
      of: [defineArrayMember({ type: "picture" })],
      options: { layout: "grid" },
      validation: (rule) => rule.required().min(3),
    }),
  ],
  preview: { prepare: () => ({ title: "Galería" }) },
});

export const amenitiesSection = defineType({
  name: "amenitiesSection",
  title: "Amenities",
  type: "document",
  fields: [
    eyebrow,
    headline,
    defineField({
      name: "showcase",
      title: "Amenities con foto",
      description:
        "La lista donde al pasar el mouse aparece la foto de cada amenity.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "amenityShowcaseItem",
          fields: [
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Ícono",
              type: "string",
              options: { list: ICON_OPTIONS },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Foto",
              type: "picture",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "pending",
              title: "Todavía no hay render real",
              description:
                "Si lo activás, la foto se muestra atenuada con el cartel “Render próximamente”.",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "name", media: "image.asset" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "groups",
      title: "Listado por categoría",
      description:
        "Las columnas de texto: Propietarios, Invitados, Seguridad, Cocheras.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "amenityGroup",
          fields: [
            defineField({
              name: "title",
              title: "Título de la categoría",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Ítems",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare: ({ title, items }) => ({
              title,
              subtitle: `${items?.length ?? 0} ítems`,
            }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Amenities" }) },
});

export const typologiesSection = defineType({
  name: "typologiesSection",
  title: "Tipologías",
  type: "document",
  description: "Los planos no se editan desde acá: son documentación técnica.",
  fields: [
    eyebrow,
    headline,
    defineField({
      name: "stats",
      title: "Datos destacados",
      description: "Los números grandes: unidades, ambientes, m².",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "typologyStat",
          fields: [
            defineField({
              name: "value",
              title: "Número",
              description: "Ej: “44”, “105–226”.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Qué es",
              description: "Ej: “unidades exclusivas”.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),
    defineField({
      name: "features",
      title: "Diferenciales por unidad",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "note",
      title: "Aclaración",
      description: "El texto chico debajo de los planos.",
      type: "text",
      rows: 3,
    }),
  ],
  preview: { prepare: () => ({ title: "Tipologías" }) },
});

export const terminacionesSection = defineType({
  name: "terminacionesSection",
  title: "Terminaciones",
  type: "document",
  fields: [
    eyebrow,
    headline,
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "items",
      title: "Detalles",
      description: "Cada foto de terminación con su título y bajada.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "terminacionItem",
          fields: [
            defineField({
              name: "image",
              title: "Foto",
              type: "picture",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Título",
              description: "Ej: “Aberturas REHAU”.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "note",
              title: "Bajada",
              description: "Ej: “Ventanales de PVC, piso a techo”.",
              type: "string",
            }),
            defineField({
              name: "wide",
              title: "Foto horizontal (a todo lo ancho)",
              description:
                "Activalo solo si la foto es apaisada. Ocupa el ancho completo en vez de entrar en la grilla.",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "note", media: "image.asset" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: "Terminaciones" }) },
});

export const locationSection = defineType({
  name: "locationSection",
  title: "Ubicación",
  type: "document",
  fields: [
    eyebrow,
    headline,
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Párrafos",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mapQuery",
      title: "Dirección para el mapa",
      description:
        "Lo que se busca en Google Maps para centrar el mapa. Si el mapa apunta mal, corregí acá.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "neighborhood",
      title: "Fotos del barrio",
      description: "Las tres fotos con epígrafe.",
      type: "array",
      of: [defineArrayMember({ type: "captionedPicture" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "highlights",
      title: "Bloques destacados",
      description: "Gastronomía, conectividad, etc.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "locationHighlight",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              title: "Texto",
              type: "text",
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "connectivity",
      title: "Accesos y conectividad",
      description: "Avenidas, autopistas, estaciones. Uno por línea.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Ubicación" }) },
});

export const lifestyleSection = defineType({
  name: "lifestyleSection",
  title: "Lifestyle",
  type: "document",
  fields: [
    eyebrow,
    defineField({
      name: "backgroundImage",
      title: "Foto de fondo",
      description: "Se muestra oscurecida detrás del texto.",
      type: "picture",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "statementText",
      title: "Frase",
      description:
        "La frase que se va pintando palabra por palabra al scrollear. Poné *asteriscos* alrededor de las palabras que quieras en itálica. Ej: “el lujo no se *muestra*: se *habita*”.",
      type: "text",
      rows: 5,
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== "string") return true;
          const asterisks = (value.match(/\*/g) ?? []).length;
          return asterisks % 2 === 0
            ? true
            : "Falta cerrar un asterisco: tienen que ir de a pares.";
        }),
    }),
  ],
  preview: { prepare: () => ({ title: "Lifestyle" }) },
});

export const contactSection = defineType({
  name: "contactSection",
  title: "Contacto",
  type: "document",
  description:
    "Los campos del formulario (Nombre, E-mail, etc.) no se editan desde acá.",
  fields: [
    eyebrow,
    headline,
    defineField({
      name: "whatsappNote",
      title: "Texto junto al botón de WhatsApp",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whatsappButton",
      title: "Texto del botón de WhatsApp",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "successMessage",
      title: "Mensaje al enviar el formulario",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "picture",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Contacto" }) },
});

export const catalogSection = defineType({
  name: "catalogSection",
  title: "Catálogo",
  type: "document",
  fields: [
    eyebrow,
    headline,
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del botón",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "PDF del catálogo",
      description:
        "El archivo que se descarga. Subí acá la versión nueva cuando la tengas y se actualiza sola.",
      type: "file",
      options: { accept: ".pdf" },
    }),
  ],
  preview: { prepare: () => ({ title: "Catálogo" }) },
});
