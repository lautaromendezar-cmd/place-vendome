import type { SchemaTypeDefinition } from "sanity";

import { captionedPicture, picture } from "./objects";
import { settings } from "./settings";
import {
  amenitiesSection,
  catalogSection,
  conceptSection,
  contactSection,
  gallerySection,
  heroSection,
  lifestyleSection,
  locationSection,
  terminacionesSection,
  typologiesSection,
} from "./sections";

/** Los tipos de documento que son singletons: existe exactamente uno de cada uno. */
export const SINGLETON_TYPES = [
  "settings",
  "heroSection",
  "conceptSection",
  "gallerySection",
  "amenitiesSection",
  "typologiesSection",
  "terminacionesSection",
  "lifestyleSection",
  "locationSection",
  "contactSection",
  "catalogSection",
] as const;

export type SingletonType = (typeof SINGLETON_TYPES)[number];

export const schemaTypes: SchemaTypeDefinition[] = [
  picture,
  captionedPicture,
  settings,
  heroSection,
  conceptSection,
  gallerySection,
  amenitiesSection,
  typologiesSection,
  terminacionesSection,
  lifestyleSection,
  locationSection,
  contactSection,
  catalogSection,
];
