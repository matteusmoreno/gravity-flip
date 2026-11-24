import Phaser from 'phaser';
import { COLORS, LOGICAL_HEIGHT, LOGICAL_WIDTH, MAX_MULTIPLIER, START_LIVES } from '@/core/constants';
import { comboColor, toCss } from '@/core/effects';
import { FONT_DISPLAY } from '@/game/render/world';
import type { GameScene } from './GameScene';

export interface PopupRequest {
  text: string;
  x: number;
  y: number;
  color: string;
  size: number;
}

/**
 * HUD em cena própria, por cima do jogo: não inclina nem treme junto com o cenário,
 * então os números ficam sempre legíveis.
 */
export class HudScene extends Phaser.Scene {
  private gameScene!: GameScene;
  private gfx!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private countdownText!: Phaser.GameObjects.Text;
  private lastMultiplier = 1;

  constructor() {
    super('HudScene');
  }

  create(): void {
    this.gameScene = this.scene.get('GameScene') as GameScene;
    this.lastMultiplier = 1;
    this.gfx = this.add.graphics();
    this.scoreText = this.add
      .text(LOGICAL_WIDTH / 2, 12, '0', { color: '#eaf6ff', fontSize: '44px', fontStyle: 'bold', fontFamily: FONT_DISPLAY })
      .setOrigin(0.5, 0);
    this.comboText = this.add
      .text(LOGICAL_WIDTH / 2, 66, '', { color: '#ffe94d', fontSize: '26px', fontStyle: 'bold', fontFamily: FONT_DISPLAY })
      .setOrigin(0.5, 0);
    this.countdownText = this.add
      .text(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2, '', { color: '#19f0ff', fontSize: '120px', fontStyle: 'bold', fontFamily: FONT_DISPLAY })
      .setOrigin(0.5);

    this.gameScene.events.on('hud:popup', this.onPopup, this);
    this.events.once('shutdown', () => this.gameScene.events.off('hud:popup', this.onPopup, this));
  }

  override update(): void {
    const s = this.gameScene.hudState();
    const g = this.gfx;
    g.clear();

    this.scoreText.setText(String(s.score));

    // Multiplicador: cor por nível e um "pulso" quando sobe.
    const m = s.multiplier;
    this.comboText.setText(m > 1 ? `x${m}` : '').setColor(toCss(comboColor(m)));
    if (m > this.lastMultiplier) {
      this.tweens.add({ targets: this.comboText, scale: { from: 1.6, to: 1 }, duration: 240, ease: 'Back.Out' });
    }
    this.lastMultiplier = m;

    if (s.comboCount > 0 || m > 1) {
      const w = 140;
      const x = LOGICAL_WIDTH / 2 - w / 2;
      const y = m > 1 ? 100 : 72;
      g.fillStyle(COLORS.night2, 0.9).fillRect(x, y, w, 8);
      g.fillStyle(comboColor(m), 1).fillRect(x, y, w * s.comboProgress, 8);
      if (m >= MAX_MULTIPLIER) g.lineStyle(2, COLORS.gold, 1).strokeRect(x, y, w, 8);
    }

    for (let i = 0; i < START_LIVES; i++) drawHeart(g, 34 + i * 40, 36, 12, i < s.lives);
    if (s.shield) {
      const sx = 34 + START_LIVES * 40 + 6;
      g.lineStyle(4, COLORS.shield, 1).strokeCircle(sx, 36, 13);
      g.fillStyle(COLORS.shield, 1).fillCircle(sx, 36, 5);
    }

    this.countdownText.setText(s.countdownMs > 0 ? String(Math.ceil(s.countdownMs / 1000)) : '');
  }

  private onPopup(p: PopupRequest): void {
    const t = this.add
      .text(p.x, p.y, p.text, { color: p.color, fontSize: `${p.size}px`, fontStyle: 'bold', fontFamily: FONT_DISPLAY })
      .setOrigin(0.5);
    this.tweens.add({ targets: t, y: p.y - 40, alpha: 0, duration: 900, onComplete: () => t.destroy() });
  }
}

/** Coração feito de dois círculos e um triângulo; vazado quando a vida foi perdida. */
function drawHeart(g: Phaser.GameObjects.Graphics, cx: number, cy: number, s: number, filled: boolean): void {
  const left = cx - s / 2;
  const right = cx + s / 2;
  const r = s / 2 + 1;
  if (filled) {
    g.fillStyle(COLORS.magenta, 1);
    g.fillCircle(left, cy, r).fillCircle(right, cy, r);
    g.fillTriangle(cx - s - 1, cy + 2, cx + s + 1, cy + 2, cx, cy + s * 1.15);
  } else {
    g.lineStyle(2, COLORS.magenta, 0.45);
    g.strokeCircle(left, cy, r).strokeCircle(right, cy, r);
    g.lineBetween(cx - s - 1, cy + 2, cx, cy + s * 1.15).lineBetween(cx + s + 1, cy + 2, cx, cy + s * 1.15);
  }
}
