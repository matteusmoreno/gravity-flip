import { describe, expect, it } from 'vitest';
import { gapToRect, isNearMiss, minGapToRects } from '@/core/nearMiss';
import { NEAR_MISS_PX } from '@/core/constants';

const rect = { x: 100, y: 100, w: 50, h: 50 };

describe('quase-colisão', () => {
  it('mede a distância da borda do círculo ao retângulo', () => {
    expect(gapToRect(60, 125, 10, rect)).toBeCloseTo(30);
  });

  it('é negativa com sobreposição', () => {
    expect(gapToRect(110, 125, 10, rect)).toBeLessThan(0);
  });

  it('usa o retângulo mais próximo', () => {
    const far = { x: 500, y: 100, w: 50, h: 50 };
    expect(minGapToRects(60, 125, 10, [far, rect])).toBeCloseTo(30);
  });

  it('conta como quase-colisão só se chegou perto sem encostar', () => {
    expect(isNearMiss(NEAR_MISS_PX)).toBe(true);
    expect(isNearMiss(1)).toBe(true);
    expect(isNearMiss(NEAR_MISS_PX + 1)).toBe(false);
    expect(isNearMiss(0)).toBe(false);
    expect(isNearMiss(-5)).toBe(false);
    expect(isNearMiss(Infinity)).toBe(false);
  });
});
