import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        bolt: {
          green: "#34BB78",
          "green-700": "#1F8A56",
          "green-50": "#E7F6EE",
          mint: "#CFF0DA",
          "mint-soft": "#E6F7EC",
        },
        charade: {
          DEFAULT: "#2C2D33",
          soft: "#3A3B41",
        },
        "athens-gray": "#EFF1F4",
        line: {
          DEFAULT: "#E5E7EC",
          soft: "#EFF1F4",
        },
        muted: {
          DEFAULT: "#6B6E78",
          2: "#9CA0A9",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          2: "#FAFAFB",
        },
        status: {
          red: "#E5484D",
          "red-50": "#FCEAEB",
          amber: "#F5A623",
          "amber-50": "#FEF1DD",
          blue: "#2F6FEB",
          "blue-50": "#E6EFFD",
          violet: "#7A5AF8",
          "violet-50": "#EFEAFE",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px",
        pill: "999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(20,22,28,.04)",
        DEFAULT: "0 2px 6px rgba(20,22,28,.06), 0 1px 2px rgba(20,22,28,.04)",
        lg: "0 12px 32px -8px rgba(20,22,28,.12), 0 4px 8px -2px rgba(20,22,28,.06)",
      },
      letterSpacing: {
        tight: "-0.011em",
        tighter: "-0.025em",
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
