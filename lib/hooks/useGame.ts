"use client";

import { useEffect } from "react";
import { subscribeToGame } from "@/lib/firestore";
import { useTriviaStore } from "@/store/gameStore";
import type { Game } from "@/types";

/**
 * Subscribes to the game document and writes updates into the Zustand store.
 * Also syncs currentQuestion from game.currentQuestionData when present.
 */
export function useGame(gameId: string | null) {
  const setGame        = useTriviaStore((s) => s.setGame);
  const setGameLoading = useTriviaStore((s) => s.setGameLoading);
  const setCurrentQuestion = useTriviaStore((s) => s.setCurrentQuestion);
  const resetAnswerState   = useTriviaStore((s) => s.resetAnswerState);

  // Previous question state ref to detect transitions
  const game        = useTriviaStore((s) => s.game);
  const gameLoading = useTriviaStore((s) => s.gameLoading);

  useEffect(() => {
    if (!gameId) { setGameLoading(false); return; }

    const unsub = subscribeToGame(gameId, (incoming: Game | null) => {
      const prev = game;

      // Reset player answer state when a new question opens
      if (
        prev &&
        incoming &&
        (prev.currentQuestionIndex !== incoming.currentQuestionIndex ||
          prev.currentRoundIndex   !== incoming.currentRoundIndex ||
          (prev.questionState !== "waiting" && incoming.questionState === "waiting"))
      ) {
        resetAnswerState();
      }

      // Sync currentQuestion from embedded game data (if host pushed it)
      const raw = incoming as (Game & { currentQuestionData?: unknown }) | null;
      if (raw?.currentQuestionData) {
        setCurrentQuestion(raw.currentQuestionData as import("@/store/gameStore").CurrentQuestion);
      } else if (incoming?.questionState === "waiting") {
        setCurrentQuestion(null);
      }

      setGame(incoming);
      setGameLoading(false);
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  return { game, gameLoading };
}
