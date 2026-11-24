import type Phaser from 'phaser';
import {
  COLORS,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  PLAYER_RADIUS,
  SKYLINE_WIDTH,
  SURFACE_MARGIN,
} from '@/core/constants';
import type { Shockwave } from '@/core/effects';
import type { ParticleSystem } from '@/core/particles';
import { generateSkyline, windowLit, type SkylineLayer } from '@/core/skyline';

export const FONT_DISPLAY = '"Orbitron", ui-sans-serif, system-ui, sans-serif';

const FLOOR_Y = LOGICAL_HEIGHT - SURFACE_MARGIN;
const CEIL_Y = SURFACE_MARGIN;

export interface SkylineSpec {
  layer: SkylineLayer;
  /** Fração da velocidade do jogo: camadas distantes andam mais devagar (parallax). */
  factor: number;
  alpha: number;
  windows: boolean;
}

/** Três camadas de cidade neon: longe, meio e perto. Prédios sobem do chão e descem do teto. */
export function createSkylines(seed: number): SkylineSpec[] {
  return [
    {
      layer: generateSkyline(seed + 1, SKYLINE_WIDTH, { minWidth: 70, maxWidth: 150, minHeight: 100, maxHeight: 220 }),
      factor: 0.08,
      alpha: 0.28,
      windows: false,
    },
    {
      layer: generateSkyline(seed + 2, SKYLINE_WIDTH, { minWidth: 60, maxWidth: 130, minHeight: 90, maxHeight: 190 }),
      factor: 0.18,
      alpha: 0.4,
      windows: true,
    },
    {
      layer: generateSkyline(seed + 3, SKYLINE_WIDTH, { minWidth: 50, maxWidth: 110, minHeight: 70, maxHeight: 150 }),
      factor: 0.35,
      alpha: 0.55,
      windows: true,
    },
  ];
}

/** Desenha a cidade ao fundo. travelPx é a distância total já percorrida; detail desliga as janelas. */
export function drawSkylines(g: Phaser.GameObjects.Graphics, skylines: SkylineSpec[], travelPx: number, detail: boolean): void {
  for (const s of skylines) {
    const { buildings, width } = s.layer;
    const offset = (travelPx * s.factor) % width;
    for (const copy of [0, 1]) {
      buildings.forEach((b, i) => {
        const bx = b.x - offset + copy * width;
        if (bx > LOGICAL_WIDTH || bx + b.w < 0) return;
        const w = b.w - 2;
        const upperH = buildings[(i * 7 + 3) % buildings.length]!.h;

        g.fillStyle(COLORS.night2, s.alpha).fillRect(bx, FLOOR_Y - b.h, w, b.h);
        g.lineStyle(2, COLORS.cyan, s.alpha * 0.6).lineBetween(bx, FLOOR_Y - b.h, bx + w, FLOOR_Y - b.h);
        g.fillStyle(COLORS.night2, s.alpha).fillRect(bx, CEIL_Y, w, upperH);
        g.lineStyle(2, COLORS.magenta, s.alpha * 0.6).lineBetween(bx, CEIL_Y + upperH, bx + w, CEIL_Y + upperH);

        if (detail && s.windows) {
          const cols = Math.max(1, Math.floor(w / 20));
          for (let r = 0; r < Math.min(6, Math.floor(b.h / 28)); r++) {
            for (let c = 0; c < cols; c++) {
              if (windowLit(b.x, c, r)) {
                g.fillStyle(COLORS.cyan, s.alpha * 0.7).fillRect(bx + 6 + c * 20, FLOOR_Y - b.h + 8 + r * 28, 6, 10);
              }
            }
          }
          for (let r = 0; r < Math.min(6, Math.floor(upperH / 28)); r++) {
            for (let c = 0; c < cols; c++) {
              if (windowLit(b.x + 1, c, r)) {
                g.fillStyle(COLORS.magenta, s.alpha * 0.7).fillRect(bx + 6 + c * 20, CEIL_Y + 8 + r * 28, 6, 10);
              }
            }
          }
        }
      });
    }
  }
}

/** Chão ciano e teto magenta, com marcas que rolam para dar sensação de velocidade. */
export function drawSurfaces(
  g: Phaser.GameObjects.Graphics,
  glow: Phaser.GameObjects.Graphics,
  scrollX: number,
  glowOn = true,
): void {
  g.lineStyle(4, COLORS.cyan, 1).lineBetween(0, FLOOR_Y, LOGICAL_WIDTH, FLOOR_Y);
  g.lineStyle(4, COLORS.magenta, 1).lineBetween(0, CEIL_Y, LOGICAL_WIDTH, CEIL_Y);
  if (glowOn) {
    glow.lineStyle(14, COLORS.cyan, 0.14).lineBetween(0, FLOOR_Y, LOGICAL_WIDTH, FLOOR_Y);
    glow.lineStyle(14, COLORS.magenta, 0.14).lineBetween(0, CEIL_Y, LOGICAL_WIDTH, CEIL_Y);
  }
  for (let x = -scrollX; x < LOGICAL_WIDTH; x += 80) {
    g.lineStyle(2, COLORS.cyan, 0.25).lineBetween(x, FLOOR_Y, x - 24, FLOOR_Y + 18);
    g.lineStyle(2, COLORS.magenta, 0.25).lineBetween(x, CEIL_Y, x - 24, CEIL_Y - 18);
  }
}

export interface OrbStyle {
  sx: number;
  sy: number;
  alpha: number;
}

/** Esfera com núcleo luminoso, esticada na direção do movimento. */
export function drawOrb(g: Phaser.GameObjects.Graphics, glow: Phaser.GameObjects.Graphics, x: number, y: number, o: OrbStyle): void {
  glow.fillStyle(COLORS.cyan, 0.16 * o.alpha).fillCircle(x, y, PLAYER_RADIUS * 2.2);
  g.fillStyle(COLORS.cyan, 0.25 * o.alpha).fillCircle(x, y, PLAYER_RADIUS * 1.6);
  g.fillStyle(COLORS.cyan, o.alpha).fillEllipse(x, y, PLAYER_RADIUS * 2 * o.sx, PLAYER_RADIUS * 2 * o.sy);
  g.fillStyle(COLORS.ink, o.alpha).fillCircle(x, y, PLAYER_RADIUS * 0.45);
}

export function drawTrail(g: Phaser.GameObjects.Graphics, trail: readonly { x: number; y: number }[], step = 14): void {
  const n = trail.length;
  trail.forEach((p, i) => {
    const k = 1 - i / Math.max(1, n);
    g.fillStyle(COLORS.cyan, 0.35 * k).fillCircle(p.x - i * step, p.y, PLAYER_RADIUS * k);
  });
}

export function drawParticles(g: Phaser.GameObjects.Graphics, glow: Phaser.GameObjects.Graphics, ps: ParticleSystem, glowOn = true): void {
  for (const p of ps.particles) {
    const k = Math.max(0, p.life / p.maxLife);
    if (glowOn) glow.fillStyle(p.color, 0.45 * k).fillCircle(p.x, p.y, p.size * k * 2);
    g.fillStyle(p.color, k).fillCircle(p.x, p.y, Math.max(0.5, p.size * k));
  }
}

export function drawShockwave(glow: Phaser.GameObjects.Graphics, x: number, y: number, sw: Shockwave, color: number, strength = 1): void {
  glow.lineStyle(6, color, sw.alpha * 0.5 * strength).strokeCircle(x, y, sw.radius);
  glow.lineStyle(2, color, sw.alpha * strength).strokeCircle(x, y, sw.radius);
}
