import type { QuizQuestion } from "@/types/quiz";

export const TEST2_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Cuál de estos proyectos te llama más?",
    type: "image",
    options: [
      {
        id: "1a",
        text: "Torre minimalista en Tokio",
        axis: "forma",
        imageUrl: "/images/t2/project-minimalist.jpg",
        imageAlt: "Torre residencial minimalista",
      },
      {
        id: "1b",
        text: "Hospital que genera su propia energía",
        axis: "sistemas",
        imageUrl: "/images/t2/project-sustainable.jpg",
        imageAlt: "Hospital sustentable",
      },
      {
        id: "1c",
        text: "Centro comunitario con materiales locales",
        axis: "impacto",
        imageUrl: "/images/t2/project-community.jpg",
        imageAlt: "Centro comunitario",
      },
      {
        id: "1d",
        text: "Casa experimental que se adapta al clima",
        axis: "innovacion",
        imageUrl: "/images/t2/project-experimental.jpg",
        imageAlt: "Casa experimental",
      },
    ],
  },
  {
    id: 2,
    context: "Si pudieras resolver UN problema de Chihuahua con arquitectura.",
    question: "¿Cuál escoges?",
    type: "text",
    options: [
      {
        id: "2a",
        text: "Que los edificios del centro se vean mejor",
        axis: "forma",
      },
      {
        id: "2b",
        text: "Que las construcciones resistan el calor sin gastar tanta energía",
        axis: "sistemas",
      },
      {
        id: "2c",
        text: "Que haya más espacios públicos para la comunidad",
        axis: "impacto",
      },
      {
        id: "2d",
        text: "Que se construya diferente, con materiales y técnicas nuevas",
        axis: "innovacion",
      },
    ],
  },
  {
    id: 3,
    context: "En un equipo de arquitectos.",
    question: "¿Dónde te ves?",
    type: "text",
    options: [
      {
        id: "3a",
        text: "Diseñando la forma, los planos, la experiencia visual",
        axis: "forma",
      },
      {
        id: "3b",
        text: "Resolviendo estructura, instalaciones, cálculos",
        axis: "sistemas",
      },
      {
        id: "3c",
        text: "Investigando qué necesita la comunidad",
        axis: "impacto",
      },
      {
        id: "3d",
        text: "Experimentando con materiales, tecnología, impresión 3D",
        axis: "innovacion",
      },
    ],
  },
  {
    id: 4,
    question: "¿Qué te importa más en un edificio?",
    type: "text",
    options: [
      { id: "4a", text: "Que sea bello", axis: "forma" },
      { id: "4b", text: "Que funcione perfectamente", axis: "sistemas" },
      { id: "4c", text: "Que cambie la vida de quien lo usa", axis: "impacto" },
      {
        id: "4d",
        text: "Que se haya construido de una forma que nadie más ha intentado",
        axis: "innovacion",
      },
    ],
  },
  {
    id: 5,
    question: "¿En cuál espacio de trabajo te imaginas?",
    type: "image",
    options: [
      {
        id: "5a",
        text: "Estudio de diseño con maquetas y renders",
        axis: "forma",
        imageUrl: "/images/t2/workspace-studio.jpg",
        imageAlt: "Estudio de diseño",
      },
      {
        id: "5b",
        text: "Oficina con simulaciones por computadora",
        axis: "sistemas",
        imageUrl: "/images/t2/workspace-tech.jpg",
        imageAlt: "Oficina técnica",
      },
      {
        id: "5c",
        text: "En terreno, hablando con la gente",
        axis: "impacto",
        imageUrl: "/images/t2/workspace-field.jpg",
        imageAlt: "Trabajo en campo",
      },
      {
        id: "5d",
        text: "Laboratorio con drones e impresoras 3D",
        axis: "innovacion",
        imageUrl: "/images/t2/workspace-lab.jpg",
        imageAlt: "Laboratorio",
      },
    ],
  },
  {
    id: 6,
    question: "¿Qué quieres que la gente diga de lo que haces?",
    type: "text",
    options: [
      {
        id: "6a",
        text: '"Es lo más bonito que he visto"',
        axis: "forma",
      },
      {
        id: "6b",
        text: '"¿Cómo puede ser tan eficiente?"',
        axis: "sistemas",
      },
      {
        id: "6c",
        text: '"Me cambió la vida"',
        axis: "impacto",
      },
      {
        id: "6d",
        text: '"Nadie había hecho algo así"',
        axis: "innovacion",
      },
    ],
  },
  {
    id: 7,
    context: "Si mañana empezaras a estudiar arquitectura.",
    question: "¿Qué te emociona más?",
    type: "text",
    options: [
      {
        id: "7a",
        text: "Aprender a diseñar algo hermoso desde cero",
        axis: "forma",
      },
      {
        id: "7b",
        text: "Entender cómo se sostiene un edificio y cómo hacerlo sustentable",
        axis: "sistemas",
      },
      {
        id: "7c",
        text: "Ir a una comunidad real y diseñar algo que necesitan",
        axis: "impacto",
      },
      {
        id: "7d",
        text: "Experimentar con lo último: IA, BIM, fabricación digital",
        axis: "innovacion",
      },
    ],
  },
  {
    id: 8,
    question: "¿Cómo prefieres aprender?",
    type: "text",
    options: [
      {
        id: "8a",
        text: "Que me muestren referencias y ejemplos — y luego crear el mío",
        axis: "forma",
      },
      {
        id: "8b",
        text: "Entender la teoría primero y luego aplicarla",
        axis: "sistemas",
      },
      {
        id: "8c",
        text: "Ir al campo, ver el sitio, hablar con la gente, y luego diseñar",
        axis: "impacto",
      },
      {
        id: "8d",
        text: "Que me den un reto y déjame experimentar",
        axis: "innovacion",
      },
    ],
  },
];
