export type GameStatus = 'lobby' | 'active' | 'ended';
export type GameMode = 'solo' | 'teams' | 'mixed';
export type QuestionState = 'waiting' | 'open' | 'closed' | 'revealed';
export type PlayerMode = 'solo' | 'team';
export type Plan = 'free' | 'pro';
export type QuestionSource = 'manual' | 'opentdb';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Game {
  gameId: string;
  hostId: string;
  status: GameStatus;
  gameMode: GameMode;
  currentRoundIndex: number;
  currentQuestionIndex: number;
  questionState: QuestionState;
  timerEndsAt: number | null;
  rounds: RoundRef[];
  createdAt: number;
  plan: Plan;
}

export interface RoundRef {
  roundId: string;
  name: string;
}

export interface Player {
  playerId: string;
  displayName: string;
  mode: PlayerMode;
  teamName: string | null;
  totalScore: number;
  roundScores: Record<string, number>;
  joinedAt: number;
}

export interface Team {
  teamName: string;
  memberIds: string[];
  totalScore: number;
  roundScores: Record<string, number>;
}

export interface Answer {
  playerId: string;
  questionId: string;
  selectedOptionIndex: number;
  answeredAt: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface Question {
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  pointValue: number;
  timerSeconds: number;
  category: string;
  source: QuestionSource;
  difficulty?: Difficulty;
  createdAt: number;
}

export interface QuestionBank {
  bankId: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface Round {
  roundId: string;
  name: string;
  questionIds: string[];
  bankId: string;
  createdAt: number;
}

export interface Host {
  hostId: string;
  email: string;
  displayName: string;
  plan: Plan;
  gamesThisMonth: number;
  stripeCustomerId: string | null;
  createdAt: number;
}

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  type: 'solo' | 'team';
  totalScore: number;
  memberCount?: number;
}

export interface OpenTDBQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
