import type { SiteContent } from "@/lib/types";

/**
 * ÚNICA fuente de contenido del sitio.
 * Todo texto, ruta de imagen o lista que se renderiza sale de acá.
 * Al migrar a Sanity, cada objeto de sección se convierte en un documento.
 *
 * Los valores entre [corchetes] son placeholders pendientes de dato real.
 */
export const site: SiteContent = {
  brand: {
    name: "Place Vendôme",
    logoGold: "/brand/logo-gold.png",
    logoIvory: "/brand/logo-ivory.png",
    logoDark: "/brand/logo-dark.png",
    crestGold: "/brand/crest-gold.png",
    crestIvory: "/brand/crest-ivory.png",
  },

  meta: {
    title: "Place Vendôme — Liniers, Buenos Aires",
    description:
      "Dos edificios de categoría en el nuevo polo premium de Liniers. Amenities de primer nivel, diseño contemporáneo y una ubicación con conectividad total. Un Sueño. Una Vida. Un Futuro. Un Legado.",
  },

  nav: [
    { label: "Concepto", anchor: "concepto" },
    { label: "Galería", anchor: "galeria" },
    { label: "Amenities", anchor: "amenities" },
    { label: "Ubicación", anchor: "ubicacion" },
    { label: "Lifestyle", anchor: "lifestyle" },
    { label: "Contacto", anchor: "contacto" },
    { label: "Catálogo", anchor: "catalogo" },
  ],

  whatsapp: {
    // TODO: reemplazar por el número real de ventas
    phone: "5491100000000",
    message:
      "Hola, quiero recibir más información sobre Place Vendôme en Liniers.",
    ariaLabel: "Escribinos por WhatsApp",
  },

  hero: {
    videoSrc: "/videos/render-360.mp4",
    fallbackImage: {
      src: "/images/exteriores/fachada-frente.jpg",
      alt: "Fachada de los dos edificios de Place Vendôme al atardecer",
    },
    tagline: "Un Sueño. Una Vida. Un Futuro. Un Legado.",
    location: "LINIERS · BUENOS AIRES",
    ctaLabel: "Consultanos por WhatsApp",
    scrollHint: "Descubrir",
  },

  concept: {
    eyebrow: "El proyecto",
    headline: "Hay direcciones que se eligen.\nY otras que se heredan.",
    paragraphs: [
      "Place Vendôme son dos edificios concebidos bajo un mismo estándar: el máximo. Arquitectura contemporánea de líneas escultóricas, terrazas verdes y unidades pensadas para quienes entienden que el verdadero lujo es la manera de vivir todos los días.",
      "En el corazón de un barrio en plena reconversión hacia el segmento premium, Place Vendôme es un oasis urbano: puertas adentro, calma, verde y servicios de categoría. Puertas afuera, la ciudad entera al alcance.",
      "Formar parte no es para todos. Es para quienes llegan primero.",
    ],
    highlight: "Dos edificios. Un mismo estándar: el máximo.",
    image: {
      src: "/images/exteriores/vista-aerea.jpg",
      alt: "Vista aérea de Place Vendôme y su entorno en Liniers",
    },
  },

  gallery: {
    eyebrow: "Galería",
    headline: "Cada detalle, a la altura de quien lo habita.",
    images: [
      {
        src: "/images/exteriores/fachada-frente.jpg",
        alt: "Fachada de Place Vendôme desde la vereda",
      },
      {
        src: "/images/interiores/lobby.jpg",
        alt: "Lobby de acceso con doble altura",
      },
      {
        src: "/images/interiores/living-1.jpg",
        alt: "Living comedor con ventanales de piso a techo",
      },
      {
        src: "/images/interiores/cocina-1.jpg",
        alt: "Cocina integrada con isla",
      },
      {
        src: "/images/interiores/comedor-1.jpg",
        alt: "Comedor con vista abierta",
      },
      {
        src: "/images/interiores/dormitorio-1.jpg",
        alt: "Dormitorio principal en suite",
      },
      {
        src: "/images/interiores/bano-1.jpg",
        alt: "Baño principal con terminaciones premium",
      },
      {
        src: "/images/exteriores/piscina-terraza-2.jpg",
        alt: "Piscina en la terraza al atardecer",
      },
      {
        src: "/images/interiores/ingreso-1.jpg",
        alt: "Ingreso peatonal al edificio",
      },
      {
        src: "/images/exteriores/isometrica-3.jpg",
        alt: "Vista isométrica del conjunto",
      },
    ],
  },

  amenities: {
    eyebrow: "Amenities",
    headline: "Todo lo que hace a una vida mejor,\nsin salir de casa.",
    icons: [
      { icon: "/icons/icon-parque.png", label: "Parque con zonas de recreo y descanso" },
      { icon: "/icons/icon-piscina.png", label: "Piscina descubierta con solárium" },
      { icon: "/icons/icon-piscina-cubierta.png", label: "Piscina cubierta" },
      { icon: "/icons/icon-gimnasio.png", label: "Gimnasio equipado" },
      { icon: "/icons/icon-yoga.png", label: "Espacio de yoga y stretching" },
      { icon: "/icons/icon-juegos.png", label: "Sala de juegos" },
      { icon: "/icons/icon-parrilla.png", label: "Parrillas y pérgolas" },
      { icon: "/icons/icon-laundry.png", label: "Laundry" },
      { icon: "/icons/icon-cochera.png", label: "Cocheras cubiertas" },
    ],
    groups: [
      {
        title: "Amenities exclusivas para Propietarios",
        items: [
          "Piscina cubierta",
          "Gimnasio equipado",
          "Espacio de yoga y stretching",
          "Laundry",
        ],
      },
      {
        title: "Amenities para Propietarios e Invitados",
        items: [
          "Parque con zonas de recreo y descanso",
          "Piscina descubierta con solárium",
          "Parrillas y pérgolas",
          "Sala de juegos",
        ],
      },
      {
        title: "Seguridad y Servicios generales",
        items: [
          "Cocheras cubiertas",
          "[Detalle de seguridad y servicios a completar según brochure]",
        ],
      },
    ],
  },

  location: {
    eyebrow: "Ubicación",
    headline: "El barrio que viene,\nen la ciudad de siempre.",
    paragraphs: [
      "Liniers vive su reconversión: nuevos desarrollos, nuevas propuestas y un perfil de barrio que se orienta al segmento premium. Place Vendôme se anticipa a ese movimiento y se instala donde el valor está por venir.",
      "Un oasis urbano con conectividad total: avenidas troncales, accesos rápidos al centro y a zona oeste, y a minutos de los polos gastronómicos de la ciudad y de Puerto Madero.",
    ],
    mapImage: {
      src: "/images/mapa-liniers.jpg",
      alt: "Mapa de Liniers y Villa Luro con la ubicación de Place Vendôme",
    },
    connectivity: [
      "Av. General Paz",
      "Au. Perito Moreno",
      "Av. Rivadavia",
      "Av. Juan B. Justo",
      "Estación Liniers",
    ],
    address: "Av. Larrazábal, Liniers, Ciudad de Buenos Aires",
  },

  lifestyle: {
    eyebrow: "Lifestyle",
    headline: "Una manera de vivir.",
    images: [
      { src: "/images/amenities/solarium-1.jpg", alt: "Solárium con reposeras junto a la piscina" },
      { src: "/images/amenities/piscina-2.jpg", alt: "Piscina descubierta rodeada de verde" },
      { src: "/images/amenities/gimnasio-1.jpg", alt: "Gimnasio con equipamiento de última generación" },
      { src: "/images/amenities/pergola-1.jpg", alt: "Pérgola con espacios de estar al aire libre" },
      { src: "/images/amenities/yoga.jpg", alt: "Espacio de yoga y relajación" },
      { src: "/images/amenities/parque.jpg", alt: "Parque central con paisajismo de diseño" },
    ],
  },

  contact: {
    eyebrow: "Contacto",
    headline: "¿Te interesaría recibir mayor información o coordinar una visita?",
    fields: {
      name: "Nombre completo",
      whatsapp: "WhatsApp (+549...)",
      email: "E-mail",
      bedrooms: {
        label: "Dormitorios",
        options: ["2 dormitorios", "3 dormitorios", "Otro"],
      },
      message: "Mensaje",
    },
    submitLabel: "Enviar",
    successMessage: "Gracias. Un asesor se va a contactar a la brevedad.",
    whatsappCta: "O escribinos directo por WhatsApp",
    image: {
      src: "/images/exteriores/piscina-terraza-1.jpg",
      alt: "Terraza con piscina de Place Vendôme al atardecer",
    },
  },

  catalog: {
    eyebrow: "Catálogo",
    headline: "El proyecto completo, en detalle.",
    description:
      "Plantas, tipologías, amenities y terminaciones. Dejanos tus datos y descargá el catálogo completo de Place Vendôme.",
    ctaLabel: "Descargar el catálogo",
    modal: {
      title: "Descargá el catálogo completo",
      nameLabel: "Nombre",
      phoneLabel: "Celular",
      submitLabel: "Descargar",
      successMessage: "Listo. La descarga comienza automáticamente.",
    },
    fileUrl: "/docs/catalogo-place-vendome.pdf",
  },

  footer: {
    location: "Liniers · Buenos Aires · Argentina",
    legal:
      "Las imágenes, renders y textos son de carácter ilustrativo y no constituyen oferta. [Datos legales del desarrollador a completar]",
    credit: "Place Vendôme © 2026",
  },
};
