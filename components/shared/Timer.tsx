"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  timerEndsAt: number | null;
  totalSeconds: number;
  onExpired?: () => void;
}

export function Timer({ timerEndsAt, totalSeconds, onExpired }: TimerProps) {
  const [remaining, setRemaining] = useState<number>(totalSeconds);

  useEffect(() => {
    if (!timerEndsAt) { setRemaining(totalSeconds); return; }

    const tick = () => {
      const r = Math.max(0, Math.floor((timerEndsAt - Date.now()) / 1000));
      setRemaining(r);
      if (r === 0 && onExpired) onExpired();
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [timerEndsAt, totalSeconds, onExpired]);

  const pct = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const isDanger = remaining <= 8;
  const color = isDanger ? "var(--magenta)" : "var(--yellow)";

  return (
    <div style={{ textAlign: "center" }}>
      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-rajdhani)",
          fontSize: "5rem",
          fontWeight: 700,
          lineHeight: 1,
          color,
          transition: "color 0.3s ease",
          textShadow: isDanger ? "0 0 20px rgba(255,45,120,0.5)" : "none",
        }}
      >
        {remaining}
      </div>
      {/* Bar */}
      <div
        style={{
          width: "100%",
          height: 8,
          background: "var(--card)",
          border: "2px solid #000",
          borderRadius: 2,
          marginTop: "0.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct * 100}%`,
            background: color,
            transition: "width 0.25s linear, background 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
