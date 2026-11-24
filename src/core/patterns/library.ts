import type { Side } from '../flip';
import type { ObstacleDef, Pattern } from './types';
import { MAX_STAGE } from '../constants';

const block = (x: number, side: Side, width = 80, height = 90): ObstacleDef => ({ type: 'block', x, width, side, height });
const spike = (x: number, side: Side): ObstacleDef => ({ type: 'spike', x, width: 48, side, height: 50 });
/** side = lado da passagem. */
const barrier = (x: number, openSide: Side): ObstacleDef => ({ type: 'barrier', x, width: 40, side: openSide, height: 0 });

const p = (id: string, minStage: number, obstacles: ObstacleDef[], maxStage = MAX_STAGE): Pattern => ({
  id,
  minStage,
  maxStage,
  obstacles,
});

/** Biblioteca de trechos do MVP. Cada trecho é validado automaticamente em tests/unit/patterns.test.ts. */
export const PATTERN_LIBRARY: readonly Pattern[] = [
  p('floor-block', 0, [block(0, 'floor')]),
  p('ceiling-block', 0, [block(0, 'ceiling')]),
  p('floor-spike', 0, [spike(0, 'floor')]),
  p('ceiling-spike', 0, [spike(0, 'ceiling')]),
  p('spike-row-floor', 0, [spike(0, 'floor'), spike(110, 'floor'), spike(220, 'floor')]),
  p('spike-row-ceiling', 0, [spike(0, 'ceiling'), spike(110, 'ceiling'), spike(220, 'ceiling')]),
  p('barrier-open-top', 0, [barrier(0, 'ceiling')]),
  p('barrier-open-bottom', 0, [barrier(0, 'floor')]),
  p('block-pair-far', 0, [block(0, 'floor'), block(520, 'ceiling')]),
  p('zigzag-barriers', 1, [barrier(0, 'ceiling'), barrier(560, 'floor')]),
  p('triple-alternate', 1, [block(0, 'floor'), block(480, 'ceiling'), block(960, 'floor')]),
  p('spike-then-barrier', 1, [spike(0, 'floor'), barrier(420, 'floor')]),
  p('tight-pair', 2, [block(0, 'floor'), block(300, 'ceiling')]),
  p('tall-block-spike', 2, [block(0, 'floor', 100, 140), spike(340, 'ceiling')]),
  // Espaçamento curto: só é possível até a velocidade do estágio 5 (calibrado pelo validador).
  p('quick-zigzag', 2, [barrier(0, 'ceiling'), barrier(240, 'floor')], 5),
  p('barrier-chain', 3, [barrier(0, 'ceiling'), barrier(400, 'floor'), barrier(800, 'ceiling')]),
];
