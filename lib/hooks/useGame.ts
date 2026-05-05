"use client";

import { useState, useEffect } from "react";
import { subscribeToGame } from "@/lib/firestore";
import type { Game } from "@/types";

export function useGame(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) { setLoading(false); return; }
    const unsub = subscribeToGame(gameId, (g) => {
      setGame(g);
      setLoading(false);
    });
    return unsub;
  }, [gameId]);

  return { game, loading };
}
