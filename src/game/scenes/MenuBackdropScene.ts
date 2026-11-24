import Phaser from 'phaser';
import {
  BASE_SCROLL_SPEED,
  FIXED_STEP_MS,
  LOGICAL_HEIGHT,
  PLAYER_RADIUS,
  SURFACE_MARGIN,
  LOGICAL_WIDTH,
} from '@/core/constants';
import { stretchFor } from '@/core/effects';
import { FlipController } from '@/core/flip';
import { stepBody, type Body, type Bounds } from '@/core/playerBody';
import { createSkylines, drawOrb, drawSkylines, drawSurfaces, drawTrail, type SkylineSpec } from '@/game/render/world';

const ORB_X = LOGICAL_WIDTH * 0.25;
const AUTO_FLIP_EVERY_MS = 1800;
const TRAIL_LENGTH = 14;
const MENU_SPEED = BASE_SCROLL_SPEED * 0.6;

/** Fundo animado do menu: a esfera corre sozinha e inverte a gravidade de tempos em tempos. */
export class MenuBackdropScene extends Phaser.Scene {
  private flip = new FlipController();
  private body: Body = { y: 0, vy: 0 };
  private bounds: Bounds = { top: 0, bottom: 0 };
  private accumulatorMs = 0;
  private sinceFlipMs = 0;
  private scrollX = 0;
  private travelPx = 0;
  private trail: { x: number; y: number }[] = [];
  private skylines: SkylineSpec[] = [];
  private gfxBack!: Phaser.GameObjects.Graphics;
  private gfx!: Phaser.GameObjects.Graphics;
  private glow!: Phaser.GameObjects.Graphics;

  constructor() {
    super('MenuBackdropScene');
  }

  create(): void {
    this.bounds = {
      top: SURFACE_MARGIN + PLAYER_RADIUS,
      bottom: LOGICAL_HEIGHT - SURFACE_MARGIN - PLAYER_RADIUS,
    };
    this.flip.reset();
    this.body = { y: this.bounds.bottom, vy: 0 };
    this.accumulatorMs = 0;
    this.sinceFlipMs = 0;
    this.scrollX = 0;
    this.travelPx = 0;
    this.trail = [];
    this.skylines = createSkylines(7);
    this.gfxBack = this.add.graphics();
    this.gfx = this.add.graphics();
    this.glow = this.add.graphics().setBlendMode(Phaser.BlendModes.ADD);
    this.cameras.main.fadeIn(250, 11, 11, 30);
  }

  override update(_time: number, deltaMs: number): void {
    this.accumulatorMs = Math.min(this.accumulatorMs + deltaMs, FIXED_STEP_MS * 5);
    while (this.accumulatorMs >= FIXED_STEP_MS) {
      this.sinceFlipMs += FIXED_STEP_MS;
      if (this.sinceFlipMs >= AUTO_FLIP_EVERY_MS) {
        this.sinceFlipMs = 0;
        this.flip.requestFlip();
      }
      this.flip.update(FIXED_STEP_MS);
      stepBody(this.body, this.flip.side, FIXED_STEP_MS / 1000, this.bounds);
      const dx = (MENU_SPEED * FIXED_STEP_MS) / 1000;
      this.scrollX = (this.scrollX + dx) % 80;
      this.travelPx += dx;
      this.trail.unshift({ x: ORB_X, y: this.body.y });
      if (this.trail.length > TRAIL_LENGTH) this.trail.pop();
      this.accumulatorMs -= FIXED_STEP_MS;
    }
    this.render();
  }

  private render(): void {
    this.gfxBack.clear();
    this.gfx.clear();
    this.glow.clear();
    drawSkylines(this.gfxBack, this.skylines, this.travelPx, true);
    drawSurfaces(this.gfx, this.glow, this.scrollX);
    drawTrail(this.gfx, this.trail);
    const { sx, sy } = stretchFor(this.body.vy);
    drawOrb(this.gfx, this.glow, ORB_X, this.body.y, { sx, sy, alpha: 1 });
  }
}
