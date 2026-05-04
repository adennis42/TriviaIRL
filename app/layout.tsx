import type { Metadata } from "next";
import { Rajdhani, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TriviaIRL — Real-Time Bar Trivia",
  description: "Host live trivia nights at your bar or venue. Players join from their phones — no app required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rajdhani.variable} ${barlowCondensed.variable} ${barlow.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
