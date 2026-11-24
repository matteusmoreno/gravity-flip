import {
  FIXED_STEP_MS,
  FLIP_COOLDOWN_MS,
  HITBOX_SCALE,
  PLAYER_RADIUS,
  SURFACE_MARGIN,
  LOGICAL_HEIGHT,
} from '../constants';
import { circleIntersectsRect, type Rect } from '../geometry';
import { oppositeSide, type Side } from '../flip';
import { stepBody, type Bounds } from '../playerBody';
import { obstacleRects } from './obstacles';
import { patternWidth, type Pattern } from './types';

interface SimState {
  side: Side;
  cooldownMs: number;
  y: number;
  vy: number;
}

const BOUNDS: Bounds = {
  top: SURFACE_MARGIN + PLAYER_RADIUS,
  bottom: LOGICAL_HEIGHT - SURFACE_MARGIN - PLAYER_RADIUS,
};

const keyOf = (s: SimState): string =>
  `${s.side}|${s.cooldownMs.toFixed(2)}|${s.y.toFixed(2)}|${s.vy.toFixed(2)}`;

/**
 * Verifica se existe alguma sequência de inversões que atravessa o trecho sem colidir,
 * simulando a mesma física do jogo (passo fixo, recarga, hitbox reduzida).
 * Parte do jogador parado em qualquer superfície com a recarga pronta; o espaço vazio
 * entre trechos garante essa posição de partida.
 */
export function isPatternPassable(pattern: Pattern, speed: number): boolean {
  const dtMs = FIXED_STEP_MS;
  const dtSec = dtMs / 1000;
  const radius = PLAYER_RADIUS * HITBOX_SCALE;
  const rects: Rect[] = pattern.obstacles.flatMap((o) => obstacleRects(o, 0));
  const totalSteps = Math.ceil(((patternWidth(pattern) + radius) / speed) * 1000 / dtMs) + 2;

  let layer = new Map<string, SimState>();
  (['floor', 'ceiling'] as const).forEach((side) => {
    const s: SimState = { side, cooldownMs: 0, y: side === 'floor' ? BOUNDS.bottom : BOUNDS.top, vy: 0 };
    layer.set(keyOf(s), s);
  });

  for (let step = 1; step <= totalSteps; step++) {
    const offsetX = speed * dtSec * step;
    const next = new Map<string, SimState>();

    for (const state of layer.values()) {
      const options: SimState[] = [state];
      if (state.cooldownMs <= 0) {
        options.push({ ...state, side: oppositeSide(state.side), cooldownMs: FLIP_COOLDOWN_MS });
      }
      for (const opt of options) {
        const body = { y: opt.y, vy: opt.vy };
        const cooldownMs = Math.max(0, opt.cooldownMs - dtMs);
        stepBody(body, opt.side, dtSec, BOUNDS);
        const hit = rects.some((r) => circleIntersectsRect(0, body.y, radius, { ...r, x: r.x - offsetX }));
        if (hit) continue;
        const ns: SimState = { side: opt.side, cooldownMs, y: body.y, vy: body.vy };
        next.set(keyOf(ns), ns);
      }
    }
    if (next.size === 0) return false;
    layer = next;
  }
  return true;
}
