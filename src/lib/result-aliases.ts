import {
  baseTestContent,
  nutritionKeys,
  personaKeys,
} from "@/data/test";
import type { NutritionKey, PersonaKey, TestContent } from "@/types/test";

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

function buildPersonaAliases(content: TestContent) {
  const aliases = new Map<string, PersonaKey>();

  for (const key of personaKeys) {
    const values = [
      key,
      content.personaLabels[key],
      content.personaEnglishLabels[key],
      content.personaResults[key].title,
      ...content.personaResults[key].keywords
    ];

    for (const value of values) {
      aliases.set(normalizeAlias(value), key);
    }
  }

  return aliases;
}

function buildNutritionAliases(content: TestContent) {
  const aliases = new Map<string, NutritionKey>();

  for (const key of nutritionKeys) {
    const values = [
      key,
      content.nutritionLabels[key],
      content.nutritionResults[key].key,
      content.nutritionResults[key].title,
      ...content.nutritionResults[key].keywords
    ];

    for (const value of values) {
      aliases.set(normalizeAlias(value), key);
    }
  }

  return aliases;
}

const personaAliases = buildPersonaAliases(baseTestContent);
const nutritionAliases = buildNutritionAliases(baseTestContent);

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

export function resolvePersonaResultKey(value: string | null | undefined, content = baseTestContent): PersonaKey | null {
  if (!value) return null;
  const normalized = normalizeAlias(safeDecode(value));
  return buildPersonaAliases(content).get(normalized) || personaAliases.get(normalized) || null;
}

export function resolveNutritionResultKey(value: string | null | undefined, content = baseTestContent): NutritionKey | null {
  if (!value) return null;
  const normalized = normalizeAlias(safeDecode(value));
  return buildNutritionAliases(content).get(normalized) || nutritionAliases.get(normalized) || null;
}
