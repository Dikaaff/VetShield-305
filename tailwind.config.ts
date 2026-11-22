import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "hsl(var(--color-cream) / <alpha-value>)",
        paper: "hsl(var(--color-paper) / <alpha-value>)",
        ink: "hsl(var(--color-ink) / <alpha-value>)",
        line: "hsl(var(--color-line) / <alpha-value>)",
        forest: {
          DEFAULT: "hsl(var(--color-forest) / <alpha-value>)",
          50: "hsl(var(--color-forest-50) / <alpha-value>)",
          100: "hsl(var(--color-forest-100) / <alpha-value>)",
          200: "hsl(var(--color-forest-200) / <alpha-value>)",
          300: "hsl(var(--color-forest-300) / <alpha-value>)",
          500: "hsl(var(--color-forest-500) / <alpha-value>)",
          700: "hsl(var(--color-forest-700) / <alpha-value>)",
          900: "hsl(var(--color-forest-900) / <alpha-value>)",
        },
        sage: "hsl(var(--color-sage) / <alpha-value>)",
        lime: "hsl(var(--color-lime) / <alpha-value>)",
        orange: {
          DEFAULT: "hsl(var(--color-orange) / <alpha-value>)",
          600: "hsl(var(--color-orange-600) / <alpha-value>)",
          100: "hsl(var(--color-orange-100) / <alpha-value>)",
        },
        clay: "hsl(var(--color-clay) / <alpha-value>)",
        background: "hsl(var(--color-cream) / <alpha-value>)",
        foreground: "hsl(var(--color-ink) / <alpha-value>)",
        border: "hsl(var(--color-line) / <alpha-value>)",
        input: "hsl(var(--color-input) / <alpha-value>)",
        ring: "hsl(var(--color-orange) / <alpha-value>)",
        primary: { DEFAULT: "hsl(var(--color-orange) / <alpha-value>)", foreground: "hsl(var(--color-paper) / <alpha-value>)" },
        secondary: { DEFAULT: "hsl(var(--color-sage) / <alpha-value>)", foreground: "hsl(var(--color-orange-600) / <alpha-value>)" },
        muted: { DEFAULT: "hsl(var(--color-muted) / <alpha-value>)", foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)" },
        accent: { DEFAULT: "hsl(var(--color-orange) / <alpha-value>)", foreground: "hsl(var(--color-paper) / <alpha-value>)" },
        destructive: { DEFAULT: "hsl(var(--color-destructive) / <alpha-value>)", foreground: "hsl(var(--color-paper) / <alpha-value>)" },
        card: { DEFAULT: "hsl(var(--color-paper) / <alpha-value>)", foreground: "hsl(var(--color-ink) / <alpha-value>)" },
        popover: { DEFAULT: "hsl(var(--color-paper) / <alpha-value>)", foreground: "hsl(var(--color-ink) / <alpha-value>)" },
        alert: {
          low: "#027A48",
          mid: "#B54708",
          high: "#B42318",
        },
        shield: {
          50: "hsl(var(--color-forest-50) / <alpha-value>)",
          100: "hsl(var(--color-forest-100) / <alpha-value>)",
          200: "hsl(var(--color-forest-200) / <alpha-value>)",
          300: "hsl(var(--color-forest-300) / <alpha-value>)",
          500: "hsl(var(--color-forest-500) / <alpha-value>)",
          700: "hsl(var(--color-forest-700) / <alpha-value>)",
          900: "hsl(var(--color-forest-900) / <alpha-value>)",
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
        card: "0 1px 2px rgba(16,24,40,0.04), 0 12px 32px -24px rgba(16,24,40,0.22)",
        lift: "0 8px 30px -18px rgba(16,24,40,0.28)",
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
