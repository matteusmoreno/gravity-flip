import { describe, expect, it } from 'vitest';
import { generateSkyline, windowLit } from '@/core/skyline';

const o = { minWidth: 60, maxWidth: 140, minHeight: 80, maxHeight: 300 };

describe('generateSkyline', () => {
  it('cobre exatamente a largura, sem lacunas nem sobreposição', () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      const s = generateSkyline(seed, 1700, o);
      let x = 0;
      for (const b of s.buildings) {
        expect(b.x).toBe(x);
        x += b.w;
      }
      expect(x).toBe(1700);
    }
  });

  it('respeita os limites de altura e de largura (o último pode absorver a sobra)', () => {
    const s = generateSkyline(7, 1700, o);
    for (const b of s.buildings) {
      expect(b.h).toBeGreaterThanOrEqual(80);
      expect(b.h).toBeLessThanOrEqual(300);
      expect(b.w).toBeGreaterThanOrEqual(60);
      expect(b.w).toBeLessThanOrEqual(2 * 140);
    }
  });

  it('é determinístico e muda com a seed', () => {
    expect(generateSkyline(5, 1700, o)).toEqual(generateSkyline(5, 1700, o));
    expect(generateSkyline(5, 1700, o)).not.toEqual(generateSkyline(6, 1700, o));
  });
});

describe('windowLit', () => {
  it('é determinístico', () => {
    expect(windowLit(100, 2, 3)).toBe(windowLit(100, 2, 3));
  });

  it('a proporção de janelas acesas fica perto do pedido', () => {
    let lit = 0;
    const total = 4000;
    for (let i = 0; i < total; i++) if (windowLit(i * 37, i % 7, i % 11, 0.4)) lit++;
    expect(lit / total).toBeGreaterThan(0.3);
    expect(lit / total).toBeLessThan(0.5);
  });
});
