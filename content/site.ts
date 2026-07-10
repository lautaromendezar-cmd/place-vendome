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
    crestMono: "/brand/crest-mono-ivory.png",
  },

  meta: {
    title: "Place Vendôme — Liniers, Buenos Aires",
    description:
      "Dos edificios de categoría en el nuevo polo premium de Liniers. Un privilegio reservado: amenities de primer nivel, diseño contemporáneo y conectividad total. Un Sueño. Una Vida. Un Futuro. Un Legado.",
  },

  nav: [
    { label: "Concepto", anchor: "concepto" },
    { label: "Galería", anchor: "galeria" },
    { label: "Amenities", anchor: "amenities" },
    { label: "Tipologías", anchor: "tipologias" },
    { label: "Lifestyle", anchor: "lifestyle" },
    { label: "Ubicación", anchor: "ubicacion" },
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
      src: "/images/exteriores/vista-aerea.webp",
      alt: "Vista aérea de los dos edificios de Place Vendôme en Liniers",
    },
    tagline: "Un Sueño. Una Vida. Un Futuro. Un Legado.",
    location: "LINIERS · BUENOS AIRES",
    ctaLabel: "Consultanos por WhatsApp",
    scrollHint: "Descubrir",
  },

  concept: {
    eyebrow: "El proyecto",
    headline: "Una dirección que no se elige:\nse hereda.",
    paragraphs: [
      "Sobre un terreno de dimensiones extraordinarias —de los que apenas quedan un puñado en la Ciudad— se elevan dos edificios hermanos y una tercera estructura dedicada por entero a los amenities, separados por espacios verdes. Líneas escultóricas y unidades pensadas para quienes entienden que el verdadero lujo es la manera de vivir todos los días.",
      "En el corazón de un barrio en plena reconversión hacia el segmento premium, Place Vendôme es un oasis urbano: puertas adentro, calma, verde y servicios de categoría. Puertas afuera, la ciudad entera al alcance.",
      "Apenas 44 unidades. Formar parte no es para todos: es para quienes llegan primero.",
    ],
    highlight: "Un privilegio reservado para quienes buscan el máximo estándar.",
    image: {
      src: "/images/exteriores/fachada-frente.webp",
      alt: "Fachada de los dos edificios de Place Vendôme",
    },
  },

  gallery: {
    eyebrow: "Galería",
    headline: "Cada detalle, a la altura de quien lo habita.",
    images: [
      {
        src: "/images/exteriores/fachada-frente.webp",
        alt: "Fachada de Place Vendôme desde la vereda",
      },
      {
        src: "/images/interiores/lobby.webp",
        alt: "Lobby de acceso con doble altura",
      },
      {
        src: "/images/interiores/living-1.webp",
        alt: "Living comedor con ventanales de piso a techo",
      },
      {
        src: "/images/interiores/cocina-1.webp",
        alt: "Cocina integrada con isla",
      },
      {
        src: "/images/interiores/comedor-1.webp",
        alt: "Comedor con vista abierta",
      },
      {
        src: "/images/interiores/dormitorio-1.webp",
        alt: "Dormitorio principal en suite",
      },
      {
        src: "/images/interiores/bano-1.webp",
        alt: "Baño principal con terminaciones premium",
      },
      {
        src: "/images/exteriores/piscina-terraza-2.webp",
        alt: "Piscina en la terraza al atardecer",
      },
      {
        src: "/images/interiores/ingreso-1.webp",
        alt: "Ingreso peatonal al edificio",
      },
      {
        src: "/images/exteriores/isometrica-3.webp",
        alt: "Vista isométrica del conjunto",
      },
    ],
  },

  amenities: {
    eyebrow: "Amenities",
    headline: "Todo lo que hace a una vida mejor,\nsin salir de casa.",
    showcase: [
      {
        icon: "/icons/icon-parque.png",
        name: "Parque con zonas de recreo",
        image: {
          src: "/images/amenities/parque.webp",
          alt: "Parque central con paisajismo de diseño",
        },
      },
      {
        icon: "/icons/icon-piscina.png",
        name: "Piscina descubierta y solárium",
        image: {
          src: "/images/amenities/piscina-2.webp",
          alt: "Piscina descubierta rodeada de verde",
        },
      },
      {
        icon: "/icons/icon-piscina-cubierta.png",
        name: "Piscina semicubierta e hidromasaje",
        image: {
          src: "/images/amenities/piscina-cubierta-1.webp",
          alt: "Piscina semicubierta con sector de hidromasaje",
        },
      },
      {
        icon: "/icons/icon-gimnasio.png",
        name: "Gimnasio equipado",
        image: {
          src: "/images/amenities/gimnasio-1.webp",
          alt: "Gimnasio con equipamiento de última generación",
        },
      },
      {
        icon: "/icons/icon-yoga.png",
        name: "Yoga y stretching",
        image: {
          src: "/images/amenities/yoga.webp",
          alt: "Espacio de yoga y relajación",
        },
      },
      {
        icon: "/icons/icon-parrilla.png",
        name: "Parrillas y pérgolas",
        image: {
          src: "/images/amenities/pergola-1.webp",
          alt: "Pérgola con parrillas y espacios de estar",
        },
      },
      {
        icon: "/icons/icon-cochera.png",
        name: "Cocheras cubiertas",
        image: {
          src: "/images/amenities/cochera-1.webp",
          alt: "Cocheras cubiertas del edificio",
        },
      },
    ],
    groups: [
      {
        title: "Exclusivas para Propietarios",
        items: [
          "Espacios parquizados con paisajismo y sectores de recreación y descanso",
          "Piscina descubierta con solárium",
          "Piscina semicubierta con hidromasaje",
          "Vestuarios",
          "Sector de juegos infantiles",
          "Parrillas y mesas",
          "Gimnasio cubierto",
          "Coworking",
          "Laundry",
          "Palier privado en cada unidad",
        ],
      },
      {
        title: "Para Propietarios e Invitados",
        items: [
          "Sector de recreación en 1° piso, con reserva previa (acceso por calle Ercilla)",
          "Estacionamiento de cortesía para invitados (acceso por Av. Larrazábal)",
          "Estacionamiento de cortesía en edificio (acceso por calle Ercilla)",
        ],
      },
      {
        title: "Seguridad y Servicios",
        items: [
          "Control de acceso con puesto de seguridad permanente",
          "Portones vehiculares automáticos monitoreados por cámara",
          "Cámaras de seguridad e intercomunicadores",
          "Grupo electrógeno de respaldo (ascensor, iluminación y seguridad)",
          "Ascensor de mudanzas en cada edificio",
          "Toilettes de cortesía en subsuelo y planta baja",
          "Gestión de residuos con montacarga exclusivo",
        ],
      },
      {
        title: "Cocheras y Bauleras",
        items: [
          "Cocheras cubiertas en subsuelo",
          "Baulera propia para cada unidad",
          "Cocheras de cortesía en planta baja (acceso por Av. Larrazábal)",
          "Cocheras de cortesía para salón de usos múltiples (acceso por calle Ercilla)",
        ],
      },
    ],
  },

  typologies: {
    eyebrow: "Tipologías",
    headline: "Plantas pensadas\npara vivirlas.",
    stats: [
      { value: "44", label: "unidades exclusivas" },
      { value: "3 y 4", label: "ambientes" },
      { value: "105–226", label: "m² por unidad" },
    ],
    features: [
      "Cochera cubierta propia y baulera",
      "Palier privado de ingreso",
      "Ventanales de vista corrida",
    ],
    note: "Estas son las unidades de planta baja, con jardín y expansión propia. El catálogo completo incluye todas las plantas por piso y tipología.",
    zoomHint: "Ampliar plano",
    buildings: [
      {
        id: "e1",
        name: "Edificio 1",
        units: [
          {
            label: "Depto A",
            subtitle: "Planta Baja",
            detail: "Jardín y expansión propia · Frente a Av. Larrazábal",
            plan: {
              src: "/planos/e1-pb-depto-a.png",
              alt: "Planta del Depto A de planta baja, Edificio 1",
            },
          },
          {
            label: "Depto B",
            subtitle: "Planta Baja",
            detail: "Jardín y expansión propia · Contrafrente",
            plan: {
              src: "/planos/e1-pb-depto-b.png",
              alt: "Planta del Depto B de planta baja, Edificio 1",
            },
          },
        ],
      },
      {
        id: "e2",
        name: "Edificio 2",
        units: [
          {
            label: "Depto A",
            subtitle: "Planta Baja",
            detail: "Jardín y expansión propia · Frente a Av. Larrazábal",
            plan: {
              src: "/planos/e2-pb-depto-a.png",
              alt: "Planta del Depto A de planta baja, Edificio 2",
            },
          },
          {
            label: "Depto B",
            subtitle: "Planta Baja",
            detail: "Jardín y expansión propia · Esquina Ercilla",
            plan: {
              src: "/planos/e2-pb-depto-b.png",
              alt: "Planta del Depto B de planta baja, Edificio 2",
            },
          },
        ],
      },
    ],
  },

  location: {
    eyebrow: "Ubicación",
    headline: "Calles con historias,\nsabores y sensaciones.",
    intro:
      "Place Vendôme llega para impulsar una zona que gana prestigio por su mezcla única de tradición, historia y futuro en pleno desarrollo. Un área rica en identidad, con una personalidad destinada a trascender.",
    paragraphs: [
      "A pocas cuadras, el polo gastronómico de Emilio Castro —uno de los más vibrantes de la ciudad— y las parrillas que, según los que saben, sirven las mejores carnes del país.",
      "Y si lo preferís, en pocos minutos estás cenando en Puerto Madero gracias a la cercanía de las autopistas. Una vida a un mensaje de distancia de todo.",
    ],
    mapImage: {
      src: "/images/mapa-liniers.webp",
      alt: "Mapa de Liniers y Villa Luro con la ubicación de Place Vendôme",
    },
    neighborhood: [
      {
        src: "/images/barrio/encuentros.webp",
        alt: "Encuentro con amigos en un bar del barrio",
        caption: "Encuentros a la vuelta de casa",
      },
      {
        src: "/images/barrio/cafe.webp",
        alt: "Café de barrio con identidad propia",
        caption: "Cafés y bares con identidad",
      },
      {
        src: "/images/barrio/barrio.webp",
        alt: "Recorriendo el barrio en bicicleta al atardecer",
        caption: "Un barrio para recorrer",
      },
    ],
    highlights: [
      {
        title: "Gastronomía",
        text: "El polo de Emilio Castro y las mejores parrillas, a pocas cuadras.",
      },
      {
        title: "Conectividad",
        text: "Avenidas y accesos a todos los puntos de la ciudad, sus alrededores y aeropuertos.",
      },
      {
        title: "Puerto Madero",
        text: "A pocos minutos por autopista, cuando la ocasión lo pide.",
      },
    ],
    connectivity: [
      "Av. General Paz",
      "Au. Perito Moreno",
      "Av. Emilio Castro",
      "Av. Rivadavia",
      "Estación Liniers",
    ],
    address: "Av. Larrazábal, Liniers, Ciudad de Buenos Aires",
  },

  lifestyle: {
    eyebrow: "Lifestyle",
    backgroundImage: {
      src: "/images/amenities/solarium-1.webp",
      alt: "Solárium y piscina de Place Vendôme al atardecer",
    },
    statement: [
      { text: "Una manera de vivir donde cada día " },
      { text: "se elige", em: true },
      { text: ". Mañanas de pileta y sol, tardes de parque y encuentro, noches a pasos de los mejores " },
      { text: "sabores", em: true },
      { text: " de la ciudad. En Place Vendôme, el lujo no se " },
      { text: "muestra", em: true },
      { text: ": se " },
      { text: "habita", em: true },
      { text: "." },
    ],
  },

  contact: {
    eyebrow: "Contacto",
    headline: "Coordiná tu visita en un mensaje.",
    whatsappNote: "Te respondemos al instante, directo con un asesor.",
    whatsappButton: "Consultanos por WhatsApp",
    altToggle: "Prefiero dejar mis datos y que me contacten",
    fields: {
      name: "Nombre completo",
      email: "E-mail",
      bedrooms: {
        label: "Dormitorios",
        options: ["2 dormitorios", "3 dormitorios", "Otro"],
      },
      message: "Mensaje",
    },
    submitLabel: "Enviar",
    successMessage: "Gracias. Un asesor se va a contactar a la brevedad.",
    image: {
      src: "/images/exteriores/piscina-terraza-1.webp",
      alt: "Terraza con piscina de Place Vendôme al atardecer",
    },
  },

  catalog: {
    eyebrow: "Catálogo",
    headline: "El proyecto completo, en detalle.",
    description:
      "Plantas, tipologías, amenities y terminaciones. Dejanos tus datos y accedé al catálogo completo de Place Vendôme.",
    ctaLabel: "Acceder al catálogo",
    modal: {
      title: "Accedé al catálogo completo",
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
