import type { QuizQuestion } from "@/types/quiz";

export const TEST1_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    context: "Llegas a un lugar que no conoces.",
    question: "¿Qué notas primero?",
    type: "text",
    options: [
      {
        id: "1a",
        text: "Las dimensiones, la altura, cómo está organizado el espacio",
        axis: "espacial",
      },
      {
        id: "1b",
        text: "Si algo no funciona bien o está mal puesto",
        axis: "analitica",
      },
      {
        id: "1c",
        text: "Los colores, la textura, el ambiente que se siente",
        axis: "creativa",
      },
      {
        id: "1d",
        text: "Si la gente que está ahí se siente cómoda",
        axis: "social",
      },
      {
        id: "1e",
        text: "De qué material está hecho, cómo se construyó",
        axis: "practica",
      },
    ],
  },
  {
    id: 2,
    context: "Un amigo te pide ayuda con un proyecto de la escuela.",
    question: "¿Tú qué haces?",
    type: "text",
    options: [
      {
        id: "2a",
        text: "Hago el diagrama, el mapa o el boceto visual",
        axis: "espacial",
      },
      {
        id: "2b",
        text: "Organizo el plan, divido las tareas, calculo el tiempo",
        axis: "analitica",
      },
      {
        id: "2c",
        text: "Propongo la idea loca que nadie había pensado",
        axis: "creativa",
      },
      {
        id: "2d",
        text: "Coordino al equipo, resuelvo los conflictos",
        axis: "social",
      },
      {
        id: "2e",
        text: 'Digo "ya dejen de hablar y empecemos a hacer"',
        axis: "practica",
      },
    ],
  },
  {
    id: 3,
    context: "En tu tiempo libre.",
    question: "¿Qué te atrapa más?",
    type: "text",
    options: [
      {
        id: "3a",
        text: "Perderme en Google Maps mirando ciudades desde arriba",
        axis: "espacial",
      },
      {
        id: "3b",
        text: "Resolver algo: un juego, un acertijo, armar algo",
        axis: "analitica",
      },
      {
        id: "3c",
        text: "Crear: dibujar, editar videos, diseñar algo",
        axis: "creativa",
      },
      {
        id: "3d",
        text: "Estar con gente, planear algo, organizar un evento",
        axis: "social",
      },
      {
        id: "3e",
        text: "Arreglar cosas, construir algo con mis manos",
        axis: "practica",
      },
    ],
  },
  {
    id: 4,
    context: "Si pudieras cambiar UNA cosa de tu ciudad.",
    question: "¿Qué sería?",
    type: "text",
    options: [
      {
        id: "4a",
        text: "El diseño de los edificios y las calles",
        axis: "espacial",
      },
      { id: "4b", text: "El transporte y la logística", axis: "analitica" },
      {
        id: "4c",
        text: "Que se vea más bonita, con más identidad",
        axis: "creativa",
      },
      {
        id: "4d",
        text: "Que haya más espacios para la comunidad",
        axis: "social",
      },
      {
        id: "4e",
        text: "Que las cosas funcionen y no se caigan a pedazos",
        axis: "practica",
      },
    ],
  },
  {
    id: 5,
    question: "¿Cuál de estas frases va más contigo?",
    type: "text",
    options: [
      { id: "5a", text: "Veo cosas que otros no ven", axis: "espacial" },
      {
        id: "5b",
        text: "Siempre encuentro la forma más eficiente",
        axis: "analitica",
      },
      {
        id: "5c",
        text: "Necesito expresar lo que tengo en la cabeza",
        axis: "creativa",
      },
      {
        id: "5d",
        text: "Me importa cómo se sienten los demás",
        axis: "social",
      },
      { id: "5e", text: "Menos palabras, más acción", axis: "practica" },
    ],
  },
  {
    id: 6,
    context: "Imagínate que tienes un terreno vacío.",
    question: "¿Qué haces?",
    type: "text",
    options: [
      {
        id: "6a",
        text: "Lo dibujo, pienso en qué forma tendría lo que construya",
        axis: "espacial",
      },
      {
        id: "6b",
        text: "Investigo qué es más rentable hacer con él",
        axis: "analitica",
      },
      {
        id: "6c",
        text: "Imagino algo que nunca se ha hecho ahí",
        axis: "creativa",
      },
      {
        id: "6d",
        text: "Pregunto qué necesita la gente del barrio",
        axis: "social",
      },
      { id: "6e", text: "Empiezo a construir algo ya", axis: "practica" },
    ],
  },
];
