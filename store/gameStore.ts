/**
 * TriviaIRL — Global Zustand Store
 *
 * Single source of truth for all client-side state.
 * Firestore real-time listeners write into this store via actions.
 * Components read from the store — never directly from Firestore.
 *
 * Slices:
 *   - gameSlice        — live game document state
 *   - playersSlice     — live players list
 *   - answersSlice     — live answers for current question
 *   - currentQSlice    — current question (pushed by host to game doc)
 *   - playerSessionSlice — this player's identity + answer state
 *   - hostSlice        — host profile + plan info
 */

import { create } from "zustand";
import type { Game, Player, Answer, Question, Host } from "@/types";

// ─── Game slice ────────────────────────────────────────────────────────────

interface GameSlice {
  game: Game | null;
  gameLoading: boolean;
  setGame: (game: Game | null) => void;
  setGameLoading: (v: boolean) => void;
}

// ─── Players slice ─────────────────────────────────────────────────────────

interface PlayersSlice {
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

// ─── Answers slice ─────────────────────────────────────────────────────────

interface AnswersSlice {
  answers: Answer[];
  setAnswers: (answers: Answer[]) => void;
}

// ─── Current question slice ────────────────────────────────────────────────
// The host pushes the current question (including correct answer index)
// to the game doc when opening a question. Players read this slice.
// correctAnswerIndex is only populated after reveal.

export interface CurrentQuestion {
  questionId: string;
  questionText: string;
  options: string[];
  pointValue: number;
  timerSeconds: number;
  category: string;
  // Revealed after host scores — undefined during open/closed phases
  correctAnswerIndex?: number;
}

interface CurrentQSlice {
  currentQuestion: CurrentQuestion | null;
  setCurrentQuestion: (q: CurrentQuestion | null) => void;
}

// ─── Player session slice ──────────────────────────────────────────────────
// Tracks this specific player's identity and answer for the current question.

interface PlayerSessionSlice {
  playerId: string | null;
  playerName: string | null;
  playerMode: "solo" | "team" | null;
  teamName: string | null;
  selectedOptionIndex: number | null;
  answerLocked: boolean;
  lastAnswerResult: { isCorrect: boolean; pointsEarned: number } | null;
  setPlayerIdentity: (id: string, name: string, mode: "solo" | "team", teamName: string | null) => void;
  setSelectedOption: (index: number | null) => void;
  setAnswerLocked: (locked: boolean) => void;
  setAnswerResult: (result: { isCorrect: boolean; pointsEarned: number } | null) => void;
  resetAnswerState: () => void;
}

// ─── Host slice ────────────────────────────────────────────────────────────

interface HostSlice {
  host: Host | null;
  setHost: (host: Host | null) => void;
}

// ─── Community slice (future) ──────────────────────────────────────────────
// Placeholder for the community question packs feature.
// When built out, this will hold:
//   - browsable community packs (paginated)
//   - the host's published packs
//   - download/install state

interface CommunitySlice {
  // Reserved for community feature — populated in a future phase
  _communityReserved: true;
}

// ─── Combined store ────────────────────────────────────────────────────────

type TriviaStore =
  GameSlice &
  PlayersSlice &
  AnswersSlice &
  CurrentQSlice &
  PlayerSessionSlice &
  HostSlice &
  CommunitySlice;

export const useTriviaStore = create<TriviaStore>()((set, get) => ({
  // ── Game ──
  game: null,
  gameLoading: true,
  setGame: (game) => set({ game }),
  setGameLoading: (v) => set({ gameLoading: v }),

  // ── Players ──
  players: [],
  setPlayers: (players) => set({ players }),

  // ── Answers ──
  answers: [],
  setAnswers: (answers) => set({ answers }),

  // ── Current Question ──
  currentQuestion: null,
  setCurrentQuestion: (q) => set({ currentQuestion: q }),

  // ── Player Session ──
  playerId: null,
  playerName: null,
  playerMode: null,
  teamName: null,
  selectedOptionIndex: null,
  answerLocked: false,
  lastAnswerResult: null,
  setPlayerIdentity: (id, name, mode, teamName) =>
    set({ playerId: id, playerName: name, playerMode: mode, teamName }),
  setSelectedOption: (index) =>
    set({ selectedOptionIndex: index }),
  setAnswerLocked: (locked) =>
    set({ answerLocked: locked }),
  setAnswerResult: (result) =>
    set({ lastAnswerResult: result }),
  resetAnswerState: () =>
    set({ selectedOptionIndex: null, answerLocked: false, lastAnswerResult: null }),

  // ── Host ──
  host: null,
  setHost: (host) => set({ host }),

  // ── Community (reserved) ──
  _communityReserved: true,
}));

// ─── Selectors (memoized access patterns) ─────────────────────────────────

/** True if the game is active and a question is open for answers */
export const selectIsQuestionOpen = (s: TriviaStore) =>
  s.game?.questionState === "open";

/** True if the current player has locked in an answer */
export const selectPlayerAnswered = (s: TriviaStore) =>
  s.answerLocked;

/** Number of players who have submitted answers to the current question */
export const selectAnswerCount = (s: TriviaStore) =>
  s.answers.length;

/** Sorted leaderboard — players by totalScore descending */
export const selectLeaderboard = (s: TriviaStore) =>
  [...s.players].sort((a, b) => b.totalScore - a.totalScore);

/** Answer distribution per option index for the current question */
export const selectAnswerDistribution = (s: TriviaStore): number[] => {
  const q = s.currentQuestion;
  if (!q) return [];
  return q.options.map((_, i) =>
    s.answers.filter((a) => a.selectedOptionIndex === i).length
  );
};
