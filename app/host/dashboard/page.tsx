"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { getOrCreateHost } from "@/lib/firestore";
import { Logo } from "@/components/shared/Logo";
import type { Host } from "@/types";

export default function HostDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [host, setHost] = useState<Host | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getOrCreateHost(user.uid, user.email ?? "", user.displayName ?? "Host")
      .then((h) => { setHost(h); setFetching(false); });
  }, [user]);

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--blk)" }}>
      <span style={{ fontFamily: "var(--font-rajdhani)", color: "var(--yellow)", fontSize: "1.5rem" }}>Loading…</span>
    </div>
  );

  const isFreeTier = host?.plan === "free";
  const gamesUsed = host?.gamesThisMonth ?? 0;
  const gamesRemaining = Math.max(0, 3 - gamesUsed);
  const atLimit = isFreeTier && gamesUsed >= 3;

  return (
    <div className="min-h-screen" style={{ background: "var(--blk)", color: "var(--text)" }}>
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Plan badge */}
            <span style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "3px 10px",
              border: "2px solid #000",
              borderRadius: 2,
              background: host?.plan === "pro" ? "var(--yellow)" : "var(--card)",
              color: host?.plan === "pro" ? "#000" : "var(--muted)",
            }}>
              {host?.plan === "pro" ? "★ Pro" : "Free"}
            </span>
            <span style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13 }}>{user?.email}</span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          Host Dashboard
        </h1>
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", marginBottom: "2.5rem" }}>
          Welcome back, {host?.displayName ?? user?.email}
        </p>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Games This Month", value: gamesUsed, color: "var(--yellow)", sub: isFreeTier ? `${gamesRemaining} remaining` : "Unlimited" },
            { label: "Plan", value: host?.plan === "pro" ? "Pro" : "Free", color: host?.plan === "pro" ? "var(--yellow)" : "var(--muted)", sub: host?.plan === "pro" ? "All features unlocked" : "3 games/month" },
            { label: "Status", value: "Active", color: "var(--green)", sub: "Ready to host" },
          ].map((stat) => (
            <div key={stat.label} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.25rem 1.5rem" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.375rem" }}>{stat.label}</p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.75rem", fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: "0.25rem" }}>{stat.value}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: 12, color: "var(--muted)" }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Free tier limit warning */}
        {isFreeTier && (
          <div className="cel-card" style={{ background: atLimit ? "#1a0000" : "#1a1a00", border: `2.5px solid ${atLimit ? "var(--magenta)" : "var(--yellow)"}`, borderRadius: 4, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: atLimit ? "var(--magenta)" : "var(--yellow)", marginBottom: 4 }}>
                {atLimit ? "Monthly Limit Reached" : `${gamesRemaining} game${gamesRemaining !== 1 ? "s" : ""} remaining this month`}
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: 13, color: "var(--muted)" }}>
                {atLimit ? "Upgrade to Pro for unlimited games and all features." : "Free plan includes 3 games per month."}
              </p>
            </div>
            <Link href="/upgrade" style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 18px", borderRadius: 3, textDecoration: "none", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", flexShrink: 0 }}>
              Upgrade →
            </Link>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {[
            { href: "/host/game/new",  label: "New Game",       sub: "Start hosting now",      color: "var(--orange)", disabled: atLimit },
            { href: "/host/questions", label: "Question Banks", sub: "Manage your questions",  color: "var(--cyan)",   disabled: false },
            { href: "/host/rounds",    label: "Rounds",          sub: "Build and order rounds", color: "var(--yellow)", disabled: false },
          ].map((action) => (
            action.disabled ? (
              <div key={action.href} className="cel-card" style={{ background: "var(--card)", borderRadius: 4, padding: "1.5rem", opacity: 0.5, cursor: "not-allowed" }}>
                <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.2rem", fontWeight: 700, color: "var(--muted)", marginBottom: 4 }}>{action.label}</p>
                <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13 }}>Upgrade to unlock</p>
              </div>
            ) : (
              <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
                <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem", cursor: "pointer", transition: "transform 0.1s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-2px,-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
                  <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.2rem", fontWeight: 700, color: action.color, marginBottom: 4 }}>{action.label}</p>
                  <p style={{ color: "var(--muted)", fontFamily: "var(--font-barlow)", fontSize: 13 }}>{action.sub}</p>
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
