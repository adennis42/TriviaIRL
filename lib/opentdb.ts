import he from "he";
import type { OpenTDBQuestion, Question, Difficulty, QuestionSource } from "@/types";

export interface OpenTDBCategory {
  id: number;
  name: string;
}

// Module-level cache for categories
let cachedCategories: OpenTDBCategory[] | null = null;

export async function fetchCategories(): Promise<OpenTDBCategory[]> {
  if (cachedCategories) return cachedCategories;
  const res = await fetch("https://opentdb.com/api_category.php");
  const data = await res.json() as { trivia_categories: OpenTDBCategory[] };
  cachedCategories = data.trivia_categories;
  return cachedCategories;
}

export function normalizeOpenTDBQuestion(
  q: OpenTDBQuestion
): Omit<Question, "questionId" | "createdAt"> {
  const allAnswers = [...q.incorrect_answers, q.correct_answer].map((s) => he.decode(s));

  // Fisher-Yates shuffle
  for (let i = allAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
  }

  const correctAnswerIndex = allAnswers.indexOf(he.decode(q.correct_answer));

  return {
    questionText:       he.decode(q.question),
    options:            allAnswers,
    correctAnswerIndex,
    pointValue:         1000,
    timerSeconds:       30,
    category:           he.decode(q.category),
    difficulty:         q.difficulty as Difficulty,
    source:             "opentdb" as QuestionSource,
  };
}
