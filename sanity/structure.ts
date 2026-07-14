import type { StructureResolver } from "sanity/structure";

/**
 * El menú del panel, en el mismo orden en que las secciones aparecen en el sitio.
 * Cada ítem abre directamente el formulario de esa sección: el cliente no ve
 * listas de documentos ni botones de "crear" / "borrar".
 */

type Item = { id: string; type: string; title: string };

const ITEMS: Item[] = [
  { id: "hero", type: "heroSection", title: "Portada" },
  { id: "concept", type: "conceptSection", title: "Concepto" },
  { id: "gallery", type: "gallerySection", title: "Galería" },
  { id: "amenities", type: "amenitiesSection", title: "Amenities" },
  { id: "typologies", type: "typologiesSection", title: "Tipologías" },
  { id: "terminaciones", type: "terminacionesSection", title: "Terminaciones" },
  { id: "lifestyle", type: "lifestyleSection", title: "Lifestyle" },
  { id: "location", type: "locationSection", title: "Ubicación" },
  { id: "contact", type: "contactSection", title: "Contacto" },
  { id: "catalog", type: "catalogSection", title: "Catálogo" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Place Vendôme")
    .items([
      ...ITEMS.map((item) =>
        S.listItem()
          .id(item.id)
          .title(item.title)
          .child(
            S.document()
              .schemaType(item.type)
              .documentId(item.id)
              .title(item.title),
          ),
      ),
      S.divider(),
      S.listItem()
        .id("settings")
        .title("Ajustes generales")
        .child(
          S.document()
            .schemaType("settings")
            .documentId("settings")
            .title("Ajustes generales"),
        ),
    ]);
