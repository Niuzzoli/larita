export const SCENES = ["intro", "memories", "quiz", "notes", "final"] as const;
export type SceneId = (typeof SCENES)[number];

export interface ExperienceState {
  scene: SceneId;
  maxReached: SceneId;
  quizAnswers: Record<string, string>;
  openedNotes: string[];
  finalIntroDone: boolean;
  giftRevealed: boolean;
}

export type ExperienceAction =
  | { type: "next"; from: SceneId }
  | { type: "back"; from: SceneId }
  | { type: "answerQuiz"; questionId: string; optionId: string }
  | { type: "openNote"; noteId: string }
  | { type: "finalIntroDone" }
  | { type: "revealGift" }
  | { type: "restart" };

export const initialState: ExperienceState = {
  scene: "intro",
  maxReached: "intro",
  quizAnswers: {},
  openedNotes: [],
  finalIntroDone: false,
  giftRevealed: false,
};

export function experienceReducer(state: ExperienceState, action: ExperienceAction): ExperienceState {
  switch (action.type) {
    case "next": {
      const index = SCENES.indexOf(state.scene);
      if (action.from !== state.scene || index === SCENES.length - 1) return state;
      const scene = SCENES[index + 1];
      const maxReached = SCENES.indexOf(state.maxReached) > index + 1 ? state.maxReached : scene;
      return { ...state, scene, maxReached };
    }
    case "back": {
      const index = SCENES.indexOf(state.scene);
      if (action.from !== state.scene || index === 0) return state;
      return { ...state, scene: SCENES[index - 1] };
    }
    case "answerQuiz":
      if (state.quizAnswers[action.questionId] !== undefined) return state;
      return { ...state, quizAnswers: { ...state.quizAnswers, [action.questionId]: action.optionId } };
    case "openNote":
      if (state.openedNotes.includes(action.noteId)) return state;
      return { ...state, openedNotes: [...state.openedNotes, action.noteId] };
    case "finalIntroDone":
      return state.finalIntroDone ? state : { ...state, finalIntroDone: true };
    case "revealGift":
      return state.giftRevealed ? state : { ...state, giftRevealed: true };
    case "restart":
      return initialState;
  }
}
