"use client";

import { useEffect } from "react";
import { subscribeToPlayers } from "@/lib/firestore";
import { useTriviaStore } from "@/store/gameStore";

export function usePlayers(gameId: string | null) {
  const setPlayers = useTriviaStore((s) => s.setPlayers);
  const players    = useTriviaStore((s) => s.players);

  useEffect(() => {
    if (!gameId) return;
    const unsub = subscribeToPlayers(gameId, setPlayers);
    return unsub;
  }, [gameId, setPlayers]);

  return { players };
}
