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
        background: "var(--background)",
        foreground: "var(--foreground)",
        ipl: {
          navy: {
            950: "var(--ipl-navy-950)",
            900: "var(--ipl-navy-900)",
            800: "var(--ipl-navy-800)",
          },
          blue: {
            700: "var(--ipl-blue-700)",
            600: "var(--ipl-blue-600)",
            500: "var(--ipl-blue-500)",
          },
          gold: {
            500: "var(--ipl-gold-500)",
            400: "var(--ipl-gold-400)",
          },
          red: {
            500: "var(--ipl-red-500)",
          },
          white: "var(--ipl-white)",
          text: {
            DEFAULT: "var(--ipl-text)",
            muted: "var(--ipl-text-muted)",
            subtle: "var(--ipl-text-subtle)",
          },
          surface: {
            DEFAULT: "var(--ipl-surface)",
            hover: "var(--ipl-surface-hover)",
          },
          border: {
            DEFAULT: "var(--ipl-border)",
            gold: "var(--ipl-border-gold)",
          },
          success: "var(--ipl-success)",
          warning: "var(--ipl-warning)",
          danger: "var(--ipl-danger)",
        },
      },
      borderRadius: {
        card: "14px",
        btn: "8px",
        table: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
