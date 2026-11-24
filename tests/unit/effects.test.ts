import { describe, expect, it } from 'vitest';
import { comboColor, effectProfile, flipTilt, shockwave, stretchFor, toCss } from '@/core/effects';
import {
  COLORS,
  FLIP_TILT_MAX,
  FLIP_TILT_MS,
  MAX_FALL_SPEED,
  SHOCKWAVE_MAX_RADIUS,
  SHOCKWAVE_MS,
  STRETCH_MAX,
} from '@/core/constants';

describe('flipTilt', () => {
  it('começa e termina em zero', () => {
    expect(flipTilt(0, 1)).toBe(0);
    expect(flipTilt(FLIP_TILT_MS, 1)).toBe(0);
    expect(flipTilt(FLIP_TILT_MS + 500, -1)).toBe(0);
    expect(flipTilt(-10, 1)).toBe(0);
  });

  it('nunca passa da inclinação máxima e segue a direção', () => {
    for (let t = 1; t < FLIP_TILT_MS; t += 7) {
      expect(Math.abs(flipTilt(t, 1))).toBeLessThanOrEqual(FLIP_TILT_MAX);
      expect(flipTilt(t, 1)).toBeGreaterThan(0);
      expect(flipTilt(t, -1)).toBeLessThan(0);
      expect(flipTilt(t, -1)).toBeCloseTo(-flipTilt(t, 1));
    }
  });
});

describe('shockwave', () => {
  it('só existe durante a animação', () => {
    expect(shockwave(-1)).toBe(null);
    expect(shockwave(SHOCKWAVE_MS)).toBe(null);
    expect(shockwave(10)).not.toBe(null);
  });

  it('o raio cresce e a opacidade diminui', () => {
    let prev = shockwave(1)!;
    for (let t = 20; t < SHOCKWAVE_MS; t += 20) {
      const cur = shockwave(t)!;
      expect(cur.radius).toBeGreaterThan(prev.radius);
      expect(cur.alpha).toBeLessThan(prev.alpha);
      expect(cur.radius).toBeLessThanOrEqual(SHOCKWAVE_MAX_RADIUS);
      prev = cur;
    }
  });
});

describe('stretchFor', () => {
  it('sem velocidade a esfera é redonda', () => {
    expect(stretchFor(0)).toEqual({ sx: 1, sy: 1 });
  });

  it('estica mais com mais velocidade, com limite, igual nos dois sentidos', () => {
    const a = stretchFor(MAX_FALL_SPEED / 2);
    const b = stretchFor(MAX_FALL_SPEED);
    expect(b.sy).toBeGreaterThan(a.sy);
    expect(b.sy).toBeCloseTo(1 + STRETCH_MAX);
    expect(stretchFor(MAX_FALL_SPEED * 5).sy).toBeCloseTo(1 + STRETCH_MAX);
    expect(b.sx).toBeLessThan(1);
    expect(b.sx).toBeGreaterThan(0.7);
    expect(stretchFor(-MAX_FALL_SPEED)).toEqual(b);
  });
});

describe('effectProfile', () => {
  it('o modo normal liga tudo', () => {
    expect(effectProfile(false)).toEqual({ tilt: true, shake: true, glitch: true, flash: true, particleScale: 1 });
  });

  it('efeitos reduzidos desligam rotação, tremor, glitch e flash e diminuem partículas', () => {
    const p = effectProfile(true);
    expect([p.tilt, p.shake, p.glitch, p.flash]).toEqual([false, false, false, false]);
    expect(p.particleScale).toBe(0.5);
  });

  it('baixo desempenho reduz as partículas sem desligar efeitos', () => {
    const p = effectProfile(false, true);
    expect(p.tilt).toBe(true);
    expect(p.particleScale).toBeLessThan(1);
    expect(effectProfile(true, true).particleScale).toBeLessThan(effectProfile(true).particleScale);
  });
});

describe('cores do combo', () => {
  it('cada nível tem uma cor e o teto se repete', () => {
    expect(comboColor(1)).toBe(COLORS.ink);
    expect(comboColor(2)).toBe(COLORS.gold);
    expect(comboColor(3)).not.toBe(comboColor(2));
    expect(comboColor(99)).toBe(comboColor(5));
    expect(comboColor(0)).toBe(comboColor(1));
  });

  it('converte para CSS', () => {
    expect(toCss(0x19f0ff)).toBe('#19f0ff');
    expect(toCss(0x0b0b1e)).toBe('#0b0b1e');
    expect(toCss(0xff)).toBe('#0000ff');
  });
});
