import { describe, expect, it } from 'vitest';
import { mirrorPattern, PatternGenerator } from '@/core/generator';
import { speedForStage } from '@/core/difficulty';
import { PATTERN_LIBRARY } from '@/core/patterns/library';
import { isPatternPassable } from '@/core/patterns/validator';
import type { ObstacleDef, Pattern } from '@/core/patterns/types';
import { MAX_STAGE } from '@/core/constants';

const mk = (obstacles: ObstacleDef[]): Pattern => ({ id: 'teste', minStage: 0, maxStage: MAX_STAGE, obstacles });
const block = (x: number, side: 'floor' | 'ceiling', width = 80, height = 90): ObstacleDef => ({ type: 'block', x, width, side, height });
const barrier = (x: number, side: 'floor' | 'ceiling'): ObstacleDef => ({ type: 'barrier', x, width: 40, side, height: 0 });

describe('validador de trechos', () => {
  it('aceita um bloco simples', () => {
    expect(isPatternPassable(mk([block(0, 'floor')]), speedForStage(0))).toBe(true);
  });

  it('reprova bloco no chão e no teto no mesmo ponto', () => {
    expect(isPatternPassable(mk([block(0, 'floor'), block(0, 'ceiling')]), speedForStage(0))).toBe(false);
  });

  it('reprova duas barreiras coladas com passagens em lados opostos', () => {
    expect(isPatternPassable(mk([barrier(0, 'ceiling'), barrier(60, 'floor')]), speedForStage(0))).toBe(false);
  });

  it('o mesmo par de barreiras é possível devagar e impossível rápido', () => {
    const pair = mk([barrier(0, 'ceiling'), barrier(240, 'floor')]);
    expect(isPatternPassable(pair, speedForStage(0))).toBe(true);
    expect(isPatternPassable(pair, speedForStage(MAX_STAGE))).toBe(false);
  });
});

describe('biblioteca de trechos', () => {
  it('tem ao menos 12 trechos com ids únicos', () => {
    expect(PATTERN_LIBRARY.length).toBeGreaterThanOrEqual(12);
    expect(new Set(PATTERN_LIBRARY.map((p) => p.id)).size).toBe(PATTERN_LIBRARY.length);
  });

  it.each(PATTERN_LIBRARY.map((p) => [p.id, p] as const))('%s é jogável (normal e espelhado) em todos os seus estágios', (_id, pattern) => {
    expect(pattern.maxStage).toBeGreaterThanOrEqual(pattern.minStage);
    for (let stage = pattern.minStage; stage <= pattern.maxStage; stage++) {
      const speed = speedForStage(stage);
      expect(isPatternPassable(pattern, speed), `normal, estágio ${stage}`).toBe(true);
      expect(isPatternPassable(mirrorPattern(pattern), speed), `espelhado, estágio ${stage}`).toBe(true);
    }
  });

  it('todo estágio tem ao menos 5 trechos disponíveis', () => {
    for (let stage = 0; stage <= MAX_STAGE; stage++) {
      const n = PATTERN_LIBRARY.filter((p) => stage >= p.minStage && stage <= p.maxStage).length;
      expect(n, `estágio ${stage}`).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('gerador de trechos', () => {
  it('é determinístico para a mesma seed', () => {
    const a = new PatternGenerator(PATTERN_LIBRARY, 42);
    const b = new PatternGenerator(PATTERN_LIBRARY, 42);
    const seqA = Array.from({ length: 30 }, () => a.next(3).id);
    const seqB = Array.from({ length: 30 }, () => b.next(3).id);
    expect(seqA).toEqual(seqB);
  });

  it('não repete o mesmo trecho em sequência', () => {
    const g = new PatternGenerator(PATTERN_LIBRARY, 7);
    let last = '';
    for (let i = 0; i < 200; i++) {
      const base = g.next(4).id.replace(':m', '');
      expect(base).not.toBe(last);
      last = base;
    }
  });

  it('só sorteia trechos permitidos para o estágio', () => {
    const g = new PatternGenerator(PATTERN_LIBRARY, 1);
    for (let i = 0; i < 100; i++) {
      const id = g.next(0).id.replace(':m', '');
      const p = PATTERN_LIBRARY.find((x) => x.id === id)!;
      expect(p.minStage).toBe(0);
    }
  });

  it('usa trechos normais e espelhados', () => {
    const g = new PatternGenerator(PATTERN_LIBRARY, 3);
    const ids = Array.from({ length: 100 }, () => g.next(2).id);
    expect(ids.some((id) => id.endsWith(':m'))).toBe(true);
    expect(ids.some((id) => !id.endsWith(':m'))).toBe(true);
  });
});
