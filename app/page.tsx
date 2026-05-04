import { Logo } from "@/components/shared/Logo";

export default function LandingPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center halftone"
      style={{ background: "var(--blk)" }}
    >
      <Logo size="lg" href="/" />
      <p className="mt-4 font-label text-muted tracking-widest uppercase text-sm">
        Real-Time Bar Trivia — Coming Soon
      </p>
    </main>
  );
}
