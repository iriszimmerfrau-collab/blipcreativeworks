import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08090C",
        panel: "#0F1117",
        borderline: "#2A2D35",
        muted: "#B6BCC8",
        blue: "#55C2FF",
        violet: "#7B61FF",
        green: "#37D67A",
        gold: "#F4C430",
        danger: "#FF5A5F"
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(85, 194, 255, 0.18), 0 18px 55px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
} satisfies Config;
