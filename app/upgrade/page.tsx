import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function UpgradePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center halftone" style={{ background: "var(--blk)", padding: "2rem" }}>
      <Logo size="lg" />

      <div style={{ maxWidth: 680, width: "100%", marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Free */}
        <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "2rem" }}>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Current Plan</p>
          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2.5rem", fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>Free</p>
          <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", fontWeight: 600, color: "var(--muted)", marginBottom: "1.5rem" }}>$0/mo</p>
          {["3 games per month", "All question types", "Solo + Teams mode", "OpenTDB import", "Leaderboards"].map((f) => (
            <p key={f} style={{ fontFamily: "var(--font-barlow)", fontSize: 14, color: "var(--muted)", marginBottom: "0.5rem" }}>✓ {f}</p>
          ))}
        </div>

        {/* Pro */}
        <div className="cel-card" style={{ background: "#1a1a00", border: "2.5px solid var(--yellow)", borderRadius: 4, padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "0.5rem" }}>Upgrade To</p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2.5rem", fontWeight: 700, color: "var(--yellow)", lineHeight: 1 }}>Pro</p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", fontWeight: 600, color: "var(--muted)", marginBottom: "1.5rem" }}>$12/mo</p>
            </div>
            <span style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, border: "2px solid #000" }}>★ Best</span>
          </div>
          {["Unlimited games", "All Free features", "Priority support", "Early access to new features", "Remove TriviaIRL branding"].map((f) => (
            <p key={f} style={{ fontFamily: "var(--font-barlow)", fontSize: 14, color: "var(--text)", marginBottom: "0.5rem" }}>★ {f}</p>
          ))}
          <div style={{ marginTop: "1.5rem", background: "var(--card)", border: "2px solid #555", borderRadius: 3, padding: "0.875rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.08em", color: "var(--muted)" }}>Stripe payments coming soon</p>
          </div>
        </div>
      </div>

      <Link href="/host/dashboard" style={{ marginTop: "2rem", color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}
