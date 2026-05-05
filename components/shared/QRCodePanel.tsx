"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodePanelProps {
  value: string;
  size?: number;
}

export function QRCodePanel({ value, size = 200 }: QRCodePanelProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        padding: "12px",
        background: "#fff",
        border: "3px solid #000",
        boxShadow: "4px 4px 0 #000",
        borderRadius: 4,
      }}
    >
      <QRCodeSVG value={value} size={size} bgColor="#ffffff" fgColor="#000000" />
    </div>
  );
}
