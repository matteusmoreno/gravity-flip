import {
  COLORS,
  FLIP_TILT_MAX,
  FLIP_TILT_MS,
  MAX_FALL_SPEED,
  SHOCKWAVE_MAX_RADIUS,
  SHOCKWAVE_MS,
  STRETCH_MAX,
} from './constants';

/** Quais efeitos estão ligados. O modo "efeitos reduzidos" desliga rotação, glitch, tremor e flash. */
export interface EffectProfile {
  tilt: boolean;
  shake: boolean;
  glitch: boolean;
  flash: boolean;
  /** Multiplicador da quantidade de partículas (0 a 1). */
  particleScale: number;
}

export function effectProfile(reduced: boolean, lowPerf = false): EffectProfile {
  return {
    tilt: !reduced,
    shake: !reduced,
    glitch: !reduced,
    flash: !reduced,
    particleScale: (reduced ? 0.5 : 1) * (lowPerf ? 0.4 : 1),
  };
}

/** Inclinação do cenário logo após uma inversão: sobe e volta a zero, amortecida. dir: +1 (rumo ao chão) ou -1 (rumo ao teto). */
export function flipTilt(elapsedMs: number, dir: 1 | -1): number {
  const k = elapsedMs / FLIP_TILT_MS;
  if (k <= 0 || k >= 1) return 0;
  return dir * FLIP_TILT_MAX * Math.sin(Math.PI * k) * (1 - k);
}

export interface Shockwave {
  radius: number;
  alpha: number;
}

/** Anel de luz que se expande a partir da esfera; null quando acabou. */
export function shockwave(elapsedMs: number): Shockwave | null {
  const k = elapsedMs / SHOCKWAVE_MS;
  if (k < 0 || k >= 1) return null;
  return { radius: SHOCKWAVE_MAX_RADIUS * (1 - (1 - k) ** 3), alpha: 0.7 * (1 - k) };
}

/** Esfera esticada na direção do movimento, conforme a velocidade vertical. */
export function stretchFor(vy: number): { sx: number; sy: number } {
  const s = Math.min(1, Math.abs(vy) / MAX_FALL_SPEED);
  const sy = 1 + STRETCH_MAX * s;
  return { sx: 1 / Math.sqrt(sy), sy };
}

const COMBO_COLORS = [COLORS.ink, COLORS.gold, COLORS.cyan, COLORS.magenta, COLORS.gold] as const;

/** Cor do multiplicador de combo (x1 a x5; acima disso usa a do teto). */
export function comboColor(multiplier: number): number {
  const index = Math.min(COMBO_COLORS.length, Math.max(1, Math.floor(multiplier))) - 1;
  return COMBO_COLORS[index]!;
}

export const toCss = (color: number): string => `#${color.toString(16).padStart(6, '0')}`;
