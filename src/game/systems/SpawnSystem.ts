import {
  COIN_GROUP_CHANCE,
  COIN_RADIUS,
  FIXED_STEP_MS,
  GRAVITY_ACCEL,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  PICKUP_RADIUS,
  PLAYER_RADIUS,
  SHIELD_PICKUP_CHANCE,
  SURFACE_MARGIN,
} from '@/core/constants';
import { gapForSpeed } from '@/core/difficulty';
import type { Side } from '@/core/flip';
import type { PatternGenerator } from '@/core/generator';
import type { Rect } from '@/core/geometry';
import { obstacleRects } from '@/core/patterns/obstacles';
import { patternWidth, type ObstacleDef, type Pattern } from '@/core/patterns/types';
import { createRng } from '@/core/rng';

export interface ActiveObstacle {
  def: ObstacleDef;
  /** Posição horizontal atual na tela. */
  x: number;
  hit: boolean;
  /** Menor distância já registrada entre a esfera e o obstáculo (para quase-colisão). */
  minGap: number;
  nearMissChecked: boolean;
}

export interface Point {
  x: number;
  y: number;
}

const SPAWN_AHEAD = 120;
const FIRST_PATTERN_X = LOGICAL_WIDTH;
const TOP_Y = SURFACE_MARGIN + PLAYER_RADIUS;
const BOTTOM_Y = LOGICAL_HEIGHT - SURFACE_MARGIN - PLAYER_RADIUS;
const surfaceY = (side: Side): number => (side === 'floor' ? BOTTOM_Y : TOP_Y);

/** Cria, move e descarta obstáculos, moedas e itens conforme os trechos sorteados. */
export class SpawnSystem {
  obstacles: ActiveObstacle[] = [];
  pickups: Point[] = [];
  coins: Point[] = [];
  private nextPatternX = FIRST_PATTERN_X;
  private readonly pickupRng: () => number;
  private readonly coinRng: () => number;

  constructor(
    private readonly generator: PatternGenerator,
    seed: number,
  ) {
    this.pickupRng = createRng((seed ^ 0x9e3779b9) >>> 0);
    this.coinRng = createRng((seed ^ 0x51ed270b) >>> 0);
  }

  update(dx: number, stage: number, speed: number): void {
    this.nextPatternX -= dx;
    for (const o of this.obstacles) o.x -= dx;
    for (const p of this.pickups) p.x -= dx;
    for (const c of this.coins) c.x -= dx;
    this.obstacles = this.obstacles.filter((o) => o.x + o.def.width > -SPAWN_AHEAD);
    this.pickups = this.pickups.filter((p) => p.x > -SPAWN_AHEAD);
    this.coins = this.coins.filter((c) => c.x > -SPAWN_AHEAD);

    while (this.nextPatternX < LOGICAL_WIDTH + SPAWN_AHEAD) {
      const pattern = this.generator.next(stage);
      for (const def of pattern.obstacles) {
        this.obstacles.push({
          def,
          x: this.nextPatternX + def.x,
          hit: false,
          minGap: Infinity,
          nearMissChecked: false,
        });
      }
      this.addSafeLaneCoins(pattern, this.nextPatternX);

      const width = patternWidth(pattern);
      const gap = gapForSpeed(speed);
      const gapStart = this.nextPatternX + width;
      const shieldPlaced = this.maybeSpawnShield(gapStart + gap / 2);
      if (!shieldPlaced) this.maybeSpawnCoinGroup(gapStart, gap, speed);
      this.nextPatternX += width + gap;
    }
  }

  /** Remove e conta os itens tocados pelo círculo do jogador. */
  collectPickups(px: number, py: number, playerRadius: number): number {
    return this.collectFrom('pickups', px, py, playerRadius + PICKUP_RADIUS);
  }

  collectCoins(px: number, py: number, playerRadius: number): number {
    return this.collectFrom('coins', px, py, playerRadius + COIN_RADIUS);
  }

  /** Retângulos de colisão atuais de um obstáculo (em coordenadas de tela). */
  rectsOf(o: ActiveObstacle): Rect[] {
    return obstacleRects({ ...o.def, x: 0 }, o.x);
  }

  private collectFrom(list: 'pickups' | 'coins', px: number, py: number, reach: number): number {
    const before = this[list].length;
    this[list] = this[list].filter((p) => (p.x - px) ** 2 + (p.y - py) ** 2 > reach * reach);
    return before - this[list].length;
  }

  /** Itens ficam no espaço vazio entre trechos, nunca dentro de obstáculos; só um por vez. */
  private maybeSpawnShield(x: number): boolean {
    if (this.pickups.length > 0 || this.pickupRng() >= SHIELD_PICKUP_CHANCE) return false;
    this.pickups.push({ x, y: this.pickupRng() < 0.5 ? TOP_Y : BOTTOM_Y });
    return true;
  }

  /** Moedas na "pista segura": o lado onde o jogador precisa estar para passar de cada obstáculo. */
  private addSafeLaneCoins(pattern: Pattern, originX: number): void {
    for (const o of pattern.obstacles) {
      const safeSide: Side = o.type === 'barrier' ? o.side : o.side === 'floor' ? 'ceiling' : 'floor';
      const count = o.type === 'barrier' ? 1 : Math.max(2, Math.floor(o.width / 40));
      for (let i = 0; i < count; i++) {
        this.coins.push({ x: originX + o.x + ((i + 0.5) * o.width) / count, y: surfaceY(safeSide) });
      }
    }
  }

  /** Grupos de moedas no espaço vazio: linha em um lado, ou arco seguindo a trajetória da inversão. */
  private maybeSpawnCoinGroup(gapStart: number, gap: number, speed: number): void {
    if (this.coinRng() >= COIN_GROUP_CHANCE) return;
    const kind = this.coinRng();
    const startX = gapStart + gap * 0.2;

    if (kind < 0.5) {
      const y = surfaceY(this.coinRng() < 0.5 ? 'floor' : 'ceiling');
      for (let i = 0; i < 5; i++) this.coins.push({ x: startX + i * 48, y });
      return;
    }
    // Arco: pontos da trajetória real (mesma física do jogo) de quem inverte no início do arco.
    const goingUp = kind < 0.75;
    const dtSec = FIXED_STEP_MS / 1000;
    for (let k = 1; k <= 6; k++) {
      const n = k * 3; // passos de 1/60 s
      const offset = GRAVITY_ACCEL * dtSec * dtSec * ((n * (n + 1)) / 2);
      const y = goingUp ? BOTTOM_Y - offset : TOP_Y + offset;
      this.coins.push({ x: startX + speed * ((n * dtSec)), y: Math.min(BOTTOM_Y, Math.max(TOP_Y, y)) });
    }
  }
}
