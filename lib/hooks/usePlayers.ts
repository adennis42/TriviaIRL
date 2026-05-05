"use client";

import { useState, useEffect } from "react";
import { subscribeToPlayers } from "@/lib/firestore";
import type { Player } from "@/types";

export function usePlayers(gameId: string | null) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!gameId) return;
    const unsub = subscribeToPlayers(gameId, setPlayers);
    return unsub;
  }, [gameId]);

  return { players };
}
