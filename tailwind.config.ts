import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        paper: "#fbf7f0",
        shield: {
          50: "#eef6f4",
          100: "#d5ebe6",
          300: "#8cc9bf",
          500: "#2f7d70",
          700: "#1d544b",
          900: "#0f2f2a",
        },
        alert: {
          low: "#166534",
          mid: "#92400e",
          high: "#9f1239",
        },
      },
      fontSize: {
        base: ["17px", { lineHeight: "1.6" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,47,42,0.06), 0 12px 32px -16px rgba(15,47,42,0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
