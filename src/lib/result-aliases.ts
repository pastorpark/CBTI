import {
  nutritionKeys,
  nutritionLabels,
  nutritionResults,
  personaEnglishLabels,
  personaKeys,
  personaLabels,
  personaResults
} from "@/data/test";
import type { NutritionKey, PersonaKey } from "@/types/test";

function normalizeAlias(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/christian/g, "")
    .replace(/[\s_\-–—/]+/g, "");
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function buildPersonaAliases() {
  const aliases = new Map<string, PersonaKey>();

  for (const key of personaKeys) {
    const values = [
      key,
      personaLabels[key],
      personaEnglishLabels[key],
      personaResults[key].title,
      ...personaResults[key].keywords
    ];

    for (const value of values) {
      aliases.set(normalizeAlias(value), key);
    }
  }

  return aliases;
}

function buildNutritionAliases() {
  const aliases = new Map<string, NutritionKey>();

  for (const key of nutritionKeys) {
    const values = [
      key,
      nutritionLabels[key],
      nutritionResults[key].key,
      nutritionResults[key].title,
      ...nutritionResults[key].keywords
    ];

    for (const value of values) {
      aliases.set(normalizeAlias(value), key);
    }
  }

  return aliases;
}

const personaAliases = buildPersonaAliases();
const nutritionAliases = buildNutritionAliases();

const nutritionShortAliases: Record<string, NutritionKey> = {
  탄수화물: "CARB",
  단백질: "PROTEIN",
  비타민: "VITAMIN",
  미네랄: "MINERAL",
  유산균: "PROBIOTICS"
};

for (const [alias, key] of Object.entries(nutritionShortAliases)) {
  nutritionAliases.set(normalizeAlias(alias), key);
}

export function resolvePersonaResultKey(value: string | null | undefined): PersonaKey | null {
  if (!value) return null;
  return personaAliases.get(normalizeAlias(safeDecode(value))) || null;
}

export function resolveNutritionResultKey(value: string | null | undefined): NutritionKey | null {
  if (!value) return null;
  return nutritionAliases.get(normalizeAlias(safeDecode(value))) || null;
}
