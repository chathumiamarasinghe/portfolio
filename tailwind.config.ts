import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#111111",
        card: "rgba(15,15,15,0.85)",
        accent: "#E8441A",
        "accent-light": "#FF6B35",
        "text-primary": "#F0F0F0",
        "text-muted": "#888888",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "accent-glow": "0 0 20px #E8441A40",
      },
    },
  },
};

export default config;
