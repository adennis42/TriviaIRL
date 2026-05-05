"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useGame } from "@/lib/hooks/useGame";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { updateGame } from "@/lib/firestore";
import { Logo } from "@/components/shared/Logo";
import { QRCodePanel } from "@/components/shared/QRCodePanel";

export default function HostGamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const gameId = params?.gameId as string;
  const { game, loading: gameLoading } = useGame(gameId);
  const { players } = usePlayers(gameId);
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const joinUrl = `${appUrl}/play/${gameId}`;

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleStart = async () => {
    if (!game) return;
    setStarting(true);
    await updateGame(gameId, { status: "active", questionState: "waiting" });
    setStarting(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(gameId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading || gameLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span style={{ fontFamily: "var(--font-rajdhani)", color: "var(--yellow)", fontSize: "1.5rem" }}>Loading…</span>
    </div>
  );

  if (!game) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span style={{ fontFamily: "var(--font-rajdhani)", color: "var(--magenta)", fontSize: "1.5rem" }}>Game not found.</span>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: game.status === "active" ? "var(--green)" : "var(--muted)" }}>
              ● {game.status.toUpperCase()}
            </span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem" }}>
        {game.status === "lobby" ? (
          /* ── Lobby View ── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Game Lobby</h1>
              <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginBottom: "2rem" }}>Share the code or QR — players join at {appUrl}/play</p>

              {/* Game Code */}
              <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem", marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Game Code</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "3.5rem", fontWeight: 700, color: "var(--yellow)", letterSpacing: "0.15em" }}>{gameId}</span>
                  <button onClick={copyCode} className="cel-btn" style={{ background: copied ? "var(--green)" : "var(--card)", color: copied ? "#000" : "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 14px", borderRadius: 3 }}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Game info */}
              <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Mode</p>
                    <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, color: "var(--cyan)", textTransform: "uppercase" }}>{game.gameMode}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Rounds</p>
                    <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600 }}>{game.rounds.length}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Players</p>
                    <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, color: "var(--yellow)" }}>{players.length}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={starting || players.length === 0}
                className="cel-btn"
                style={{ width: "100%", background: players.length === 0 ? "var(--card)" : "var(--orange)", color: players.length === 0 ? "var(--muted)" : "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px", borderRadius: 3 }}
              >
                {starting ? "Starting…" : players.length === 0 ? "Waiting for Players…" : `Start Game (${players.length} player${players.length !== 1 ? "s" : ""})`}
              </button>
            </div>

            <div>
              {/* QR Code */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
                <QRCodePanel value={joinUrl} size={220} />
                <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.08em", marginTop: "0.75rem" }}>Scan to join</p>
              </div>

              {/* Player list */}
              <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
                  Players Joined ({players.length})
                </p>
                {players.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13 }}>No players yet…</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {players.map((p) => (
                      <div key={p.playerId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", background: "var(--card)", border: "1.5px solid #000", borderRadius: 3 }}>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: 14 }}>{p.displayName}</span>
                        <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: p.mode === "team" ? "var(--cyan)" : "var(--muted)" }}>
                          {p.mode === "team" ? p.teamName ?? "Team" : "Solo"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── Active Game Placeholder ── */
          <div style={{ textAlign: "center", paddingTop: "4rem" }}>
            <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700, color: "var(--yellow)", marginBottom: "1rem" }}>Game Active</h1>
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)" }}>Live game controls — Phase 4</p>
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginTop: "0.5rem" }}>Code: <strong style={{ color: "var(--yellow)" }}>{gameId}</strong> · {players.length} players</p>
          </div>
        )}
      </div>
    </div>
  );
}
