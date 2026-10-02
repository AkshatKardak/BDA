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
  goldPrimary: "#F5B942",
  greenSuccess: "#2FBF71",
  redDanger: "#E63946",
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
