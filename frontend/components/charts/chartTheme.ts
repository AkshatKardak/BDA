/**
 * frontend/components/charts/chartTheme.ts
 * ========================================
 * Unified theme tokens, color scales, and SVG configurations for all Recharts visualizations.
 * Strict design system: Navy, Blue, Gold, Green, Red, Muted Slate.
 */

export const CHART_COLORS = {
  navyDark: "#070B16",
  navyMedium: "#0D1424",
  navyCard: "#0A101D",
  bluePrimary: "#165DCC",
  blueVibrant: "#2476E8",
  blueLight: "#2476E8",
  goldPrimary: "#F5B942",
  greenSuccess: "#2FBF71",
  greenAccent: "#2FBF71",
  redDanger: "#E63946",
  redAccent: "#E63946",
  purpleAccent: "#8B5CF6",
  cyanAccent: "#06B6D4",
  orangeAccent: "#F97316",
  slateText: "#F4F6FA",
  slateMuted: "#8F9AAF",
  slateDim: "#707B91",
  gridLine: "rgba(255, 255, 255, 0.06)",
  borderSubtle: "rgba(255, 255, 255, 0.08)",
};

export const SERIES_PALETTE = [
  CHART_COLORS.blueVibrant,
  CHART_COLORS.goldPrimary,
  CHART_COLORS.greenSuccess,
  CHART_COLORS.redDanger,
  CHART_COLORS.purpleAccent,
  CHART_COLORS.cyanAccent,
  CHART_COLORS.orangeAccent,
  CHART_COLORS.slateMuted,
];

export const CHART_PALETTES = {
  sports: [
    "#2476E8",
    "#F5B942",
    "#2FBF71",
    "#E63946",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#10B981",
    "#6366F1",
    "#EC4899",
  ],
  blues: ["#0B1A3A", "#165DCC", "#2476E8", "#60A5FA", "#93C5FD"],
  golds: ["#78350F", "#B45309", "#D97706", "#F59E0B", "#F5B942"],
};

export function interpolateColor(color1: string, color2: string, factor: number): string {
  const clamped = Math.max(0, Math.min(1, factor));
  const c1 = color1.startsWith("#") ? color1.slice(1) : color1;
  const c2 = color2.startsWith("#") ? color2.slice(1) : color2;
  const r1 = parseInt(c1.substring(0, 2), 16) || 0;
  const g1 = parseInt(c1.substring(2, 4), 16) || 0;
  const b1 = parseInt(c1.substring(4, 6), 16) || 0;
  const r2 = parseInt(c2.substring(0, 2), 16) || 0;
  const g2 = parseInt(c2.substring(2, 4), 16) || 0;
  const b2 = parseInt(c2.substring(4, 6), 16) || 0;
  const r = Math.round(r1 + clamped * (r2 - r1));
  const g = Math.round(g1 + clamped * (g2 - g1));
  const b = Math.round(b1 + clamped * (b2 - b1));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export const chartTooltipStyle = {
  backgroundColor: "#0D1424",
  borderColor: "rgba(255, 255, 255, 0.12)",
  borderRadius: "6px",
  color: "#F4F6FA",
  fontSize: "11px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
  padding: "8px 12px",
};

export const chartAxisStyle = {
  stroke: "#6F7A90",
  fontSize: 10,
  tickLine: false,
};

export const chartGridStyle = {
  strokeDasharray: "3 3",
  stroke: "rgba(255, 255, 255, 0.06)",
  vertical: false,
};
