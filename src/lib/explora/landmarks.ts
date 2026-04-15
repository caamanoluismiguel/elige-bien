export type Landmark = {
  id: string;
  name: string;
  architect: string;
  year: string;
  city: string;
  location: { lat: number; lng: number };
  preferIndoor: boolean;
  hint: string;
};

export const LANDMARKS: Landmark[] = [
  {
    id: "sagrada-familia",
    name: "Sagrada Família",
    architect: "Antoni Gaudí",
    year: "1882—",
    city: "Barcelona, España",
    location: { lat: 41.4036, lng: 2.1744 },
    preferIndoor: true,
    hint: "Mira hacia arriba. Las columnas son árboles.",
  },
  {
    id: "sydney-opera",
    name: "Sydney Opera House",
    architect: "Jørn Utzon",
    year: "1973",
    city: "Sídney, Australia",
    location: { lat: -33.8568, lng: 151.2153 },
    preferIndoor: true,
    hint: "Las velas no son velas. Son gajos de una naranja.",
  },
  {
    id: "fallingwater",
    name: "Fallingwater",
    architect: "Frank Lloyd Wright",
    year: "1935",
    city: "Pensilvania, EE. UU.",
    location: { lat: 39.9063, lng: -79.4681 },
    preferIndoor: true,
    hint: "La casa vive encima de la cascada, no al lado.",
  },
  {
    id: "biblioteca-vasconcelos",
    name: "Biblioteca Vasconcelos",
    architect: "Alberto Kalach",
    year: "2006",
    city: "Ciudad de México",
    location: { lat: 19.4469, lng: -99.1508 },
    preferIndoor: true,
    hint: "Los libros flotan. Literalmente.",
  },
];

export const DEFAULT_LANDMARK_ID = LANDMARKS[0].id;
