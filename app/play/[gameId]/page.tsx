"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGame } from "@/lib/hooks/useGame";
import { joinGame } from "@/lib/firestore";
import { Logo } from "@/components/shared/Logo";
import type { Player, PlayerMode } from "@/types";

function PlayerGameView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameId = params?.gameId as string;
  const { game, loading } = useGame(gameId);

  const [playerName] = useState(searchParams.get("name") ?? "");
  const [mode, setMode] = useState<PlayerMode>("solo");
  const [teamName, setTeamName] = useState("");
  const [joined, setJoined] = useState(false);
  const [playerId] = useState(() => crypto.randomUUID());
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!playerName) router.push("/play");
  }, [playerName, router]);

  const handleJoin = async () => {
    if (mode === "team" && !teamName.trim()) return;
    setJoining(true);
    const player: Player = {
      playerId,
      displayName: playerName,
      mode,
      teamName: mode === "team" ? teamName.trim() : null,
      totalScore: 0,
      roundScores: {},
      joinedAt: Date.now(),
    };
    await joinGame(gameId, player);
    setJoined(true);
    setJoining(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span style={{ fontFamily: "var(--font-rajdhani)", color: "var(--yellow)", fontSize: "1.5rem" }}>Loading…</span>
    </div>
  );

  if (!game) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--magenta)", fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem" }}>Game not found.</p>
        <a href="/play" style={{ color: "var(--cyan)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13 }}>← Back</a>
      </div>
    </div>
  );

  /* Mode selection before joining */
  if (!joined) {
    const showTeamInput = game.gameMode !== "solo" && mode === "team";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center halftone" style={{ background: "var(--blk)", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
          <Logo size="md" href="/" />
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginTop: "0.5rem", marginBottom: "1.5rem", fontSize: 14 }}>
            Welcome, <strong style={{ color: "var(--text)" }}>{playerName}</strong>
          </p>

          {game.gameMode !== "solo" && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>How are you playing?</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["solo", "team"] as PlayerMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className="cel-btn"
                    style={{ flex: 1, background: mode === m ? "#1a1a00" : "var(--panel)", border: `3px solid ${mode === m ? "var(--yellow)" : "#000"}`, color: mode === m ? "var(--yellow)" : "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px", borderRadius: 3 }}
                  >
                    {m === "solo" ? "Solo" : "Team"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showTeamInput && (
            <div style={{ marginBottom: "1.25rem" }}>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name"
                maxLength={24}
                style={{ width: "100%", background: "var(--panel)", border: "3px solid #000", boxShadow: "4px 4px 0 #000", color: "var(--text)", fontFamily: "var(--font-barlow)", fontSize: "1rem", textAlign: "center", padding: "12px", borderRadius: 4, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={joining || (showTeamInput && !teamName.trim())}
            className="cel-btn"
            style={{ width: "100%", background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px", borderRadius: 4 }}
          >
            {joining ? "Joining…" : "Join Game →"}
          </button>
        </div>
      </div>
    );
  }

  /* Lobby waiting screen */
  if (game.status === "lobby") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center halftone" style={{ background: "var(--blk)", padding: "2rem" }}>
        <Logo size="md" />
        <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "2rem 2.5rem", textAlign: "center", marginTop: "2rem", maxWidth: 360 }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>⏳</div>
          <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>You&apos;re in!</h2>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 14, marginBottom: "1rem" }}>Waiting for the host to start the game…</p>
          <div style={{ background: "var(--card)", border: "2px solid #000", borderRadius: 3, padding: "0.75rem 1rem" }}>
            <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Playing as</p>
            <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.2rem", fontWeight: 600, color: "var(--yellow)" }}>{playerName}</p>
            {mode === "team" && teamName && (
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, color: "var(--cyan)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Team: {teamName}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* Active game — Phase 4 */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--blk)", padding: "2rem" }}>
      <Logo size="md" />
      <p style={{ color: "var(--yellow)", fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", fontWeight: 700, marginTop: "1.5rem" }}>Game in progress!</p>
      <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginTop: "0.5rem" }}>Live question flow — Phase 4</p>
    </div>
  );
}

export default function PlayerGamePage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--blk)", minHeight: "100vh" }} />}>
      <PlayerGameView />
    </Suspense>
  );
}
