/**
 * Elige Bien — single source of truth for all copy, narrative, and CTAs.
 *
 * Positioning: standalone career-discovery product made BY Isthmus Arquitectura.
 * Isthmus appears as author in footer/fine print, not as the headline brand.
 *
 * Tone: "profesor joven" — chill, intelligent, no slang, no anxiety words.
 * Spanish: LATAM neutral tuteo. NEVER use vos/tenés/sabés. NEVER use the words
 * "carrera", "superpoder", "potencial oculto", "crack", "genio" (see CLAUDE.md).
 */

export const EXPERIENCE = {
  // ──────────────────────────────────────────────────────────
  // BRAND
  // ──────────────────────────────────────────────────────────
  brand: {
    name: "Elige Bien",
    domain: "eligebien.co",
    tagline: "Descubre cómo piensas.",
    // Short slogan for TV and printed collateral — must read from 3m.
    shortSlogan: "Tu cerebro tiene un tipo.",
    author: "Hecho por Isthmus Arquitectura",
    authorLocation: "Chihuahua, México",
  },

  // ──────────────────────────────────────────────────────────
  // MANIFESTO — the narrative wrapper that makes this feel like a product
  // ──────────────────────────────────────────────────────────
  manifesto: {
    // Full version — phone landing page
    full: "Creemos que tu forma de pensar es el primer plano de lo que vas a estudiar. Por eso hicimos Elige Bien: dos pruebas cortas, gratis, sin rollos. En 5 minutos vas a entender cómo funciona tu cabeza y qué tipo de arquitecto (o humano) serías.",
    // Short version — above-the-fold hook
    short:
      "Dos pruebas. Cinco minutos. Gratis. Descubre qué dice de ti tu forma de pensar.",
    // Ultra-short — for TV slides or stickers
    ultrashort: "Descubre cómo piensas.",
  },

  // ──────────────────────────────────────────────────────────
  // LANDING PAGE — eligebien.co/
  // ──────────────────────────────────────────────────────────
  landing: {
    // Layer 1: above the fold
    hook: {
      eyebrow: "ELIGE BIEN",
      headline: "¿Qué dice de ti tu forma de pensar?",
      subheadline: "Dos pruebas. Cinco minutos. Gratis.",
      primaryCta: "Empezar ahora",
    },
    // Layer 2: trust strip (3 pieces of context, horizontally)
    trust: [
      { label: "Autor", value: "Isthmus Arquitectura" },
      { label: "Ciudad", value: "Chihuahua, México" },
      { label: "Tiempo", value: "5 minutos · gratis" },
    ],
    // Layer 3: what you'll get
    whatYouGet: {
      title: "Qué vas a descubrir",
      items: [
        {
          icon: "mind",
          title: "Cómo funciona tu cabeza",
          body: "5 ejes de pensamiento. Uno es el tuyo.",
        },
        {
          icon: "architect",
          title: "Qué tipo de arquitecto serías",
          body: "4 perfiles. El tuyo te va a sorprender.",
        },
        {
          icon: "share",
          title: "Un perfil que puedes compartir",
          body: "Mándalo a tus amigos. Compáralo con el de ellos.",
        },
      ],
    },
    // Layer 4: social proof
    socialProof: {
      headline: "Ya lo hicieron",
      // Live counter target — replace with real Supabase count when ready
      countLabel: "estudiantes",
      countFallback: 2847,
    },
  },

  // ──────────────────────────────────────────────────────────
  // GATE 1 — Email capture after Test 1 (soft ask)
  // ──────────────────────────────────────────────────────────
  gate1: {
    trigger: "after-test1-result",
    headline: "Guarda tu perfil",
    body: "Te mandamos tu perfil completo al mail cuando termines la segunda prueba. Así no lo pierdes.",
    fields: {
      email: {
        label: "Tu correo",
        placeholder: "tunombre@mail.com",
        error: "Pon un correo de verdad, porfa.",
      },
    },
    cta: "Seguir a la segunda prueba",
    skipCta: "Seguir sin guardar",
  },

  // ──────────────────────────────────────────────────────────
  // GATE 2 — Full lead capture after Test 2 (hard gate unlocks full result)
  // ──────────────────────────────────────────────────────────
  gate2: {
    trigger: "after-test2-result",
    headline: "Tu perfil completo está listo",
    body: "Déjanos tus datos para desbloquear tu perfil completo y recibir tu carta personalizada.",
    fields: {
      name: {
        label: "Tu nombre",
        placeholder: "Nombre y apellido",
        error: "Pon tu nombre.",
      },
      phone: {
        label: "Tu WhatsApp",
        placeholder: "+52 614 123 4567",
        hint: "Solo por si te mandamos novedades. No hay spam.",
        error: "Pon un número de WhatsApp válido.",
      },
      grade: {
        label: "En qué grado vas",
        options: [
          { value: "sec_1_2", label: "1º o 2º de secundaria" },
          { value: "sec_3", label: "3º de secundaria" },
          { value: "prepa_1_2", label: "1º o 2º de prepa" },
          { value: "prepa_3", label: "3º de prepa (último año)" },
          { value: "otro", label: "Otro" },
        ],
        error: "Dinos en qué grado vas.",
      },
      school: {
        label: "Tu escuela (opcional)",
        placeholder: "Nombre de tu prepa",
      },
    },
    consent: {
      required: true,
      label:
        "Acepto recibir mi perfil y novedades de Isthmus Arquitectura en mi correo y WhatsApp. Puedo darme de baja cuando quiera.",
      error: "Tienes que aceptar para ver tu perfil completo.",
    },
    cta: "Ver mi perfil completo",
  },

  // ──────────────────────────────────────────────────────────
  // RESULT — combined profile page
  // ──────────────────────────────────────────────────────────
  result: {
    headline: "Tu perfil",
    subheadline: "Así piensas. Así construyes.",
    shareCta: "Envía tu perfil",
    saveCta: "Guardar PDF",
    retakeCta: "Hacer otra vez",
    // WhatsApp share message template — %URL% replaced at runtime
    whatsappMessage:
      "Acabo de hacer Elige Bien y salí %PROFILE%. Mira mi perfil: %URL%",
  },

  // ──────────────────────────────────────────────────────────
  // FOOTER — legal + Isthmus author credit
  // ──────────────────────────────────────────────────────────
  footer: {
    authorLine: "Hecho con ❤ por Isthmus Arquitectura en Chihuahua",
    privacyLink: { label: "Privacidad", href: "/privacidad" },
    termsLink: { label: "Términos", href: "/terminos" },
    copyright: `© ${new Date().getFullYear()} Elige Bien`,
  },

  // ──────────────────────────────────────────────────────────
  // ATTRIBUTION — URL source params we recognize
  // ──────────────────────────────────────────────────────────
  sources: {
    fallback: "organic",
    // Every physical distribution surface gets a prefix for easy filtering
    prefixes: {
      fair: "fair-", // fair-uach-2026-04
      nfc: "nfc-", // nfc-batch-1
      sticker: "sticker-", // sticker-prepa-revolucion
      print: "print-", // print-cards-v1
      social: "social-", // social-instagram-bio
    },
  },
} as const;

export type Experience = typeof EXPERIENCE;
export type GradeValue =
  (typeof EXPERIENCE.gate2.fields.grade.options)[number]["value"];
