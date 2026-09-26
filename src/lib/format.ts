// Pure formatting and derivation helpers for the Agent Dashboard.
//
// Extracted from `src/app/page.tsx` so they can be unit-tested in isolation
// and reused by any future server-side data layer (API routes, server
// components) without dragging in React. They have no side effects and no
// dependency on `window`/`document`.

/**
 * Abbreviate large token counts: 1.5K, 2.5M, etc.
 * Sub-thousand values are returned as plain integers.
 */
export function formatTokens(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

/**
 * Render an agent uptime (in seconds) as a compact `1d 2h` / `2h 5m` / `3m`
 * string. A zero value renders as an em dash.
 */
export function formatUptime(s: number): string {
  if (s === 0) return '—';
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Relative time label (`刚刚`, `5 分钟前`, `2 小时前`, `3 天前`) for a
 * millisecond timestamp, measured against a supplied `now`.
 */
export function timeAgo(ms: number, now: number): string {
  const diff = now - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  return `${Math.floor(hr / 24)} 天前`;
}

/**
 * Heatmap cell colour. A sequential blue scale (blue-500 #3b82f6) encoded via
 * alpha so it reads correctly on both light and dark backgrounds without extra
 * CSS. Colour is never the only signal — the caller also prints each cell's
 * numeric count and an sr-only table carries the full tool × day matrix.
 * Text switches to white once the background is dark enough for contrast.
 */
export function heatCellStyle(
  count: number,
  max: number
): { backgroundColor: string; color?: string } {
  const ratio = max <= 0 ? 0 : count / max;
  const alpha = 0.08 + ratio * 0.92;
  return {
    backgroundColor: `rgba(59, 130, 246, ${alpha.toFixed(3)})`,
    color: alpha > 0.55 ? '#ffffff' : undefined,
  };
}
