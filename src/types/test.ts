export type PersonaKey =
  | "Orthodox"
  | "Intellectual"
  | "Progressive"
  | "Social"
  | "Liturgical"
  | "Charismatic"
  | "Relational";

export type NutritionKey = "CARB" | "PROTEIN" | "VITAMIN" | "MINERAL" | "PROBIOTICS";

export type ResultKey = PersonaKey | NutritionKey;

export type WeightedScore = {
  persona: ResultKey;
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

export type SurveyId = "cbti" | "nutri";
export type SiteVariantId = "pastor" | "ivf";

export type Survey = {
  id: SurveyId;
  title: string;
  description: string;
  questions: Question[];
  resultKeys: ResultKey[];
  resultLabels: Record<string, string>;
};

export type ResultScores = Record<string, number>;
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

export type NutritionResult = {
  key: NutritionKey;
  title: string;
  status: string;
  description: string;
  recommendation: string;
  cta: string;
  keywords: string[];
};
