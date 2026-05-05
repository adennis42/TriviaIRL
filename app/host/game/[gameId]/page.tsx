"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useGame } from "@/lib/hooks/useGame";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { useAnswers } from "@/lib/hooks/useAnswers";
import { updateGame, getRound, getQuestions } from "@/lib/firestore";
import { useTriviaStore, selectLeaderboard, selectAnswerDistribution } from "@/store/gameStore";
import { Logo } from "@/components/shared/Logo";
import { QRCodePanel } from "@/components/shared/QRCodePanel";
import { Timer } from "@/components/shared/Timer";
import type { Question } from "@/types";

export default function HostGamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const gameId = params?.gameId as string;
  const { game, gameLoading } = useGame(gameId);
  const { players } = usePlayers(gameId);
  const { answers } = useAnswers(gameId);
  const leaderboard = useTriviaStore(selectLeaderboard);
  const answerDistribution = useTriviaStore(selectAnswerDistribution);

  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const joinUrl = `${appUrl}/play/${gameId}`;

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Load questions for current round whenever game advances
  useEffect(() => {
    if (!game || !user || game.status === "lobby") return;
    const roundRef = game.rounds[game.currentRoundIndex];
    if (!roundRef) return;
    setLoadingQ(true);
    getRound(user.uid, roundRef.roundId).then(async (round) => {
      if (!round) return;
      const qs = await getQuestions(user.uid, round.bankId);
      // Sort by questionIds order
      const ordered = round.questionIds
        .map((id) => qs.find((q) => q.questionId === id))
        .filter((q): q is Question => !!q);
      setQuestions(ordered);
      setLoadingQ(false);
    });
  }, [game?.currentRoundIndex, game?.status, user]);

  const currentQ = questions[game?.currentQuestionIndex ?? 0] ?? null;
  const currentAnswers = answers.filter((a) => a.questionId === currentQ?.questionId);
  const answerCounts = currentQ
    ? currentQ.options.map((_, i) => currentAnswers.filter((a) => a.selectedOptionIndex === i).length)
    : [];

  const handleStart = async () => {
    setStarting(true);
    await updateGame(gameId, { status: "active", questionState: "waiting" });
    setStarting(false);
  };

  const handleOpenQuestion = async () => {
    if (!currentQ) return;
    const timerEndsAt = Date.now() + currentQ.timerSeconds * 1000;
    // Push question data (without correctAnswerIndex) so players can see the question
    const questionData = {
      questionId: currentQ.questionId,
      questionText: currentQ.questionText,
      options: currentQ.options,
      pointValue: currentQ.pointValue,
      timerSeconds: currentQ.timerSeconds,
      category: currentQ.category,
      // correctAnswerIndex intentionally omitted — added after reveal
    };
    await updateGame(gameId, {
      questionState: "open",
      timerEndsAt,
      currentQuestionData: questionData,
    } as Parameters<typeof updateGame>[1] & { currentQuestionData: unknown });
  };

  const handleCloseEarly = async () => {
    await updateGame(gameId, { questionState: "closed", timerEndsAt: null });
  };

  const handleAutoClose = useCallback(() => {
    if (game?.questionState === "open") {
      updateGame(gameId, { questionState: "closed", timerEndsAt: null });
    }
  }, [game?.questionState, gameId]);

  const handleReveal = async () => {
    if (!currentQ || !game) return;
    setRevealing(true);
    try {
      await fetch("/api/scoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          questionId: currentQ.questionId,
          correctAnswerIndex: currentQ.correctAnswerIndex,
          pointValue: currentQ.pointValue,
          timerSeconds: currentQ.timerSeconds,
          timerEndsAt: game.timerEndsAt ?? Date.now(),
        }),
      });
      // Now safe to reveal correctAnswerIndex to players
      await updateGame(gameId, {
        questionState: "revealed",
        currentQuestionData: {
          questionId: currentQ.questionId,
          questionText: currentQ.questionText,
          options: currentQ.options,
          pointValue: currentQ.pointValue,
          timerSeconds: currentQ.timerSeconds,
          category: currentQ.category,
          correctAnswerIndex: currentQ.correctAnswerIndex,
        },
      } as Parameters<typeof updateGame>[1] & { currentQuestionData: unknown });
    } finally {
      setRevealing(false);
    }
  };

  const handleNext = async () => {
    if (!game) return;
    setAdvancing(true);
    const round = game.rounds[game.currentRoundIndex];
    const isLastQ = game.currentQuestionIndex >= questions.length - 1;
    const isLastRound = game.currentRoundIndex >= game.rounds.length - 1;

    if (isLastQ && isLastRound) {
      await updateGame(gameId, { status: "ended", questionState: "waiting" });
    } else if (isLastQ) {
      await updateGame(gameId, {
        currentRoundIndex: game.currentRoundIndex + 1,
        currentQuestionIndex: 0,
        questionState: "waiting",
        timerEndsAt: null,
      });
    } else {
      await updateGame(gameId, {
        currentQuestionIndex: game.currentQuestionIndex + 1,
        questionState: "waiting",
        timerEndsAt: null,
      });
    }
    setAdvancing(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(gameId).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
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

  const statusColor = game.status === "active" ? "var(--green)" : game.status === "ended" ? "var(--magenta)" : "var(--muted)";

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: statusColor }}>● {game.status.toUpperCase()}</span>
            <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.25rem", fontWeight: 700, color: "var(--yellow)", letterSpacing: "0.12em" }}>{gameId}</span>
            <button onClick={copyCode} style={{ background: "none", border: "none", color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>
      </nav>

      {/* ── LOBBY ── */}
      {game.status === "lobby" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Game Lobby</h1>
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginBottom: "2rem" }}>Share the code or QR to get players in.</p>

            <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem", marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Game Code</p>
              <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "3.5rem", fontWeight: 700, color: "var(--yellow)", letterSpacing: "0.15em" }}>{gameId}</span>
            </div>

            <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem", marginBottom: "1.25rem", display: "flex", gap: "2rem" }}>
              <div><p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Mode</p><p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, color: "var(--cyan)", textTransform: "uppercase" }}>{game.gameMode}</p></div>
              <div><p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Rounds</p><p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600 }}>{game.rounds.length}</p></div>
              <div><p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Players</p><p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, color: "var(--yellow)" }}>{players.length}</p></div>
            </div>

            <button onClick={handleStart} disabled={starting || players.length === 0} className="cel-btn" style={{ width: "100%", background: players.length === 0 ? "var(--card)" : "var(--orange)", color: players.length === 0 ? "var(--muted)" : "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px", borderRadius: 3 }}>
              {starting ? "Starting…" : players.length === 0 ? "Waiting for Players…" : `Start Game (${players.length} player${players.length !== 1 ? "s" : ""})`}
            </button>

            {/* Player list */}
            <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem", marginTop: "1rem" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>Players ({players.length})</p>
              {players.length === 0 ? <p style={{ color: "var(--muted)", fontSize: 13 }}>None yet…</p> :
                players.map((p) => (
                  <div key={p.playerId} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0.75rem", background: "var(--card)", border: "1.5px solid #000", borderRadius: 3, marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: 14 }}>{p.displayName}</span>
                    <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, color: p.mode === "team" ? "var(--cyan)" : "var(--muted)", textTransform: "uppercase" }}>{p.mode === "team" ? p.teamName : "Solo"}</span>
                  </div>
                ))
              }
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <QRCodePanel value={joinUrl} size={220} />
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.08em", marginTop: "0.75rem" }}>Scan to join</p>
          </div>
        </div>
      )}

      {/* ── ACTIVE ── */}
      {game.status === "active" && (
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>

          {/* Left — Question panel */}
          <div>
            {/* Round + question position */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                Round {game.currentRoundIndex + 1}/{game.rounds.length} · Q{game.currentQuestionIndex + 1}/{questions.length}
              </span>
              <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px", border: "2px solid #000", borderRadius: 2, background: game.questionState === "open" ? "var(--green)" : game.questionState === "revealed" ? "var(--cyan)" : "var(--card)", color: game.questionState === "open" ? "#000" : game.questionState === "revealed" ? "#000" : "var(--muted)" }}>
                {game.questionState.toUpperCase()}
              </span>
            </div>

            {loadingQ ? (
              <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "3rem", textAlign: "center" }}>
                <p style={{ color: "var(--muted)" }}>Loading questions…</p>
              </div>
            ) : currentQ ? (
              <>
                {/* Question */}
                <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem", lineHeight: 1.4 }}>{currentQ.questionText}</p>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", fontWeight: 700, color: "var(--yellow)" }}>{currentQ.pointValue}pts</p>
                    </div>
                  </div>

                  {/* Options */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    {currentQ.options.map((opt, i) => {
                      const isCorrect = i === currentQ.correctAnswerIndex;
                      const count = answerCounts[i] ?? 0;
                      const showResult = game.questionState === "revealed";
                      return (
                        <div key={i} style={{ background: showResult ? (isCorrect ? "#002200" : "var(--card)") : "var(--card)", border: `2.5px solid ${showResult && isCorrect ? "var(--green)" : "#000"}`, borderRadius: 3, padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: "var(--font-barlow)", fontSize: 14, color: showResult && isCorrect ? "var(--green)" : "var(--text)" }}>{opt}</span>
                          {(game.questionState === "closed" || showResult) && (
                            <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, color: showResult && isCorrect ? "var(--green)" : "var(--muted)" }}>{count}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timer */}
                {(game.questionState === "open" || game.questionState === "closed") && (
                  <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1rem 1.5rem", marginBottom: "1rem" }}>
                    <Timer
                      timerEndsAt={game.timerEndsAt}
                      totalSeconds={currentQ.timerSeconds}
                      onExpired={handleAutoClose}
                    />
                  </div>
                )}

                {/* Controls */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {game.questionState === "waiting" && (
                    <button onClick={handleOpenQuestion} className="cel-btn" style={{ background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", borderRadius: 3 }}>
                      Open Question →
                    </button>
                  )}
                  {game.questionState === "open" && (
                    <button onClick={handleCloseEarly} className="cel-btn" style={{ background: "var(--magenta)", color: "#fff", fontFamily: "var(--font-barlow-condensed)", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", borderRadius: 3 }}>
                      Close Early
                    </button>
                  )}
                  {game.questionState === "closed" && (
                    <button onClick={handleReveal} disabled={revealing} className="cel-btn" style={{ background: "var(--cyan)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", borderRadius: 3 }}>
                      {revealing ? "Scoring…" : "Reveal Answer"}
                    </button>
                  )}
                  {game.questionState === "revealed" && (
                    <button onClick={handleNext} disabled={advancing} className="cel-btn" style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", borderRadius: 3 }}>
                      {advancing ? "…" : game.currentQuestionIndex >= questions.length - 1 && game.currentRoundIndex >= game.rounds.length - 1 ? "End Game" : "Next Question →"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "3rem", textAlign: "center" }}>
                <p style={{ color: "var(--muted)" }}>No questions found for this round.</p>
              </div>
            )}
          </div>

          {/* Right — Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Submission tracker */}
            <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>Answers In</p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2.5rem", fontWeight: 700, color: "var(--yellow)", lineHeight: 1 }}>
                {currentAnswers.length}<span style={{ color: "var(--muted)", fontSize: "1.25rem" }}>/{players.length}</span>
              </p>
            </div>

            {/* Leaderboard */}
            <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem", flex: 1 }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>Standings</p>
              {[...players]
                .sort((a, b) => b.totalScore - a.totalScore)
                .slice(0, 8)
                .map((p, i) => (
                  <div key={p.playerId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0.75rem", background: i === 0 ? "#1a1a00" : "var(--card)", border: `1.5px solid ${i === 0 ? "var(--yellow)" : "#000"}`, borderRadius: 3, marginBottom: 4 }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, color: "var(--muted)", minWidth: 16 }}>#{i + 1}</span>
                      <span style={{ fontFamily: "var(--font-barlow)", fontSize: 13 }}>{p.displayName}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1rem", fontWeight: 700, color: "var(--yellow)" }}>{p.totalScore}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ENDED ── */}
      {game.status === "ended" && (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "3rem", fontWeight: 700, color: "var(--yellow)", marginBottom: "0.5rem" }}>Game Over!</h1>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginBottom: "2rem" }}>Final Standings</p>
          <div style={{ textAlign: "left" }}>
            {[...players]
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((p, i) => (
                <div key={p.playerId} className="cel-card" style={{ background: i === 0 ? "#1a1a00" : "var(--panel)", border: `2.5px solid ${i === 0 ? "var(--yellow)" : "#000"}`, borderRadius: 4, padding: "1rem 1.25rem", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", fontWeight: 700, color: i === 0 ? "var(--yellow)" : "var(--muted)", minWidth: 32 }}>#{i + 1}</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: 15 }}>{p.displayName}</p>
                      {p.mode === "team" && p.teamName && <p style={{ color: "var(--cyan)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, textTransform: "uppercase" }}>{p.teamName}</p>}
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.75rem", fontWeight: 700, color: "var(--yellow)" }}>{p.totalScore}</span>
                </div>
              ))}
          </div>
          <button onClick={() => router.push("/host/game/new")} className="cel-btn" style={{ marginTop: "2rem", background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 3 }}>
            New Game →
          </button>
        </div>
      )}
    </div>
  );
}
