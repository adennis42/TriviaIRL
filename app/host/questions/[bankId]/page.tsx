"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { getQuestions, createQuestion, deleteQuestion, updateQuestion } from "@/lib/firestore";
import { Logo } from "@/components/shared/Logo";
import type { Question, Difficulty, QuestionSource } from "@/types";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

const EMPTY_FORM = {
  questionText: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
  pointValue: 1000,
  timerSeconds: 30,
  category: "",
  difficulty: "medium" as Difficulty,
};

export default function BankDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bankId = params?.bankId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !bankId) return;
    getQuestions(user.uid, bankId).then((q) => { setQuestions(q); setFetching(false); });
  }, [user, bankId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const data = {
      questionText: form.questionText,
      options: form.options,
      correctAnswerIndex: form.correctAnswerIndex,
      pointValue: form.pointValue,
      timerSeconds: form.timerSeconds,
      category: form.category,
      difficulty: form.difficulty,
      source: "manual" as QuestionSource,
    };

    if (editingId) {
      await updateQuestion(user.uid, bankId, editingId, data);
      setQuestions((prev) => prev.map((q) => q.questionId === editingId ? { ...q, ...data } : q));
    } else {
      const id = await createQuestion(user.uid, bankId, data);
      setQuestions((prev) => [{ ...data, questionId: id, createdAt: Date.now() }, ...prev]);
    }

    setForm({ ...EMPTY_FORM }); setShowForm(false); setEditingId(null); setSaving(false);
  };

  const handleEdit = (q: Question) => {
    setForm({
      questionText: q.questionText,
      options: [...q.options],
      correctAnswerIndex: q.correctAnswerIndex,
      pointValue: q.pointValue,
      timerSeconds: q.timerSeconds,
      category: q.category,
      difficulty: q.difficulty ?? "medium",
    });
    setEditingId(q.questionId);
    setShowForm(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!user || !confirm("Delete this question?")) return;
    await deleteQuestion(user.uid, bankId, questionId);
    setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
  };

  const updateOption = (i: number, val: string) => {
    setForm((f) => { const opts = [...f.options]; opts[i] = val; return { ...f, options: opts }; });
  };

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span className="font-display text-yellow text-xl">Loading…</span>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <Link href="/host/questions" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>← Banks</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700 }}>
            Questions <span style={{ color: "var(--muted)", fontSize: "1rem", fontWeight: 400 }}>({questions.length})</span>
          </h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => setShowImport(true)} className="cel-btn" style={{ background: "var(--cyan)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 16px", borderRadius: 3 }}>
              Import from OpenTDB
            </button>
            <button onClick={() => { setForm({ ...EMPTY_FORM }); setEditingId(null); setShowForm(true); }} className="cel-btn" style={{ background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 16px", borderRadius: 3 }}>
              + Add Question
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
              {editingId ? "Edit Question" : "New Question"}
            </h2>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Question *</label>
              <textarea value={form.questionText} onChange={(e) => setForm((f) => ({ ...f, questionText: e.target.value }))} required rows={2}
                style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "10px 12px", fontFamily: "var(--font-barlow)", fontSize: 15, borderRadius: 3, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Answer Options (select the correct one)</label>
              {form.options.map((opt, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                  <input type="radio" name="correct" checked={form.correctAnswerIndex === i} onChange={() => setForm((f) => ({ ...f, correctAnswerIndex: i }))} style={{ accentColor: "var(--yellow)" }} />
                  <input value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} required
                    style={{ flex: 1, background: form.correctAnswerIndex === i ? "#1a1a00" : "var(--card)", border: `2px solid ${form.correctAnswerIndex === i ? "var(--yellow)" : "#000"}`, color: "var(--text)", padding: "8px 12px", fontFamily: "var(--font-barlow)", fontSize: 14, borderRadius: 3, outline: "none" }} />
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Points</label>
                <input type="number" value={form.pointValue} onChange={(e) => setForm((f) => ({ ...f, pointValue: parseInt(e.target.value) || 1000 }))} min={100} max={5000} step={100}
                  style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "8px 10px", fontFamily: "var(--font-barlow)", fontSize: 14, borderRadius: 3, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Timer (s)</label>
                <input type="number" value={form.timerSeconds} onChange={(e) => setForm((f) => ({ ...f, timerSeconds: parseInt(e.target.value) || 30 }))} min={10} max={120} step={5}
                  style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "8px 10px", fontFamily: "var(--font-barlow)", fontSize: 14, borderRadius: 3, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as Difficulty }))}
                  style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "8px 10px", fontFamily: "var(--font-barlow)", fontSize: 14, borderRadius: 3, outline: "none", boxSizing: "border-box" }}>
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Category</label>
                <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Sports"
                  style={{ width: "100%", background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "8px 10px", fontFamily: "var(--font-barlow)", fontSize: 14, borderRadius: 3, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" disabled={saving} className="cel-btn" style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}>
                {saving ? "Saving…" : editingId ? "Save Changes" : "Add Question"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="cel-btn" style={{ background: "var(--card)", color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {questions.length === 0 && !showForm ? (
          <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--muted)" }}>No questions yet. Add one manually or import from OpenTDB.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {questions.map((q, i) => (
              <div key={q.questionId} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: 6, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>#{i + 1}</span>
                      {q.category && <span style={{ background: "var(--card)", border: "1.5px solid #000", padding: "2px 8px", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cyan)", borderRadius: 2 }}>{q.category}</span>}
                      <span style={{ color: "var(--yellow)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{q.pointValue}pts</span>
                      <span style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11 }}>{q.timerSeconds}s</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: 14, marginBottom: 6 }}>{q.questionText}</p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {q.options.map((opt, oi) => (
                        <span key={oi} style={{ fontFamily: "var(--font-barlow)", fontSize: 12, padding: "2px 8px", borderRadius: 2, border: `1.5px solid ${oi === q.correctAnswerIndex ? "var(--yellow)" : "#333"}`, color: oi === q.correctAnswerIndex ? "var(--yellow)" : "var(--muted)" }}>
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                    <button onClick={() => handleEdit(q)} className="cel-btn" style={{ background: "var(--card)", color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 2 }}>Edit</button>
                    <button onClick={() => handleDelete(q.questionId)} className="cel-btn" style={{ background: "var(--magenta)", color: "#fff", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 2 }}>Del</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showImport && (
        <OpenTDBImportModal
          hostId={user?.uid ?? ""}
          bankId={bankId}
          onClose={() => setShowImport(false)}
          onImported={(imported) => setQuestions((prev) => [...imported, ...prev])}
        />
      )}
    </div>
  );
}

// ── OpenTDB Import Modal ────────────────────────────────────────────────────

interface ImportModalProps {
  hostId: string;
  bankId: string;
  onClose: () => void;
  onImported: (questions: Question[]) => void;
}

function OpenTDBImportModal({ hostId, bankId, onClose, onImported }: ImportModalProps) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [amount, setAmount] = useState(10);
  const [preview, setPreview] = useState<Omit<Question, "questionId" | "createdAt">[]>([]);
  const [fetching, setFetching] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/opentdb?action=categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));
  }, []);

  const handleFetch = async () => {
    setFetching(true);
    const params = new URLSearchParams({ amount: amount.toString() });
    if (category)   params.set("category",   category);
    if (difficulty) params.set("difficulty", difficulty);
    const res  = await fetch(`/api/opentdb?${params}`);
    const data = await res.json();
    setPreview(data.questions ?? []);
    setSelected(new Set(Array.from({ length: data.questions?.length ?? 0 }, (_, i) => i)));
    setFetching(false);
  };

  const handleImport = async () => {
    setImporting(true);
    const toImport = preview.filter((_, i) => selected.has(i));
    const imported: Question[] = [];
    for (const q of toImport) {
      const id = await createQuestion(hostId, bankId, q);
      imported.push({ ...q, questionId: id, createdAt: Date.now() });
    }
    onImported(imported);
    onClose();
  };

  const toggleSelect = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "2px solid #000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.25rem", fontWeight: 600 }}>Import from OpenTDB</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "2px solid #000", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "7px 10px", fontFamily: "var(--font-barlow)", fontSize: 13, borderRadius: 3, minWidth: 180 }}>
              <option value="">Any Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "7px 10px", fontFamily: "var(--font-barlow)", fontSize: 13, borderRadius: 3 }}>
              <option value="">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 10)} min={1} max={50}
              style={{ background: "var(--card)", border: "2px solid #000", color: "var(--text)", padding: "7px 10px", fontFamily: "var(--font-barlow)", fontSize: 13, borderRadius: 3, width: 70 }} />
          </div>
          <button onClick={handleFetch} disabled={fetching} className="cel-btn" style={{ background: "var(--cyan)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "9px 16px", borderRadius: 3 }}>
            {fetching ? "Fetching…" : "Fetch Questions"}
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "1rem 1.5rem" }}>
          {preview.length === 0 ? (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "2rem 0" }}>Fetch questions to preview them here.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {preview.map((q, i) => (
                <div key={i} onClick={() => toggleSelect(i)} style={{ background: selected.has(i) ? "#1a1a00" : "var(--card)", border: `2px solid ${selected.has(i) ? "var(--yellow)" : "#333"}`, borderRadius: 3, padding: "0.75rem 1rem", cursor: "pointer" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: 13 }}>{q.questionText}</p>
                  <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, color: "var(--cyan)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{q.category} · {q.difficulty}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {preview.length > 0 && (
          <div style={{ padding: "1rem 1.5rem", borderTop: "2px solid #000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.08em" }}>{selected.size} of {preview.length} selected</span>
            <button onClick={handleImport} disabled={importing || selected.size === 0} className="cel-btn" style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 20px", borderRadius: 3 }}>
              {importing ? "Importing…" : `Import ${selected.size} Questions`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
