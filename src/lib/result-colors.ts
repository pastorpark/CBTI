import type { CSSProperties } from "react";
import type { NutritionKey, PersonaKey, ResultKey } from "@/types/test";

export const personaResultColors: Record<PersonaKey, string> = {
  Orthodox: "#334155",
  Intellectual: "#1d4ed8",
  Progressive: "#7c3aed",
  Social: "#047857",
  Liturgical: "#7c2d12",
  Charismatic: "#c2410c",
  Relational: "#be123c"
};

export const nutritionResultColors: Record<NutritionKey, string> = {
  CARB: "#b45309",
  PROTEIN: "#9f1239",
  VITAMIN: "#65a30d",
  MINERAL: "#0284c7",
  PROBIOTICS: "#7c3aed"
};

const resultColors: Record<ResultKey, string> = {
  ...personaResultColors,
  ...nutritionResultColors
};

export function getResultHeaderStyle(resultKey: ResultKey): CSSProperties {
  return { "--result-color": resultColors[resultKey] } as CSSProperties;
}
