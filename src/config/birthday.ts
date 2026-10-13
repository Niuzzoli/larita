import type { BirthdayConfig } from "@/types/birthday";

/**
 * TODO EL CONTENIDO EDITABLE DE LA WEB ESTÁ ACÁ.
 * Cambiá textos, fotos, preguntas y mensajes en este archivo y nada más.
 * Después corré `npm test` para chequear que no falte nada.
 */
export const birthday: BirthdayConfig = {
  people: { from: "Nacho", to: "Larita" },
  age: 21,
  birthday: "17/10",
  relationshipStart: "2023-07-16",

  intro: {
    lines: ["Hoy es un día muy especial...", "Y preparé algo para vos. ♡"],
    hint: "Tocá la caja",
    boxLabel: "Abrir la caja de regalo",
    cta: "Descubrir mi regalo",
  },

  memories: {
    intro: "Si hay algo que me encanta, es tener recuerdos con vos.",
    sinceLabel: "desde el 16/07/2023",
    continueLabel: "Ahora, un jueguito",
    photos: [
      {
        src: "/images/memories/foto-01.jpg",
        width: 960,
        height: 1280,
        caption: "La primer foto iconic de Larita y Nacho Iuzzo",
        alt: "Larita y Nacho a punto de darse un beso, de noche al aire libre",
      },
      {
        src: "/images/memories/foto-02.jpg",
        width: 768,
        height: 1024,
        caption: "Super mirada",
        alt: "Selfie muy de cerca de Larita y Nacho mirándose",
      },
      {
        src: "/images/memories/foto-03.jpg",
        width: 900,
        height: 1600,
        caption: "Año nuevo con la más linda del mundo mundial",
        alt: "Nacho abrazando a Larita y dándole un beso en la mejilla, de noche",
      },
      {
        src: "/images/memories/foto-04.jpg",
        width: 720,
        height: 1280,
        caption: "Un poquito de vitamina C con mi novia en el río",
        alt: "Selfie de Larita y Nacho sentados en el pasto con sol de tarde",
      },
      {
        src: "/images/memories/foto-05.jpg",
        width: 1080,
        height: 1920,
        caption: "Re bandidos con mi novia",
        alt: "Larita y Nacho con un filtro de gorros de Mario y Luigi",
      },
      {
        src: "/images/memories/foto-06.jpg",
        width: 1600,
        height: 900,
        caption: "Super fogata especial para mi novia",
        alt: "Selfie de Larita y Nacho con un ramo de flores blancas y una fogata en una pantalla de fondo",
      },
      {
        src: "/images/memories/foto-07.jpg",
        width: 1600,
        height: 900,
        caption: "Larita la más barrabrava",
        alt: "Nacho abrazando a Larita en la tribuna de una cancha de fútbol",
      },
      {
        src: "/images/memories/foto-08.jpg",
        width: 1200,
        height: 1600,
        caption: "Larita y Nacho Iuzzo siendo los más iconics del mundo",
        alt: "Larita y Nacho abrazados frente a una pared blanca, vestidos de negro",
      },
      {
        src: "/images/memories/foto-09.jpg",
        width: 1600,
        height: 1200,
        caption: "Re concierto de Ángela Torres y la vida rosa",
        alt: "Selfie de Larita y Nacho entre el público de un recital",
      },
    ],
  },

  quiz: {
    title: "¿Cuánto sabés de nosotros?",
    nextLabel: "Siguiente",
    resultLabel: "Ver resultado",
    result: "Resultado oficial: sos la novia más iconic del mundo.",
    continueLabel: "Tengo algo más para vos",
    questions: [
      {
        id: "inicio",
        question: "¿Qué día empezó nuestro pequeño universo?",
        options: [
          { id: "a", label: "17/10/2023" },
          { id: "b", label: "16/07/2023" },
          { id: "c", label: "16/06/2023" },
          { id: "d", label: "07/06/2023" },
        ],
        correctOptionId: "b",
        correctReaction: "¡Esa! El 16/07/2023, el mejor día del calendario.",
        missReaction: "Casi, casi. Fue el 16/07/2023, pero te lo perdono porque sos vos.",
      },
      {
        id: "concierto",
        question: "¿A quién fuimos a ver en ese re concierto?",
        options: [
          { id: "a", label: "Emilia" },
          { id: "b", label: "Tini" },
          { id: "c", label: "Ángela Torres" },
          { id: "d", label: "Nicki Nicole" },
        ],
        correctOptionId: "c",
        correctReaction: "¡Obvio! Ángela Torres y la vida rosa.",
        missReaction: "Mmm, no. Era Ángela Torres, y fue un re concierto.",
      },
      {
        id: "bandidos",
        question: "En la foto de los re bandidos, ¿quién es Luigi?",
        options: [
          { id: "a", label: "Larita" },
          { id: "b", label: "Nacho" },
          { id: "c", label: "Los dos" },
          { id: "d", label: "Ninguno" },
        ],
        correctOptionId: "a",
        correctReaction: "¡Sí! Luigi sos vos, la bandida de verde.",
        missReaction: "No, no: Luigi sos vos. Yo era Mario.",
      },
      {
        id: "linda",
        question: "¿Quién es la más linda del mundo mundial?",
        options: [
          { id: "a", label: "Larita", reaction: "Correcto. No hay otra respuesta posible." },
          { id: "b", label: "Obvio que Larita", reaction: "Exacto. Obvio." },
          { id: "c", label: "La novia de Nacho", reaction: "O sea, vos. Correctísimo." },
          { id: "d", label: "Todas las anteriores", reaction: "La respuesta más completa. Diez puntos." },
        ],
      },
      {
        id: "amor",
        question: "¿Quién ama más a quién?",
        options: [
          { id: "a", label: "Yo", reaction: "Bueno, bueno... te la dejo pasar porque es tu cumple." },
          { id: "b", label: "Vos", reaction: "Gracias por reconocerlo." },
          { id: "c", label: "Empate técnico", reaction: "Empate, pero con revancha." },
          { id: "d", label: "Esto no se discute", reaction: "Tenés razón: se demuestra." },
        ],
      },
    ],
  },

  notes: {
    title: "Pequeñas cosas que amo de vos",
    unlockedText: "Llevamos {days} días juntos, y contando.",
    continueLabel: "Una última cosa",
    items: [
      { id: "1", title: "Razón n.º 1", message: "Amo a mi novia porque siempre lo da todo por mejorar" },
      { id: "2", title: "Razón n.º 2", message: "Amo a mi novia porque es la más buena del mundo" },
      { id: "3", title: "Razón n.º 3", message: "Amo a mi novia porque es la más trabajadora y estudiosa del mundo" },
      { id: "4", title: "Razón n.º 4", message: "Amo a mi novia porque siempre me demuestra todo su amor de la manera más linda" },
      { id: "5", title: "Razón n.º 5", message: "Amo a mi novia porque es la más tierna y chiquita del mundo" },
      { id: "6", title: "Razón n.º 6", message: "Amo a mi novia porque es la más enojoncita y me encanta su carita de enojada" },
      { id: "7", title: "Razón n.º 7", message: "Amo a mi novia porque siempre nos reímos juntos" },
      { id: "8", title: "Razón n.º 8", message: "Amo a mi novia porque lo es todo para mí" },
    ],
  },

  final: {
    intro: "Y si llegaste hasta acá, es porque todavía me quedan cosas por decirte...",
    favoritePhoto: {
      src: "/images/final/foto-favorita.jpg",
      width: 1200,
      height: 1600,
      alt: "Larita sonriendo de cerca, con la cara apoyada en la mano",
    },
    // Un elemento por párrafo.
    letter: [
      "Felices 21 a mi novia, espero que pases el día más lindo y que disfrutes mucho, te lo mereces más que nadie por todo lo que sos y todo lo que haces día a día.",
      "Me encanta pasar los días con mi novia y poder acompañarte otra vez en tu cumpleaños sabiendo que es un día tan especial para vos, ojalá sea así siempre.",
      "Gracias por siempre querer ser mejor y preocuparte por nosotros para que seamos mejores juntos.",
      "Sos la más linda y buena del mundo, te amo infinito.",
    ],
    closing: "Feliz cumpleaños, mi amor. ♡",
    giftButton: "¿Abrimos tu último regalito?",
    giftMessage: {
      text: "Gracias por dejarme acompañarte un cumpleaños más. Te amo infinito.",
      signature: "Nacho",
    },
    restartLabel: "Volver a ver",
  },

  // Para agregar música: poné el archivo en public/audio/ y descomentá esto.
  // music: { src: "/audio/nuestra-cancion.mp3", title: "Nuestra canción" },
};
