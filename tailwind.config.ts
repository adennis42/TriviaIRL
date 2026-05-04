import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow:  "var(--yellow)",
        orange:  "var(--orange)",
        cyan:    "var(--cyan)",
        magenta: "var(--magenta)",
        green:   "var(--green)",
        blk:     "var(--blk)",
        dark:    "var(--dark)",
        panel:   "var(--panel)",
        card:    "var(--card)",
        "card-2": "var(--card-2)",
        text:    "var(--text)",
        muted:   "var(--muted)",
        outline: "var(--outline)",
      },
      fontFamily: {
        display:  ["var(--font-rajdhani)", "Rajdhani", "sans-serif"],
        label:    ["var(--font-barlow-condensed)", "Barlow Condensed", "sans-serif"],
        body:     ["var(--font-barlow)", "Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
