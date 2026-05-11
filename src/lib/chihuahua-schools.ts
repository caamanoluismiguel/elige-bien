/**
 * Preparatorias / bachilleratos en la ciudad de Chihuahua, capital del estado.
 *
 * El campo `school` es texto libre en Supabase. Este array sólo alimenta el
 * `<datalist>` del formulario para autocomplete — el kid puede escribir
 * cualquier valor si su escuela no está aquí.
 *
 * Ordenado alfabético para que el dropdown sea legible. Mezcla:
 *  - Públicas: COBACH, CBTis, CBTa, CECyT, CETis, CONALEP, Prepa del Estado,
 *    Prepa UACH, Telebachillerato, Prepa Abierta SPAyT
 *  - Privadas/bilingües/religiosas: Palmore, Anglo Moderno, La Salle, Cumbres,
 *    Madison, Everest, ASC, Maple, High Point, etc.
 *  - Tec privadas: Prepa Tec (Tec de Monterrey), Tecmilenio, Anáhuac
 *
 * Ajustar conforme las ferias y los leads reales nos digan qué escuelas
 * realmente aparecen.
 */

export const CHIHUAHUA_SCHOOLS: readonly string[] = [
  "American School Chihuahua (ASC)",
  "Anglo Moderno",
  "CBTa 8",
  "CBTa 213",
  "CBTis 122",
  "CBTis 158",
  "CCU — Centro Cultural Universitario",
  "CECyT 6 — Oriente",
  "CECyT 21 — Riberas",
  "CECyT Toribio Ortega",
  "CETis 86",
  "CETis Chihuahua",
  "COBACH 1 — Casa de los Lobos",
  "COBACH 3",
  "COBACH 6 — Casa de los Águilas",
  "COBACH 8",
  "COBACH 10",
  "COBACH 14",
  "COBACH 20",
  "Colegio Americano de Chihuahua",
  "Colegio Bilingüe de Chihuahua",
  "Colegio de Chihuahua",
  "Colegio Everest Chihuahua",
  "Colegio Inglés de Chihuahua",
  "Colegio Madison Chihuahua",
  "Colegio Maple",
  "Colegio Mundo Bilingüe",
  "Colegio Palmore",
  "Colegio Real Bilingüe",
  "Colegio Regional Bilingüe",
  "Colegio Sierra Madre",
  "CONALEP Chihuahua I",
  "CONALEP Chihuahua II",
  "Cumbres Chihuahua",
  "ESPABI",
  "High Point International School",
  "IESCH — Instituto de Estudios Superiores de Chihuahua",
  "Instituto América",
  "Instituto Bilingüe London",
  "Instituto La Salle de Chihuahua",
  "ITCMA",
  "Prepa Abierta SPAyT",
  "Prepa Anáhuac Chihuahua",
  "Prepa del Estado — Chihuahua",
  "Prepa Tec — Campus Chihuahua",
  "Prepa Tecmilenio Chihuahua",
  "Prepa UACH",
  "Prepa UACH — Campus 1",
  "Prepa UACH — Campus 2",
  "Telebachillerato Comunitario",
];
