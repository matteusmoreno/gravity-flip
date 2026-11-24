import { BARRIER_GAP_HEIGHT, LOGICAL_HEIGHT, SURFACE_MARGIN } from '../constants';
import type { Rect } from '../geometry';
import type { ObstacleDef } from './types';

export const CEILING_Y = SURFACE_MARGIN;
export const FLOOR_Y = LOGICAL_HEIGHT - SURFACE_MARGIN;

/** Retângulos de colisão de um obstáculo, com origem horizontal em originX. */
export function obstacleRects(o: ObstacleDef, originX: number): Rect[] {
  const x = originX + o.x;
  if (o.type === 'barrier') {
    // side = lado da passagem; o resto da altura fica bloqueado.
    return o.side === 'ceiling'
      ? [{ x, y: CEILING_Y + BARRIER_GAP_HEIGHT, w: o.width, h: FLOOR_Y - CEILING_Y - BARRIER_GAP_HEIGHT }]
      : [{ x, y: CEILING_Y, w: o.width, h: FLOOR_Y - CEILING_Y - BARRIER_GAP_HEIGHT }];
  }
  return o.side === 'floor'
    ? [{ x, y: FLOOR_Y - o.height, w: o.width, h: o.height }]
    : [{ x, y: CEILING_Y, w: o.width, h: o.height }];
}
