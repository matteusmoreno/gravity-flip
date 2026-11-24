import { GRAVITY_ACCEL, MAX_FALL_SPEED } from './constants';
import type { Side } from './flip';

export interface Body {
  y: number;
  vy: number;
}

export interface Bounds {
  top: number;
  bottom: number;
}

/**
 * Passo de física vertical: aceleração constante em direção à superfície alvo.
 * Retorna true no passo em que o corpo pousa na superfície alvo.
 */
export function stepBody(body: Body, side: Side, dtSec: number, bounds: Bounds): boolean {
  const dir = side === 'floor' ? 1 : -1;
  const target = side === 'floor' ? bounds.bottom : bounds.top;
  const wasAtTarget = body.y === target;

  body.vy = Math.max(-MAX_FALL_SPEED, Math.min(MAX_FALL_SPEED, body.vy + dir * GRAVITY_ACCEL * dtSec));
  body.y += body.vy * dtSec;

  if (body.y >= bounds.bottom) {
    body.y = bounds.bottom;
    body.vy = 0;
  } else if (body.y <= bounds.top) {
    body.y = bounds.top;
    body.vy = 0;
  }
  return !wasAtTarget && body.y === target;
}
