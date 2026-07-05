/**
 * Schema de la capa de contenido.
 * Cada sección de la página es un objeto independiente, pensado para
 * mapear 1:1 a documentos/campos de un CMS (Sanity) más adelante.
 */

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface NavLink {
  label: string;
  /** id de la sección ancla, sin "#" */
  anchor: string;
}

export interface Brand {
  name: string;
  /** Lockup completo (cresta + wordmark) en dorado, fondo transparente */
  logoGold: string;
  /** Lockup completo en marfil */
  logoIvory: string;
  /** Lockup completo en negro (para fondos crema) */
  logoDark: string;
  /** Cresta "PV" sola, dorada */
  crestGold: string;
  /** Cresta "PV" sola, marfil */
  crestIvory: string;
}

export interface WhatsAppConfig {
  /** Número en formato internacional sin "+" ni espacios */
  phone: string;
  /** Mensaje precargado al abrir el chat */
  message: string;
  ariaLabel: string;
}

export interface HeroContent {
  /** Video de fondo (solo desktop) */
  videoSrc: string;
  /** Imagen estática: póster del video y fondo en mobile */
  fallbackImage: ImageAsset;
  tagline: string;
  location: string;
  /** CTA principal del hero (abre WhatsApp) */
  ctaLabel: string;
  scrollHint: string;
}

export interface ConceptContent {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  /** Dato destacado bajo el copy (ej: "Dos edificios. Un mismo estándar.") */
  highlight: string;
  image: ImageAsset;
}

export interface GalleryContent {
  eyebrow: string;
  headline: string;
  images: ImageAsset[];
}

export interface AmenityIcon {
  icon: string;
  label: string;
}

export interface AmenityGroup {
  title: string;
  items: string[];
  image: ImageAsset;
}

export interface AmenitiesContent {
  eyebrow: string;
  headline: string;
  icons: AmenityIcon[];
  groups: AmenityGroup[];
}

export interface LocationContent {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  mapImage: ImageAsset;
  /** Puntos de conectividad (avenidas, accesos, polos) */
  connectivity: string[];
  address: string;
}

export interface LifestyleContent {
  eyebrow: string;
  headline: string;
  images: ImageAsset[];
}

export interface SelectField {
  label: string;
  options: string[];
}

export interface ContactContent {
  eyebrow: string;
  headline: string;
  /** Copy que acompaña al CTA principal de WhatsApp */
  whatsappNote: string;
  /** Label del botón principal (abre WhatsApp) */
  whatsappButton: string;
  /** Texto del toggle que revela el formulario de mail (opción secundaria) */
  altToggle: string;
  fields: {
    name: string;
    email: string;
    bedrooms: SelectField;
    message: string;
  };
  submitLabel: string;
  successMessage: string;
  image: ImageAsset;
}

export interface CatalogContent {
  eyebrow: string;
  headline: string;
  description: string;
  ctaLabel: string;
  modal: {
    title: string;
    nameLabel: string;
    phoneLabel: string;
    submitLabel: string;
    successMessage: string;
  };
  /** Ruta del PDF que se entrega al enviar el formulario */
  fileUrl: string;
}

export interface FooterContent {
  location: string;
  legal: string;
  credit: string;
}

export interface SiteContent {
  brand: Brand;
  meta: {
    title: string;
    description: string;
  };
  nav: NavLink[];
  whatsapp: WhatsAppConfig;
  hero: HeroContent;
  concept: ConceptContent;
  gallery: GalleryContent;
  amenities: AmenitiesContent;
  location: LocationContent;
  lifestyle: LifestyleContent;
  contact: ContactContent;
  catalog: CatalogContent;
  footer: FooterContent;
}
