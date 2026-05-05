"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { getRound, getQuestions, updateRound } from "@/lib/firestore";
import { Logo } from "@/components/shared/Logo";
import type { Round, Question } from "@/types";

export default function RoundBuilderPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const roundId = params?.roundId as string;

  const [round, setRound] = useState<Round | null>(null);
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !roundId) return;
    getRound(user.uid, roundId).then(async (r) => {
      if (!r) { router.push("/host/rounds"); return; }
      setRound(r);
      setSelectedIds(r.questionIds);
      const qs = await getQuestions(user.uid, r.bankId);
      setBankQuestions(qs);
      setFetching(false);
    });
  }, [user, roundId, router]);

  const toggleQuestion = (qId: string) => {
    setSelectedIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    setSelectedIds((prev) => { const arr = [...prev]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; return arr; });
  };

  const moveDown = (i: number) => {
    setSelectedIds((prev) => { if (i >= prev.length - 1) return prev; const arr = [...prev]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; return arr; });
  };

  const handleSave = async () => {
    if (!user || !round) return;
    setSaving(true);
    await updateRound(user.uid, roundId, { questionIds: selectedIds });
    setSaving(false);
    router.push("/host/rounds");
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span className="font-display text-yellow text-xl">Loading…</span>
    </div>
  );

  const selectedQuestions = selectedIds.map((id) => bankQuestions.find((q) => q.questionId === id)).filter(Boolean) as Question[];
  const unselected = bankQuestions.filter((q) => !selectedIds.includes(q.questionId));

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <Link href="/host/rounds" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>← Rounds</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700 }}>{round?.name}</h1>
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13 }}>{selectedIds.length} questions selected</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="cel-btn" style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 24px", borderRadius: 3 }}>
            {saving ? "Saving…" : "Save Round"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Left — available questions */}
          <div>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>
              Available ({unselected.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxHeight: "70vh", overflow: "auto" }}>
              {unselected.map((q) => (
                <div key={q.questionId} className="cel-card" style={{ background: "var(--panel)", borderRadius: 3, padding: "0.75rem 1rem", cursor: "pointer" }} onClick={() => toggleQuestion(q.questionId)}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: 13, marginBottom: 4 }}>{q.questionText}</p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span style={{ color: "var(--yellow)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, textTransform: "uppercase" }}>{q.pointValue}pts</span>
                    <span style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11 }}>{q.timerSeconds}s</span>
                    {q.category && <span style={{ color: "var(--cyan)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, textTransform: "uppercase" }}>{q.category}</span>}
                  </div>
                </div>
              ))}
              {unselected.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13, padding: "1rem 0" }}>All questions added to round.</p>}
            </div>
          </div>

          {/* Right — selected questions in order */}
          <div>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "0.75rem" }}>
              In Round ({selectedQuestions.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxHeight: "70vh", overflow: "auto" }}>
              {selectedQuestions.map((q, i) => (
                <div key={q.questionId} className="cel-card" style={{ background: "#1a1a00", border: "2.5px solid var(--yellow)", borderRadius: 3, padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--yellow)", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, minWidth: 24 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: 13, marginBottom: 4 }}>{q.questionText}</p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "var(--yellow)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, textTransform: "uppercase" }}>{q.pointValue}pts</span>
                      <span style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11 }}>{q.timerSeconds}s</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <button onClick={() => moveUp(i)} style={{ background: "var(--card)", border: "1.5px solid #000", color: "var(--muted)", fontSize: 10, padding: "2px 6px", cursor: "pointer", borderRadius: 2 }}>▲</button>
                    <button onClick={() => moveDown(i)} style={{ background: "var(--card)", border: "1.5px solid #000", color: "var(--muted)", fontSize: 10, padding: "2px 6px", cursor: "pointer", borderRadius: 2 }}>▼</button>
                    <button onClick={() => toggleQuestion(q.questionId)} style={{ background: "var(--magenta)", border: "1.5px solid #000", color: "#fff", fontSize: 10, padding: "2px 6px", cursor: "pointer", borderRadius: 2 }}>✕</button>
                  </div>
                </div>
              ))}
              {selectedQuestions.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13, padding: "1rem 0" }}>Click questions on the left to add them.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
