/**
 * Multi-campus configuration system.
 *
 * Each campus is a config entry. Adding a new campus = adding a new object.
 * The site domain and brand live here as single sources of truth.
 */

export interface CampusConfig {
  /** URL slug used in routes: /norte, /cdmx, etc. */
  slug: string;
  /** Display name: "Isthmus Norte" */
  name: string;
  /** City for copy/hooks: "Chihuahua" */
  city: string;
  /** WhatsApp number with country code (no +) */
  whatsapp: string;
  /** Accent colors per campus (optional override) */
  colors?: {
    primary: string;
    secondary: string;
  };
}

/** Site-wide constants — single source of truth for domain and brand. */
export const SITE_CONFIG = {
  domain: "https://isthmusxp.com",
  brand: "Isthmus",
  /** Brand tagline shown in footers and OG tags */
  tagline: "Arquitectura. De verdad.",
} as const;

/** Campus registry — add new campuses here. */
export const CAMPUSES: Record<string, CampusConfig> = {
  norte: {
    slug: "norte",
    name: "Isthmus Norte",
    city: "Chihuahua",
    whatsapp: "5216141234567",
  },
} as const;

/** Default campus used when no campus param is provided. */
export const DEFAULT_CAMPUS = CAMPUSES.norte;

/** Get a campus config by slug, falling back to default. */
export function getCampus(slug?: string | null): CampusConfig {
  if (slug && slug in CAMPUSES) return CAMPUSES[slug];
  return DEFAULT_CAMPUS;
}
