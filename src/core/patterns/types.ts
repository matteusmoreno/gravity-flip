import type { Side } from '../flip';

export type ObstacleType = 'block' | 'spike' | 'barrier';

export interface ObstacleDef {
  type: ObstacleType;
  /** Posição horizontal relativa ao início do trecho. */
  x: number;
  width: number;
  /** Bloco e espinho: superfície onde fica. Barreira: lado onde fica a passagem. */
  side: Side;
  /** Altura de bloco e espinho (ignorada na barreira). */
  height: number;
}

export interface Pattern {
  id: string;
  minStage: number;
  maxStage: number;
  obstacles: ObstacleDef[];
}

export const patternWidth = (p: Pattern): number =>
  Math.max(...p.obstacles.map((o) => o.x + o.width));
