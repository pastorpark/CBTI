import { personaKeys, questions, tieBreakerOrder } from "@/data/test";
import type { Answer, PersonaKey, PersonaScores, QuestionOption } from "@/types/test";

export function createEmptyScores(): PersonaScores {
  return Object.fromEntries(personaKeys.map((key) => [key, 0])) as PersonaScores;
}

export function findOption(optionId: string): QuestionOption | undefined {
  for (const question of questions) {
    const option = question.options.find((item) => item.id === optionId);
    if (option) return option;
  }

  return undefined;
}

export function calculateScores(answers: Answer[]): PersonaScores {
  const scores = createEmptyScores();

  for (const answer of answers) {
    const option = findOption(answer.optionId);
    if (!option) continue;

    for (const score of option.scores) {
      scores[score.persona] += score.weight;
    }
  }

  return scores;
}

export function resolvePrimaryPersona(scores: PersonaScores): PersonaKey {
  const highest = Math.max(...personaKeys.map((key) => scores[key]));
  const tied = tieBreakerOrder.filter((key) => scores[key] === highest);
  return tied[0];
}

export function getClosePersonas(scores: PersonaScores, primary: PersonaKey): PersonaKey[] {
  const primaryScore = scores[primary];

  return personaKeys
    .filter((key) => key !== primary && primaryScore - scores[key] <= 1)
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 2);
}

export function getSortedScores(scores: PersonaScores) {
  return personaKeys
    .map((key) => ({ key, score: scores[key] }))
    .sort((a, b) => b.score - a.score);
}

export function isPersonaKey(value: string | null): value is PersonaKey {
  return personaKeys.includes(value as PersonaKey);
}
