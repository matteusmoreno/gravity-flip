import { NEAR_MISS_PX } from './constants';
import type { Rect } from './geometry';

/** Distância entre a borda do círculo e o retângulo (negativa se há sobreposição). */
export function gapToRect(cx: number, cy: number, r: number, rect: Rect): number {
  const nx = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
  const ny = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
  return Math.hypot(cx - nx, cy - ny) - r;
}

export function minGapToRects(cx: number, cy: number, r: number, rects: readonly Rect[]): number {
  return rects.reduce((min, rect) => Math.min(min, gapToRect(cx, cy, r, rect)), Infinity);
}

/** Passou rente: chegou perto o bastante sem encostar. */
export const isNearMiss = (minGapPx: number): boolean => minGapPx > 0 && minGapPx <= NEAR_MISS_PX;
