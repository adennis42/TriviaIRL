"use client";

import { useState, useEffect } from "react";
import { subscribeToAnswers } from "@/lib/firestore";
import type { Answer } from "@/types";

export function useAnswers(gameId: string | null) {
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (!gameId) return;
    const unsub = subscribeToAnswers(gameId, setAnswers);
    return unsub;
  }, [gameId]);

  return { answers };
}
