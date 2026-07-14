import { defineField, defineType } from "sanity";

/**
 * Foto editable por el cliente.
 * Se proyecta en GROQ a { src, alt } — el mismo shape que ImageAsset en lib/types.ts,
 * así los componentes no se enteran de que el contenido ahora viene de Sanity.
 */
export const picture = defineType({
  name: "picture",
  title: "Foto",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Descripción de la foto",
      description:
        "Qué se ve en la foto. Lo leen Google y los lectores de pantalla. Ej: “Lobby de acceso con doble altura”.",
      type: "string",
      validation: (rule) => rule.required().min(5),
    }),
  ],
  preview: {
    select: { title: "alt", media: "asset" },
  },
});

/** Foto del barrio: además del alt lleva un epígrafe visible. */
export const captionedPicture = defineType({
  name: "captionedPicture",
  title: "Foto con epígrafe",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Descripción de la foto",
      type: "string",
      validation: (rule) => rule.required().min(5),
    }),
    defineField({
      name: "caption",
      title: "Epígrafe",
      description: "El texto que se ve debajo de la foto en el sitio.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "alt", media: "asset" },
  },
});
