import { describe, expect, it } from 'vitest';
import { PatternGenerator } from '@/core/generator';
import { PATTERN_LIBRARY } from '@/core/patterns/library';

describe('sorteio ponderado por estágio', () => {
  it('trechos recém-liberados aparecem mais do que os antigos', () => {
    const g = new PatternGenerator(PATTERN_LIBRARY, 2024);
    const counts = new Map<string, number>();
    for (let i = 0; i < 6000; i++) {
      const id = g.next(3).id.replace(':m', '');
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    const fresh = counts.get('barrier-chain') ?? 0; // minStage 3
    const old = counts.get('floor-block') ?? 0; // minStage 0
    expect(fresh).toBeGreaterThan(old * 1.4);
  });

  it('continua sem repetir o mesmo trecho em sequência', () => {
    const g = new PatternGenerator(PATTERN_LIBRARY, 5);
    let last = '';
    for (let i = 0; i < 500; i++) {
      const id = g.next(3).id.replace(':m', '');
      expect(id).not.toBe(last);
      last = id;
    }
  });
});
