"use client";

import { useEffect } from "react";
import { subscribeToAnswers } from "@/lib/firestore";
import { useTriviaStore } from "@/store/gameStore";

export function useAnswers(gameId: string | null) {
  const setAnswers = useTriviaStore((s) => s.setAnswers);
  const answers    = useTriviaStore((s) => s.answers);

  useEffect(() => {
    if (!gameId) return;
    const unsub = subscribeToAnswers(gameId, setAnswers);
    return unsub;
  }, [gameId, setAnswers]);

  return { answers };
}
