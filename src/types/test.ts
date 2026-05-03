export type PersonaKey =
  | "Orthodox"
  | "Intellectual"
  | "Progressive"
  | "Social"
  | "Liturgical"
  | "Charismatic"
  | "Relational";

export type WeightedScore = {
  persona: PersonaKey;
  weight: number;
};

export type QuestionOption = {
  id: string;
  label: string;
  scores: WeightedScore[];
};

export type Question = {
  id: string;
  title: string;
  options: QuestionOption[];
};

export type Answer = {
  questionId: string;
  optionId: string;
};

export type PersonaScores = Record<PersonaKey, number>;

export type PersonaResult = {
  key: PersonaKey;
  title: string;
  subtitle: string;
  keywords: string[];
  description: string;
  spiritualStrength: string;
  growthRoutine: string;
  characterImage: string;
  denominations: {
    name: string;
    description: string;
  }[];
  tone: string;
};
