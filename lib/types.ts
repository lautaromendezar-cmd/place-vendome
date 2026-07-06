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

export interface AmenityShowcaseItem {
  icon: string;
  name: string;
  image: ImageAsset;
}

export interface AmenityGroup {
  title: string;
  items: string[];
}

export interface AmenitiesContent {
  eyebrow: string;
  headline: string;
  /** Lista interactiva: al hover se revela la foto de cada amenity */
  showcase: AmenityShowcaseItem[];
  /** Desglose de acceso (propietarios / invitados / seguridad) */
  groups: AmenityGroup[];
}

export interface TypologyUnit {
  label: string;
  subtitle: string;
  detail: string;
  plan: ImageAsset;
}

export interface TypologyBuilding {
  id: string;
  name: string;
  units: TypologyUnit[];
}

export interface TypologiesContent {
  eyebrow: string;
  headline: string;
  note: string;
  zoomHint: string;
  buildings: TypologyBuilding[];
}

export interface NeighborhoodPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface LocationHighlight {
  title: string;
  text: string;
}

export interface LocationContent {
  eyebrow: string;
  headline: string;
  intro: string;
  paragraphs: string[];
  mapImage: ImageAsset;
  /** Fotos del barrio (bares, gastronomía, vida de zona) del brochure */
  neighborhood: NeighborhoodPhoto[];
  /** Bloques cortos destacados (gastronomía, conectividad, etc.) */
  highlights: LocationHighlight[];
  /** Puntos de conectividad (avenidas, accesos, polos) */
  connectivity: string[];
  address: string;
}

export interface StatementSegment {
  text: string;
  /** true = palabra/frase en itálica (acento) */
  em?: boolean;
}

export interface LifestyleContent {
  eyebrow: string;
  /** Imagen de fondo (oscurecida) detrás del statement */
  backgroundImage: ImageAsset;
  /** Statement que se "pinta" palabra por palabra al scrollear */
  statement: StatementSegment[];
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
  typologies: TypologiesContent;
  location: LocationContent;
  lifestyle: LifestyleContent;
  contact: ContactContent;
  catalog: CatalogContent;
  footer: FooterContent;
}
