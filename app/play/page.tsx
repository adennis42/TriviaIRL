"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getGame } from "@/lib/firestore";
import { Logo } from "@/components/shared/Logo";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode.length !== 6) { setError("Enter a valid 6-digit code."); return; }
    if (!name.trim()) { setError("Enter your name."); return; }
    setJoining(true); setError("");
    try {
      const game = await getGame(trimmedCode);
      if (!game) { setError("Game not found. Check the code and try again."); setJoining(false); return; }
      if (game.status === "ended") { setError("This game has ended."); setJoining(false); return; }
      router.push(`/play/${trimmedCode}?name=${encodeURIComponent(name.trim())}`);
    } catch {
      setError("Something went wrong. Try again.");
      setJoining(false);
    }
  };

  const handleCodeChange = (val: string) => {
    setCode(val.replace(/\D/g, "").slice(0, 6));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center halftone"
      style={{ background: "var(--blk)", padding: "2rem" }}
    >
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <Logo size="lg" href="/" />
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginTop: "0.75rem", marginBottom: "2.5rem", fontSize: 15 }}>
          Enter the code from your host to join
        </p>

        <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Code input */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Game Code</label>
            <input
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="000000"
              maxLength={6}
              required
              style={{
                width: "100%",
                background: "var(--panel)",
                border: "3px solid #000",
                boxShadow: "4px 4px 0 #000",
                color: "var(--yellow)",
                fontFamily: "var(--font-rajdhani)",
                fontSize: "2.5rem",
                fontWeight: 700,
                textAlign: "center",
                letterSpacing: "0.3em",
                padding: "12px",
                borderRadius: 4,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Name input */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={24}
              required
              style={{
                width: "100%",
                background: "var(--panel)",
                border: "3px solid #000",
                boxShadow: "4px 4px 0 #000",
                color: "var(--text)",
                fontFamily: "var(--font-barlow)",
                fontSize: "1.1rem",
                textAlign: "center",
                padding: "12px",
                borderRadius: 4,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "var(--magenta)", fontFamily: "var(--font-barlow)", fontSize: 14 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={joining || code.length !== 6 || !name.trim()}
            className="cel-btn"
            style={{
              background: "var(--orange)",
              color: "#000",
              fontFamily: "var(--font-barlow-condensed)",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "16px",
              borderRadius: 4,
              opacity: (joining || code.length !== 6 || !name.trim()) ? 0.5 : 1,
            }}
          >
            {joining ? "Joining…" : "Join Game →"}
          </button>
        </form>

        <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 12, marginTop: "2rem" }}>
          Hosting? <a href="/host/dashboard" style={{ color: "var(--cyan)", textDecoration: "none" }}>Sign in here.</a>
        </p>
      </div>
    </div>
  );
}

export default function PlayerJoinPage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--blk)", minHeight: "100vh" }} />}>
      <JoinForm />
    </Suspense>
  );
}
