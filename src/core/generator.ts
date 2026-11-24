import { oppositeSide } from './flip';
import { createRng } from './rng';
import type { Pattern } from './patterns/types';

/** Espelha um trecho (chão e teto trocam de lugar). A física é simétrica, então a validade se mantém. */
export function mirrorPattern(pattern: Pattern): Pattern {
  return {
    ...pattern,
    id: `${pattern.id}:m`,
    obstacles: pattern.obstacles.map((o) => ({ ...o, side: oppositeSide(o.side) })),
  };
}

/** Trechos liberados no estágio atual ou no anterior aparecem com o dobro de peso. */
const FRESH_WEIGHT = 2;

/** Sorteia trechos compatíveis com o estágio, sem repetir o mesmo trecho em sequência. */
export class PatternGenerator {
  private readonly rng: () => number;
  private lastBaseId: string | null = null;

  constructor(
    private readonly library: readonly Pattern[],
    seed: number,
  ) {
    this.rng = createRng(seed);
  }

  next(stage: number): Pattern {
    const eligible = this.library.filter((p) => stage >= p.minStage && stage <= p.maxStage);
    if (eligible.length === 0) throw new Error(`Nenhum trecho disponível para o estágio ${stage}`);
    const pool = eligible.length > 1 ? eligible.filter((p) => p.id !== this.lastBaseId) : eligible;
    const weights = pool.map((p) => (stage - p.minStage <= 1 ? FRESH_WEIGHT : 1));
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = this.rng() * total;
    let chosen = pool[pool.length - 1]!;
    for (let i = 0; i < pool.length; i++) {
      roll -= weights[i]!;
      if (roll < 0) {
        chosen = pool[i]!;
        break;
      }
    }
    this.lastBaseId = chosen.id;
    return this.rng() < 0.5 ? mirrorPattern(chosen) : chosen;
  }
}
