"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Logo } from "@/components/shared/Logo";

export default function HostDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span style={{ fontFamily: "var(--font-rajdhani)", color: "var(--yellow)", fontSize: "1.5rem" }}>Loading…</span>
    </div>
  );

  const navLinks = [
    { href: "/host/game/new",  label: "New Game",       sub: "Start hosting",     color: "var(--orange)" },
    { href: "/host/questions", label: "Question Banks", sub: "Manage questions",  color: "var(--cyan)" },
    { href: "/host/rounds",    label: "Rounds",          sub: "Build game rounds", color: "var(--yellow)" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <span style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13 }}>{user?.email}</span>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Host Dashboard</h1>
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginBottom: "2.5rem" }}>Manage your trivia games, questions, and rounds.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
              <div
                className="cel-card"
                style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem", cursor: "pointer", transition: "transform 0.12s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-2px,-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.25rem", fontWeight: 700, color: link.color, marginBottom: 4 }}>{link.label}</p>
                <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13 }}>{link.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
