import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizeMap = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
};

export function Logo({ size = "md", href = "/" }: LogoProps) {
  const cls = `font-display font-bold tracking-tight ${sizeMap[size]}`;

  const inner = (
    <span className={cls}>
      <span style={{ color: "var(--yellow)" }}>Trivia</span>
      <span style={{ color: "var(--cyan)" }}>IRL</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    );
  }

  return inner;
}
