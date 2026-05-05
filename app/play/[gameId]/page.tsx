"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGame } from "@/lib/hooks/useGame";
import { joinGame } from "@/lib/firestore";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Logo } from "@/components/shared/Logo";
import { Timer } from "@/components/shared/Timer";
import type { Player, PlayerMode, Question } from "@/types";

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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Track which question we've already submitted for
  const submittedForRef = useRef<string | null>(null);

  // Reset answer state when question changes
  useEffect(() => {
    if (game?.questionState === "waiting") {
      setSelectedOption(null);
      setLocked(false);
      submittedForRef.current = null;
    }
  }, [game?.currentQuestionIndex, game?.questionState]);

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
    if (mode === "team" && teamName.trim()) {
      const teamRef = doc(db, "games", gameId, "teams", teamName.trim());
      await setDoc(teamRef, {
        teamName: teamName.trim(),
        memberIds: [playerId],
        totalScore: 0,
        roundScores: {},
      }, { merge: true });
    }
    setJoined(true);
    setJoining(false);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || locked || !game || game.questionState !== "open") return;
    if (submittedForRef.current === `${game.currentRoundIndex}-${game.currentQuestionIndex}`) return;
    setSubmitting(true);
    setLocked(true);
    submittedForRef.current = `${game.currentRoundIndex}-${game.currentQuestionIndex}`;

    const answerKey = `${game.rounds[game.currentRoundIndex]?.roundId ?? ""}_q${game.currentQuestionIndex}_${playerId}`;
    const answerRef = doc(db, "games", gameId, "answers", answerKey);
    await setDoc(answerRef, {
      playerId,
      questionId: `${game.rounds[game.currentRoundIndex]?.roundId ?? ""}_q${game.currentQuestionIndex}`,
      selectedOptionIndex: selectedOption,
      answeredAt: Date.now(),
      isCorrect: false,   // server will update
      pointsEarned: 0,    // server will update
    });
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span style={{ fontFamily: "var(--font-rajdhani)", color: "var(--yellow)", fontSize: "1.5rem" }}>Loading…</span>
    </div>
  );

  if (!game) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--magenta)", fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", marginBottom: "1rem" }}>Game not found.</p>
        <a href="/play" style={{ color: "var(--cyan)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13 }}>← Back</a>
      </div>
    </div>
  );

  /* Mode selection screen */
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
                  <button key={m} type="button" onClick={() => setMode(m)} className="cel-btn"
                    style={{ flex: 1, background: mode === m ? "#1a1a00" : "var(--panel)", border: `3px solid ${mode === m ? "var(--yellow)" : "#000"}`, color: mode === m ? "var(--yellow)" : "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px", borderRadius: 3 }}>
                    {m === "solo" ? "Solo" : "Team"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showTeamInput && (
            <div style={{ marginBottom: "1.25rem" }}>
              <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name" maxLength={24}
                style={{ width: "100%", background: "var(--panel)", border: "3px solid #000", boxShadow: "4px 4px 0 #000", color: "var(--text)", fontFamily: "var(--font-barlow)", fontSize: "1rem", textAlign: "center", padding: "12px", borderRadius: 4, outline: "none", boxSizing: "border-box" }} />
            </div>
          )}

          <button onClick={handleJoin} disabled={joining || (showTeamInput && !teamName.trim())} className="cel-btn"
            style={{ width: "100%", background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px", borderRadius: 4 }}>
            {joining ? "Joining…" : "Join Game →"}
          </button>
        </div>
      </div>
    );
  }

  /* Lobby waiting */
  if (game.status === "lobby") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center halftone" style={{ background: "var(--blk)", padding: "2rem" }}>
        <Logo size="md" />
        <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "2rem 2.5rem", textAlign: "center", marginTop: "2rem", maxWidth: 360 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⏳</div>
          <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>You&apos;re in!</h2>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 14, marginBottom: "1rem" }}>Waiting for the host to start…</p>
          <div style={{ background: "var(--card)", border: "2px solid #000", borderRadius: 3, padding: "0.75rem 1rem" }}>
            <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Playing as</p>
            <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.2rem", fontWeight: 600, color: "var(--yellow)" }}>{playerName}</p>
            {mode === "team" && teamName && <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, color: "var(--cyan)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>Team: {teamName}</p>}
          </div>
        </div>
      </div>
    );
  }

  /* Game ended */
  if (game.status === "ended") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--blk)", padding: "2rem" }}>
        <Logo size="md" />
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "3rem", fontWeight: 700, color: "var(--yellow)", marginBottom: "0.5rem" }}>Game Over!</h1>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)" }}>Thanks for playing, {playerName}!</p>
        </div>
      </div>
    );
  }

  /* Active game */
  const qState = game.questionState;

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "var(--blk)", padding: "1.5rem 1rem", maxWidth: 440, margin: "0 auto" }}>
      <Logo size="sm" />

      <div style={{ width: "100%", marginTop: "1.5rem" }}>
        {/* Round / question info */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
            Round {game.currentRoundIndex + 1} · Q{game.currentQuestionIndex + 1}
          </span>
          <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: locked ? "var(--cyan)" : "var(--muted)" }}>
            {locked ? "Locked In ✓" : playerName}
          </span>
        </div>

        {/* Waiting state */}
        {qState === "waiting" && (
          <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "3rem 2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", fontWeight: 600, color: "var(--muted)" }}>Get ready…</p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: 13, color: "var(--muted)", marginTop: "0.5rem" }}>Next question coming up</p>
          </div>
        )}

        {/* Open state — show question + answers */}
        {(qState === "open" || qState === "closed") && (
          <>
            {game.timerEndsAt && (
              <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1rem 1.5rem", marginBottom: "1rem" }}>
                <Timer timerEndsAt={game.timerEndsAt} totalSeconds={30} />
              </div>
            )}

            <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", lineHeight: 1.5 }}>
                {/* We don't expose the full question text client-side in prod — just placeholder */}
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Question {game.currentQuestionIndex + 1}</span>
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {["A", "B", "C", "D"].map((letter, i) => {
                const isSelected = selectedOption === i;
                return (
                  <button
                    key={i}
                    onClick={() => { if (!locked && qState === "open") setSelectedOption(i); }}
                    disabled={locked || qState !== "open"}
                    className="cel-btn"
                    style={{
                      background: isSelected ? "#1a1a00" : "var(--panel)",
                      border: `3px solid ${isSelected ? "var(--yellow)" : "#000"}`,
                      color: isSelected ? "var(--yellow)" : "var(--text)",
                      fontFamily: "var(--font-barlow-condensed)",
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      padding: "18px 16px",
                      borderRadius: 4,
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      opacity: locked && !isSelected ? 0.4 : 1,
                    }}
                  >
                    <span style={{ background: isSelected ? "var(--yellow)" : "var(--card)", color: isSelected ? "#000" : "var(--muted)", borderRadius: 2, padding: "2px 8px", fontFamily: "var(--font-rajdhani)", fontSize: 14, fontWeight: 700, minWidth: 28, textAlign: "center" }}>{letter}</span>
                    Option {letter}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && !locked && qState === "open" && (
              <button onClick={handleSubmitAnswer} disabled={submitting} className="cel-btn"
                style={{ width: "100%", marginTop: "1rem", background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "16px", borderRadius: 4 }}>
                {submitting ? "Locking In…" : "Lock In Answer →"}
              </button>
            )}

            {locked && (
              <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem", marginTop: "1rem", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.25rem", fontWeight: 600, color: "var(--cyan)" }}>Answer locked in!</p>
                <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13, marginTop: 4 }}>Waiting for host to reveal…</p>
              </div>
            )}
          </>
        )}

        {/* Revealed state */}
        {qState === "revealed" && (
          <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Answer Revealed</p>
            <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.25rem", fontWeight: 600, color: "var(--yellow)" }}>
              {locked ? "Your answer is locked in!" : "You didn't answer in time."}
            </p>
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13, marginTop: "0.5rem" }}>
              Waiting for next question…
            </p>
          </div>
        )}
      </div>
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
