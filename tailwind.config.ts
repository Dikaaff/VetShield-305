import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F6F1E5",
        paper: "#FCFAF4",
        ink: "#12251B",
        line: "#E2DAC8",
        forest: {
          DEFAULT: "#153F2C",
          50: "#EEF4ED",
          100: "#DCE9D8",
          200: "#BBD2B2",
          300: "#8FB183",
          500: "#3D7458",
          700: "#22523A",
          900: "#0D2A1E",
        },
        sage: "#D8E5CC",
        lime: "#CDE8BE",
        orange: {
          DEFAULT: "#E4572E",
          600: "#C94722",
          100: "#FBE4DA",
        },
        clay: "#B98A63",
        background: "#F6F1E5",
        foreground: "#12251B",
        border: "#E2DAC8",
        input: "#E2DAC8",
        ring: "#E4572E",
        primary: { DEFAULT: "#153F2C", foreground: "#FCFAF4" },
        secondary: { DEFAULT: "#D8E5CC", foreground: "#12251B" },
        muted: { DEFAULT: "#EFE9DA", foreground: "#4B5B50" },
        accent: { DEFAULT: "#E4572E", foreground: "#FFF8F2" },
        destructive: { DEFAULT: "#9F1239", foreground: "#FFF7F7" },
        card: { DEFAULT: "#FCFAF4", foreground: "#12251B" },
        popover: { DEFAULT: "#FCFAF4", foreground: "#12251B" },
        alert: {
          low: "#2F6B4A",
          mid: "#B45309",
          high: "#9F1239",
        },
        shield: {
          50: "#EEF4ED",
          100: "#DCE9D8",
          200: "#BBD2B2",
          300: "#8FB183",
          500: "#3D7458",
          700: "#22523A",
          900: "#0D2A1E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        base: ["17px", { lineHeight: "1.65" }],
      },
      borderRadius: {
        lg: "var(--radius, 0.75rem)",
        md: "calc(var(--radius, 0.75rem) - 2px)",
        sm: "calc(var(--radius, 0.75rem) - 4px)",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,37,27,0.04), 0 18px 40px -28px rgba(18,37,27,0.35)",
        lift: "0 2px 4px rgba(18,37,27,0.05), 0 28px 60px -32px rgba(18,37,27,0.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.5)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 2rem)))" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        marquee: "marquee var(--duration, 38s) linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 7s ease-in-out infinite",
        "pulse-soft": "pulse-soft 5s ease-in-out infinite",
        "accordion-down": "accordion-down 0.22s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
