import { personaKeys, questions, tieBreakerOrder } from "@/data/test";
import type { Answer, PersonaKey, PersonaScores, QuestionOption, ResultKey, ResultScores } from "@/types/test";

export function createEmptyScores(): PersonaScores {
  return Object.fromEntries(personaKeys.map((key) => [key, 0])) as PersonaScores;
}

export function createEmptyResultScores(resultKeys: ResultKey[]): ResultScores {
  return Object.fromEntries(resultKeys.map((key) => [key, 0]));
}

export function findOption(optionId: string, sourceQuestions = questions): QuestionOption | undefined {
  for (const question of sourceQuestions) {
    const option = question.options.find((item) => item.id === optionId);
    if (option) return option;
  }

  return undefined;
}

export function calculateScores(answers: Answer[], sourceQuestions = questions, resultKeys: ResultKey[] = personaKeys): ResultScores {
  const scores = createEmptyResultScores(resultKeys);

  for (const answer of answers) {
    const option = findOption(answer.optionId, sourceQuestions);
    if (!option) continue;

    for (const score of option.scores) {
      scores[score.persona] = (scores[score.persona] || 0) + score.weight;
    }
  }

  return scores;
}

export function resolvePrimaryResult(scores: ResultScores, resultKeys: ResultKey[], tieBreakers: ResultKey[] = resultKeys): ResultKey {
  const highest = Math.max(...resultKeys.map((key) => scores[key] || 0));
  const tied = tieBreakers.filter((key) => (scores[key] || 0) === highest);
  return tied[0] || resultKeys[0];
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

export function getSortedResultScores(scores: ResultScores, resultKeys: ResultKey[]) {
  return resultKeys
    .map((key) => ({ key, score: scores[key] || 0 }))
    .sort((a, b) => b.score - a.score);
}

export function isPersonaKey(value: string | null): value is PersonaKey {
  return personaKeys.includes(value as PersonaKey);
}
