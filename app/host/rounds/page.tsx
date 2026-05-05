"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { getRounds, getBanks, createRound, deleteRound } from "@/lib/firestore";
import { Logo } from "@/components/shared/Logo";
import type { Round, QuestionBank } from "@/types";

export default function RoundsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBankId, setNewBankId] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([getRounds(user.uid), getBanks(user.uid)]).then(([r, b]) => {
      setRounds(r); setBanks(b);
      if (b.length > 0) setNewBankId(b[0].bankId);
      setFetching(false);
    });
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim() || !newBankId) return;
    setCreating(true);
    const id = await createRound(user.uid, newName.trim(), newBankId);
    setRounds((prev) => [{ roundId: id, name: newName.trim(), bankId: newBankId, questionIds: [], createdAt: Date.now() }, ...prev]);
    setNewName(""); setShowForm(false); setCreating(false);
  };

  const handleDelete = async (roundId: string) => {
    if (!user || !confirm("Delete this round?")) return;
    await deleteRound(user.uid, roundId);
    setRounds((prev) => prev.filter((r) => r.roundId !== roundId));
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span className="font-display text-yellow text-xl">Loading…</span>
    </div>
  );

  const bankName = (bankId: string) => banks.find((b) => b.bankId === bankId)?.name ?? bankId;

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/host/dashboard" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Dashboard</Link>
            <Link href="/host/questions" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Questions</Link>
            <Link href="/host/rounds" style={{ color: "var(--yellow)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Rounds</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700 }}>Rounds</h1>
          <button onClick={() => setShowForm(!showForm)} className="cel-btn" style={{ background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}>
            + New Round
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>Create Round</h2>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Round Name *</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Round 1 — Pop Culture" required
                style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "10px 12px", fontFamily: "var(--font-barlow)", fontSize: 15, borderRadius: 3, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Question Bank *</label>
              {banks.length === 0 ? (
                <p style={{ color: "var(--magenta)", fontSize: 13 }}>No question banks found. <Link href="/host/questions" style={{ color: "var(--cyan)" }}>Create one first.</Link></p>
              ) : (
                <select value={newBankId} onChange={(e) => setNewBankId(e.target.value)} required
                  style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "10px 12px", fontFamily: "var(--font-barlow)", fontSize: 15, borderRadius: 3, outline: "none", boxSizing: "border-box" }}>
                  {banks.map((b) => <option key={b.bankId} value={b.bankId}>{b.name}</option>)}
                </select>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" disabled={creating || banks.length === 0} className="cel-btn" style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}>
                {creating ? "Creating…" : "Create Round"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="cel-btn" style={{ background: "var(--card)", color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {rounds.length === 0 ? (
          <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--muted)" }}>No rounds yet. Create one to start building your game.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {rounds.map((round) => (
              <div key={round.roundId} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, marginBottom: 2 }}>{round.name}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 13, fontFamily: "var(--font-barlow)" }}>
                    Bank: {bankName(round.bankId)} · {round.questionIds.length} question{round.questionIds.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={`/host/rounds/${round.roundId}`} className="cel-btn" style={{ background: "var(--cyan)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 3, textDecoration: "none" }}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(round.roundId)} className="cel-btn" style={{ background: "var(--magenta)", color: "#fff", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 3 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
