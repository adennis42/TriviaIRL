"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { getRounds, getHost, createGame, incrementGamesThisMonth } from "@/lib/firestore";
import { generateUniqueCode } from "@/lib/gameHelpers";
import { db } from "@/lib/firebase";
import { Logo } from "@/components/shared/Logo";
import type { Round, GameMode, RoundRef } from "@/types";

const MODES: { value: GameMode; label: string; desc: string }[] = [
  { value: "solo",  label: "Solo",  desc: "Every player competes individually" },
  { value: "teams", label: "Teams", desc: "Players form teams and collaborate" },
  { value: "mixed", label: "Mixed", desc: "Solo + team players in the same game" },
];

export default function NewGamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundIds, setSelectedRoundIds] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("solo");
  const [creating, setCreating] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getRounds(user.uid).then((r) => { setRounds(r); setFetching(false); });
  }, [user]);

  const toggleRound = (id: string) => {
    setSelectedRoundIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const moveRound = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= selectedRoundIds.length) return;
    setSelectedRoundIds((prev) => {
      const arr = [...prev];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || selectedRoundIds.length === 0) { setError("Select at least one round."); return; }
    setCreating(true); setError("");
    try {
      const host = await getHost(user.uid);
      const plan = host?.plan ?? "free";

      if (plan === "free" && (host?.gamesThisMonth ?? 0) >= 3) {
        setError("Free plan limit reached (3 games/month). Upgrade to Pro for unlimited games.");
        setCreating(false); return;
      }

      const code = await generateUniqueCode(db);
      const roundRefs: RoundRef[] = selectedRoundIds.map((id) => {
        const r = rounds.find((rnd) => rnd.roundId === id)!;
        return { roundId: r.roundId, name: r.name };
      });

      await createGame(user.uid, code, gameMode, roundRefs, plan);
      await incrementGamesThisMonth(user.uid);
      router.push(`/host/game/${code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game");
      setCreating(false);
    }
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span style={{ fontFamily: "var(--font-rajdhani)", color: "var(--yellow)", fontSize: "1.5rem" }}>Loading…</span>
    </div>
  );

  const selectedRounds = selectedRoundIds.map((id) => rounds.find((r) => r.roundId === id)!).filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <Link href="/host/dashboard" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>← Dashboard</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 2rem" }}>
        <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2.25rem", fontWeight: 700, marginBottom: "2rem" }}>Create New Game</h1>

        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Game Mode */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>Game Mode</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setGameMode(m.value)}
                  className="cel-btn"
                  style={{
                    background: gameMode === m.value ? "#1a1a00" : "var(--panel)",
                    border: `3px solid ${gameMode === m.value ? "var(--yellow)" : "#000"}`,
                    color: gameMode === m.value ? "var(--yellow)" : "var(--muted)",
                    padding: "1rem",
                    borderRadius: 3,
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontFamily: "var(--font-barlow)", fontSize: 12, color: "var(--muted)" }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Round selection */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>
              Rounds ({selectedRoundIds.length} selected)
            </label>
            {rounds.length === 0 ? (
              <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 3, padding: "1.5rem", textAlign: "center" }}>
                <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)" }}>No rounds yet. <Link href="/host/rounds" style={{ color: "var(--cyan)" }}>Create rounds first.</Link></p>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "1.5rem" }}>
                {/* Available */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Available</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {rounds.filter((r) => !selectedRoundIds.includes(r.roundId)).map((r) => (
                      <div key={r.roundId} onClick={() => toggleRound(r.roundId)} className="cel-card" style={{ background: "var(--panel)", borderRadius: 3, padding: "0.75rem 1rem", cursor: "pointer" }}>
                        <p style={{ fontFamily: "var(--font-barlow)", fontSize: 14 }}>{r.name}</p>
                        <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11 }}>{r.questionIds.length} questions</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Selected in order */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "0.5rem" }}>Game Order</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {selectedRounds.map((r, i) => (
                      <div key={r.roundId} className="cel-card" style={{ background: "#1a1a00", border: "2.5px solid var(--yellow)", borderRadius: 3, padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ color: "var(--yellow)", fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, fontSize: 13, minWidth: 20 }}>{i + 1}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "var(--font-barlow)", fontSize: 14 }}>{r.name}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button type="button" onClick={() => moveRound(i, -1)} style={{ background: "var(--card)", border: "1.5px solid #000", color: "var(--muted)", fontSize: 10, padding: "2px 5px", cursor: "pointer", borderRadius: 2 }}>▲</button>
                          <button type="button" onClick={() => moveRound(i, 1)} style={{ background: "var(--card)", border: "1.5px solid #000", color: "var(--muted)", fontSize: 10, padding: "2px 5px", cursor: "pointer", borderRadius: 2 }}>▼</button>
                          <button type="button" onClick={() => toggleRound(r.roundId)} style={{ background: "var(--magenta)", border: "1.5px solid #000", color: "#fff", fontSize: 10, padding: "2px 5px", cursor: "pointer", borderRadius: 2 }}>✕</button>
                        </div>
                      </div>
                    ))}
                    {selectedRounds.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13, fontFamily: "var(--font-barlow)" }}>Click rounds on the left to add them.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && <p style={{ color: "var(--magenta)", fontFamily: "var(--font-barlow)", fontSize: 14 }}>{error}</p>}

          <button
            type="submit"
            disabled={creating || selectedRoundIds.length === 0}
            className="cel-btn"
            style={{ background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px", borderRadius: 3 }}
          >
            {creating ? "Creating Game…" : "Create Game & Open Lobby →"}
          </button>
        </form>
      </div>
    </div>
  );
}
