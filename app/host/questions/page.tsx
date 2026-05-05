"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { getBanks, createBank, deleteBank } from "@/lib/firestore";
import { Logo } from "@/components/shared/Logo";
import type { QuestionBank } from "@/types";

export default function QuestionBanksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [fetching, setFetching] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getBanks(user.uid).then((b) => { setBanks(b); setFetching(false); });
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim()) return;
    setCreating(true);
    const id = await createBank(user.uid, newName.trim(), newDesc.trim());
    setBanks((prev) => [{ bankId: id, name: newName.trim(), description: newDesc.trim(), createdAt: Date.now() }, ...prev]);
    setNewName(""); setNewDesc(""); setShowForm(false); setCreating(false);
  };

  const handleDelete = async (bankId: string) => {
    if (!user || !confirm("Delete this question bank?")) return;
    await deleteBank(user.uid, bankId);
    setBanks((prev) => prev.filter((b) => b.bankId !== bankId));
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span className="font-display text-yellow text-xl">Loading…</span>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)", fontFamily: "var(--font-barlow)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/host/dashboard" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Dashboard</Link>
            <Link href="/host/questions" style={{ color: "var(--yellow)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Questions</Link>
            <Link href="/host/rounds" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Rounds</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700 }}>Question Banks</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="cel-btn"
            style={{ background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}
          >
            + New Bank
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>Create Question Bank</h2>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Bank Name *</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Pop Culture 2024"
                required
                style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "10px 12px", fontFamily: "var(--font-barlow)", fontSize: 15, borderRadius: 3, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Description</label>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Optional description"
                style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "10px 12px", fontFamily: "var(--font-barlow)", fontSize: 15, borderRadius: 3, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" disabled={creating} className="cel-btn" style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}>
                {creating ? "Creating…" : "Create Bank"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="cel-btn" style={{ background: "var(--card)", color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {banks.length === 0 ? (
          <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)" }}>No question banks yet. Create your first one to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {banks.map((bank) => (
              <div key={bank.bankId} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, marginBottom: 2 }}>{bank.name}</h3>
                  {bank.description && <p style={{ color: "var(--muted)", fontSize: 14 }}>{bank.description}</p>}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={`/host/questions/${bank.bankId}`} className="cel-btn" style={{ background: "var(--cyan)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 3, textDecoration: "none" }}>
                    Open
                  </Link>
                  <button onClick={() => handleDelete(bank.bankId)} className="cel-btn" style={{ background: "var(--magenta)", color: "#fff", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 3 }}>
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
