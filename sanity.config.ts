"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { SINGLETON_TYPES, schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const singletons = new Set<string>(SINGLETON_TYPES);

export default defineConfig({
  name: "place-vendome",
  title: "Place Vendôme",
  basePath: "/studio",
  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    // Consola de consultas GROQ: útil para nosotros, invisible para el cliente
    // porque el rol "editor" no tiene acceso a esta herramienta.
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
    // Ningún documento de sección aparece en el botón "crear": ya existen todos.
    templates: (prev) => prev.filter((t) => !singletons.has(t.schemaType)),
  },

  document: {
    // Las secciones no se crean, ni se duplican, ni se borran: solo se editan.
    actions: (prev, { schemaType }) =>
      singletons.has(schemaType)
        ? prev.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action ?? ""),
          )
        : prev,
  },
});
