import { defineField, defineType } from "sanity";

/**
 * Ajustes generales: lo que el cliente cambia una vez y no toca más
 * (el número de WhatsApp al que llegan las consultas, el texto que ve Google).
 */
export const settings = defineType({
  name: "settings",
  title: "Ajustes generales",
  type: "document",
  groups: [
    { name: "whatsapp", title: "WhatsApp", default: true },
    { name: "seo", title: "Google / SEO" },
  ],
  fields: [
    defineField({
      name: "whatsapp",
      title: "WhatsApp de ventas",
      type: "object",
      group: "whatsapp",
      fields: [
        defineField({
          name: "phone",
          title: "Número",
          description:
            "Con código de país y sin espacios, + ni guiones. Ej: 5491122334455",
          type: "string",
          validation: (rule) =>
            rule
              .required()
              .regex(/^\d{10,15}$/, {
                name: "solo números",
                invert: false,
              })
              .error("Solo números. Ej: 5491122334455"),
        }),
        defineField({
          name: "message",
          title: "Mensaje precargado",
          description:
            "El texto que aparece ya escrito cuando alguien abre el chat.",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "meta",
      title: "Título y descripción en Google",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "title",
          title: "Título",
          description: "Lo que se ve como titular en los resultados de Google.",
          type: "string",
          validation: (rule) => rule.required().max(70).warning("Más de 70 caracteres se corta en Google."),
        }),
        defineField({
          name: "description",
          title: "Descripción",
          description: "El párrafo gris debajo del título en Google.",
          type: "text",
          rows: 3,
          validation: (rule) =>
            rule.required().max(165).warning("Más de 165 caracteres se corta en Google."),
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Ajustes generales" }),
  },
});
