export default function HostLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen" style={{ background: "var(--blk)" }}>{children}</div>;
}
