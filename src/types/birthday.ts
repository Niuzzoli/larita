export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface MemoryPhoto extends Photo {
  caption: string;
  date?: string;
  description?: string;
}

export interface QuizOption {
  id: string;
  label: string;
  /** Reacción propia de esta opción. Obligatoria en preguntas sin respuesta correcta. */
  reaction?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  /** Si falta, la pregunta es de humor y todas las opciones valen. */
  correctOptionId?: string;
  correctReaction?: string;
  missReaction?: string;
}

export interface LoveNote {
  id: string;
  title: string;
  message: string;
}

export interface MusicConfig {
  src: string;
  title?: string;
}

export interface BirthdayConfig {
  people: { from: string; to: string };
  age?: number;
  birthday: string;
  /** Formato ISO: AAAA-MM-DD. */
  relationshipStart?: string;
  intro: { lines: [string, string]; hint: string; boxLabel: string; cta: string };
  memories: { intro: string; sinceLabel: string; continueLabel: string; photos: MemoryPhoto[] };
  quiz: {
    title: string;
    nextLabel: string;
    resultLabel: string;
    result: string;
    continueLabel: string;
    questions: QuizQuestion[];
  };
  notes: { title: string; unlockedText: string; continueLabel: string; items: LoveNote[] };
  final: {
    intro: string;
    favoritePhoto?: Photo;
    letter: string[];
    closing: string;
    giftButton: string;
    giftMessage: { text: string; signature: string };
    restartLabel: string;
  };
  music?: MusicConfig;
}
