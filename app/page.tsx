import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

const HOW_IT_WORKS = [
  { num: "01", title: "Host creates a game", desc: "Pick your rounds, set your questions, choose solo or team mode." },
  { num: "02", title: "Players join instantly", desc: "Scan the QR or type the 6-digit code — no app download, no account." },
  { num: "03", title: "Questions go live", desc: "Each question appears on every phone simultaneously with a countdown timer." },
  { num: "04", title: "Scores update in real time", desc: "Speed matters — faster correct answers earn more points. Leaderboard updates live." },
];

const FEATURES = [
  { title: "Real-time sync",       desc: "All devices stay in lock-step via Firestore. No lag, no refresh." },
  { title: "Speed scoring",        desc: "Faster correct answers earn more points. Slow but right beats fast and wrong." },
  { title: "Solo + Team modes",    desc: "Individual competition or team collaboration — your call." },
  { title: "OpenTDB import",       desc: "Pull from 4,000+ verified questions across every category imaginable." },
  { title: "Build your own",       desc: "Create custom question banks. Your regulars will never see the same question twice." },
  { title: "No app required",      desc: "Players join in the browser. Works on every phone, every carrier." },
];

export default function LandingPage() {
  return (
    <div style={{ background: "var(--blk)", color: "var(--text)", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "var(--dark)", borderBottom: "2.5px solid #000", padding: "0 max(2rem, 4vw)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size="md" />
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/play" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Join Game</Link>
            <Link href="/host/dashboard" style={{ background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "9px 18px", borderRadius: 3, textDecoration: "none", border: "3px solid #000", boxShadow: "3px 3px 0 #000" }}>
              Host a Game
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="halftone" style={{ background: "var(--blk)", padding: "clamp(4rem, 10vw, 8rem) max(2rem, 4vw)", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "var(--card)", border: "2px solid #000", borderRadius: 2, padding: "4px 14px", fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "1.5rem" }}>
            Real-Time Bar Trivia
          </div>
          <h1 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
            <span style={{ color: "var(--yellow)" }}>Trivia</span>
            <span style={{ color: "var(--cyan)" }}>IRL</span>
            <br />
            <span style={{ color: "var(--text)", fontSize: "0.65em" }}>Host your next game.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--muted)", maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
            Players join from their phones in seconds. Real-time scoring. No app download. No account needed.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/host/dashboard" style={{ background: "var(--orange)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 16, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px 36px", borderRadius: 4, textDecoration: "none", border: "3px solid #000", boxShadow: "4px 4px 0 #000" }}>
              Start Hosting →
            </Link>
            <Link href="/play" style={{ background: "transparent", color: "var(--text)", fontFamily: "var(--font-barlow-condensed)", fontSize: 16, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px 36px", borderRadius: 4, textDecoration: "none", border: "3px solid #444", boxShadow: "4px 4px 0 #000" }}>
              Join a Game
            </Link>
          </div>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginTop: "1.5rem" }}>
            Free · No account needed for players · No app download
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "var(--dark)", borderTop: "2.5px solid #000", borderBottom: "2.5px solid #000", padding: "5rem max(2rem, 4vw)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "0.75rem" }}>How it works</p>
          <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, marginBottom: "3rem" }}>Set up in minutes.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700, color: "var(--yellow)", lineHeight: 1, marginBottom: "0.75rem" }}>{step.num}</p>
                <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{step.title}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "var(--blk)", padding: "5rem max(2rem, 4vw)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--orange)", marginBottom: "0.75rem" }}>Features</p>
          <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, marginBottom: "3rem" }}>Built for the bar.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.1rem", fontWeight: 600, color: "var(--yellow)", marginBottom: "0.375rem" }}>{f.title}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: "var(--dark)", borderTop: "2.5px solid #000", borderBottom: "2.5px solid #000", padding: "5rem max(2rem, 4vw)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: "0.75rem" }}>Pricing</p>
          <h2 style={{ fontFamily: "var(--font-rajdhani)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, marginBottom: "3rem" }}>Simple. No surprises.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div className="cel-card" style={{ background: "var(--panel)", borderRadius: 4, padding: "2rem", textAlign: "left" }}>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700, marginBottom: 4 }}>Free</p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", color: "var(--muted)", marginBottom: "1.5rem" }}>$0/mo</p>
              {["3 games/month", "All question types", "Solo + Teams", "OpenTDB import"].map((f) => (
                <p key={f} style={{ fontFamily: "var(--font-barlow)", fontSize: 14, color: "var(--muted)", marginBottom: "0.375rem" }}>✓ {f}</p>
              ))}
              <Link href="/host/dashboard" style={{ display: "block", marginTop: "1.5rem", background: "var(--card)", color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px", borderRadius: 3, textDecoration: "none", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", textAlign: "center" }}>
                Get Started
              </Link>
            </div>
            <div className="cel-card" style={{ background: "#1a1a00", border: "2.5px solid var(--yellow)", borderRadius: 4, padding: "2rem", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "2rem", fontWeight: 700, color: "var(--yellow)", marginBottom: 4 }}>Pro</p>
                <span style={{ background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, border: "2px solid #000", alignSelf: "flex-start" }}>Best</span>
              </div>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "1.5rem", color: "var(--yellow)", marginBottom: "1.5rem" }}>$12/mo</p>
              {["Unlimited games", "All Free features", "Priority support", "Early access"].map((f) => (
                <p key={f} style={{ fontFamily: "var(--font-barlow)", fontSize: 14, color: "var(--text)", marginBottom: "0.375rem" }}>★ {f}</p>
              ))}
              <Link href="/upgrade" style={{ display: "block", marginTop: "1.5rem", background: "var(--yellow)", color: "#000", fontFamily: "var(--font-barlow-condensed)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px", borderRadius: 3, textDecoration: "none", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", textAlign: "center" }}>
                Upgrade →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--dark)", borderTop: "2.5px solid #000", padding: "2rem max(2rem, 4vw)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <Logo size="sm" />
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link href="/play" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Join Game</Link>
            <Link href="/host/dashboard" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Host</Link>
            <Link href="/upgrade" style={{ color: "var(--muted)", fontFamily: "var(--font-barlow-condensed)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Pricing</Link>
          </div>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: 12, color: "var(--muted)" }}>© {new Date().getFullYear()} TriviaIRL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
