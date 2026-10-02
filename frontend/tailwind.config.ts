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
          dark: "#0B0F19",
          card: "#111827",
          border: "#1F2937",
          cardhover: "#182234",
          emerald: "#10B981",
          gold: "#F59E0B",
          blue: "#2563EB",
          cyan: "#06B6D4",
          purple: "#8B5CF6"
        }
      },
    },
  },
  plugins: [],
};
export default config;
