import Phaser from 'phaser';
import {
  COIN_RADIUS,
  COLORS,
  FIXED_STEP_MS,
  GLITCH_MS,
  HITBOX_SCALE,
  LOGICAL_HEIGHT,
  LOGICAL_WIDTH,
  LOW_FPS_THRESHOLD,
  PICKUP_RADIUS,
  PLAYER_RADIUS,
  RESUME_COUNTDOWN_MS,
  START_LIVES,
  SURFACE_MARGIN,
} from '@/core/constants';
import { speedForStage, stageForTime } from '@/core/difficulty';
import { effectProfile, flipTilt, shockwave, stretchFor, type EffectProfile } from '@/core/effects';
import { FlipController } from '@/core/flip';
import { PatternGenerator } from '@/core/generator';
import { circleIntersectsRect } from '@/core/geometry';
import { HealthState } from '@/core/health';
import { isNearMiss, minGapToRects } from '@/core/nearMiss';
import { ParticleSystem } from '@/core/particles';
import { PATTERN_LIBRARY } from '@/core/patterns/library';
import { stepBody, type Body, type Bounds } from '@/core/playerBody';
import { ScoreState } from '@/core/scoring';
import {
  createSkylines,
  drawOrb,
  drawParticles,
  drawShockwave,
  drawSkylines,
  drawSurfaces,
  drawTrail,
  type SkylineSpec,
} from '@/game/render/world';
import type { SfxName } from '@/services/audio/sfx';
import { SpawnSystem, type ActiveObstacle } from '@/game/systems/SpawnSystem';
import { bus, type SettingsState } from '@/services/events';

const PLAYER_X = 320;
const TRAIL_LENGTH = 14;
const HITBOX_RADIUS = PLAYER_RADIUS * HITBOX_SCALE;
const DUST_EVERY_MS = 70;
const FLASH_MS = 200;

/** Dados que o HUD (em outra cena) lê a cada quadro. */
export interface HudState {
  score: number;
  multiplier: number;
  comboProgress: number;
  comboCount: number;
  lives: number;
  shield: boolean;
  countdownMs: number;
}

/** Cena de jogo: regras, obstáculos, itens e todo o visual do mundo. O HUD fica na HudScene. */
export class GameScene extends Phaser.Scene {
  private flip = new FlipController();
  private health = new HealthState();
  private score = new ScoreState();
  private particles = new ParticleSystem();
  private body: Body = { y: 0, vy: 0 };
  private bounds: Bounds = { top: 0, bottom: 0 };
  private accumulatorMs = 0;
  private elapsedMs = 0;
  private scrollX = 0;
  private travelPx = 0;
  private pendingScrollDx = 0;
  private lastStage = 0;
  private stage = 0;
  private speed = 0;
  private trail: { x: number; y: number }[] = [];
  private spawn!: SpawnSystem;
  private skylines: SkylineSpec[] = [];
  private touchingNow = new Set<ActiveObstacle>();
  private over = false;
  private paused = false;
  private countdownMs = 0;
  private flipDir: 1 | -1 = 1;
  private flipColor: number = COLORS.cyan;
  private sinceFlipMs = 9999;
  private glitchMs = 0;
  private dustMs = 0;
  private fpsTimerMs = 0;
  private slowChecks = 0;
  private lowPerf = false;
  private lastCountdownTick = 0;
  private seed = 0;
  private debug = false;
  private gfxBack!: Phaser.GameObjects.Graphics;
  private gfx!: Phaser.GameObjects.Graphics;
  private glow!: Phaser.GameObjects.Graphics;
  private debugText!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.bounds = {
      top: SURFACE_MARGIN + PLAYER_RADIUS,
      bottom: LOGICAL_HEIGHT - SURFACE_MARGIN - PLAYER_RADIUS,
    };
    const params = new URLSearchParams(window.location.search);
    this.flip.reset();
    this.health.reset();
    // ?lives=1 (1 a 3) é um atalho de teste para testar o fim de partida rapidamente.
    const lives = Number(params.get('lives'));
    if (Number.isInteger(lives) && lives >= 1 && lives <= START_LIVES) this.health.lives = lives;
    this.score = new ScoreState();
    this.particles = new ParticleSystem();
    this.body = { y: this.bounds.bottom, vy: 0 };
    this.accumulatorMs = 0;
    this.elapsedMs = 0;
    this.scrollX = 0;
    this.travelPx = 0;
    this.pendingScrollDx = 0;
    this.lastStage = 0;
    this.stage = 0;
    this.speed = speedForStage(0);
    this.trail = [];
    this.touchingNow = new Set();
    this.over = false;
    this.paused = false;
    this.countdownMs = 0;
    this.flipDir = 1;
    this.flipColor = COLORS.cyan;
    this.sinceFlipMs = 9999;
    this.glitchMs = 0;
    this.dustMs = 0;
    this.fpsTimerMs = 0;
    this.slowChecks = 0;
    this.lowPerf = false;
    this.lastCountdownTick = 0;
    this.debug = params.get('debug') === '1';

    // ?seed=123 na URL reproduz a mesma partida; sem ela, a seed é aleatória.
    const urlSeed = Number(params.get('seed'));
    this.seed = Number.isFinite(urlSeed) && urlSeed > 0 ? urlSeed : Math.floor(Math.random() * 2 ** 31);
    this.spawn = new SpawnSystem(new PatternGenerator(PATTERN_LIBRARY, this.seed), this.seed);
    this.skylines = createSkylines(this.seed);

    // Camadas: fundo, mundo e brilho aditivo por cima.
    this.gfxBack = this.add.graphics();
    this.gfx = this.add.graphics();
    this.glow = this.add.graphics().setBlendMode(Phaser.BlendModes.ADD);
    this.debugText = this.add
      .text(16, LOGICAL_HEIGHT - 26, '', { color: '#8fa3c7', fontSize: '14px' })
      .setDepth(10)
      .setVisible(this.debug);

    this.cameras.main.setRotation(0);
    this.cameras.main.setScroll(0, 0);
    this.cameras.main.fadeIn(250, 11, 11, 30);
    this.scene.launch('HudScene');

    const onFlip = () => {
      if (this.over || this.paused || this.countdownMs > 0) return;
      if (this.flip.requestFlip()) this.onFlipped();
    };
    const onKey = (e: KeyboardEvent) => !e.repeat && onFlip();
    this.input.on('pointerdown', onFlip);
    const keyboard = this.input.keyboard;
    keyboard?.on('keydown-SPACE', onKey);
    keyboard?.on('keydown-UP', onKey);

    // Pause e retomada vêm da interface; ao retomar, há uma contagem 3-2-1 antes de voltar ao jogo.
    const offPause = bus.on('game:pause', () => {
      this.paused = true;
    });
    const offResume = bus.on('game:resume', () => {
      this.paused = false;
      this.countdownMs = RESUME_COUNTDOWN_MS;
    });
    this.events.once('shutdown', () => {
      offPause();
      offResume();
      this.input.off('pointerdown', onFlip);
      keyboard?.off('keydown-SPACE', onKey);
      keyboard?.off('keydown-UP', onKey);
    });
  }

  /** Lido pela HudScene a cada quadro. */
  hudState(): HudState {
    return {
      score: this.score.score,
      multiplier: this.score.multiplier,
      comboProgress: this.score.comboProgress,
      comboCount: this.score.comboCount,
      lives: this.health.lives,
      shield: this.health.shield,
      countdownMs: this.countdownMs,
    };
  }

  override update(_time: number, deltaMs: number): void {
    // Passo fixo: o comportamento não depende da taxa de quadros. Limita o acúmulo após travadas.
    this.accumulatorMs = Math.min(this.accumulatorMs + deltaMs, FIXED_STEP_MS * 5);
    while (this.accumulatorMs >= FIXED_STEP_MS) {
      this.step(FIXED_STEP_MS);
      this.accumulatorMs -= FIXED_STEP_MS;
    }
    // Partículas e glitch são visuais: seguem o tempo real e continuam depois do fim de jogo.
    this.particles.update(Math.min(deltaMs, 50), this.pendingScrollDx);
    this.pendingScrollDx = 0;
    this.glitchMs = Math.max(0, this.glitchMs - deltaMs);
    this.monitorPerformance(deltaMs);
    this.render(this.profile());
  }

  private settings(): SettingsState | undefined {
    return this.registry.get('settings') as SettingsState | undefined;
  }

  private profile(): EffectProfile {
    return effectProfile(this.settings()?.reducedEffects ?? false, this.lowPerf);
  }

  /** Se o quadro por segundo cair de forma sustentada, reduz partículas e brilho automaticamente. */
  private monitorPerformance(deltaMs: number): void {
    this.fpsTimerMs += deltaMs;
    if (this.fpsTimerMs < 1000) return;
    this.fpsTimerMs = 0;
    const slow = this.game.loop.actualFps < LOW_FPS_THRESHOLD;
    this.slowChecks = slow ? Math.min(5, this.slowChecks + 1) : Math.max(0, this.slowChecks - 1);
    this.lowPerf = this.slowChecks >= 2 ? true : this.slowChecks === 0 ? false : this.lowPerf;
  }

  private step(dtMs: number): void {
    if (this.over) return;
    if (this.countdownMs > 0) {
      this.countdownMs = Math.max(0, this.countdownMs - dtMs);
      const tick = Math.ceil(this.countdownMs / 1000);
      if (tick !== this.lastCountdownTick) {
        this.lastCountdownTick = tick;
        if (tick > 0) this.sfx('tick');
      }
      return;
    }
    const profile = this.profile();
    this.elapsedMs += dtMs;
    this.sinceFlipMs += dtMs;

    this.stage = stageForTime(this.elapsedMs);
    this.speed = speedForStage(this.stage);
    const dx = (this.speed * dtMs) / 1000;
    if (this.stage > this.lastStage) {
      this.lastStage = this.stage;
      this.sfx('stage');
      bus.emit('audio:stage', { stage: this.stage });
      this.popup(`ESTÁGIO ${this.stage + 1}`, LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 60, '#19f0ff', 40);
      // Momento especial: glitch e tremor mais fortes (desligados nos efeitos reduzidos).
      if (profile.glitch) this.glitchMs = GLITCH_MS;
      if (profile.shake) this.cameras.main.shake(220, 0.004);
    }

    if (this.flip.update(dtMs)) this.onFlipped();
    this.health.update(dtMs);
    this.score.update(dtMs);
    const landed = stepBody(this.body, this.flip.side, dtMs / 1000, this.bounds);
    if (landed) {
      this.onLanded(profile);
      this.sfx('land');
    }
    this.emitDust(dtMs, profile);

    this.scrollX = (this.scrollX + dx) % 80;
    this.travelPx += dx;
    this.pendingScrollDx += dx;
    this.score.addDistance(dx);
    this.spawn.update(dx, this.stage, this.speed);
    this.checkObstacles();
    if (this.over) return;

    if (this.spawn.collectPickups(PLAYER_X, this.body.y, PLAYER_RADIUS) > 0) {
      this.health.collectShield();
      this.sfx('shield');
      this.particles.burst(PLAYER_X, this.body.y, 12, { speed: 220, life: 450, size: 4, colors: [COLORS.shield, COLORS.ink] }, profile.particleScale);
    }
    const coins = this.spawn.collectCoins(PLAYER_X, this.body.y, PLAYER_RADIUS);
    for (let i = 0; i < coins; i++) {
      this.score.collectCoin();
      this.sfx('coin', this.score.multiplier - 1);
      this.particles.burst(PLAYER_X + 12, this.body.y, 8, { speed: 180, life: 350, size: 3.5, colors: [COLORS.gold, COLORS.ink] }, profile.particleScale);
    }

    this.trail.unshift({ x: PLAYER_X, y: this.body.y });
    if (this.trail.length > TRAIL_LENGTH) this.trail.pop();
  }

  /** Efeito de inversão: inclinação do cenário, anel de luz e faíscas. A cor segue o lado para onde a esfera vai. */
  private onFlipped(): void {
    const profile = this.profile();
    this.flipDir = this.flip.side === 'floor' ? 1 : -1;
    this.flipColor = this.flip.side === 'floor' ? COLORS.cyan : COLORS.magenta;
    this.sinceFlipMs = 0;
    this.sfx('flip');
    this.particles.burst(
      PLAYER_X,
      this.body.y,
      8,
      { speed: 200, life: 320, size: 3, colors: [this.flipColor, COLORS.ink], angle: this.flipDir === 1 ? -Math.PI / 2 : Math.PI / 2, spread: 1.6 },
      profile.particleScale,
    );
  }

  private onLanded(profile: EffectProfile): void {
    const onFloor = this.flip.side === 'floor';
    const contactY = onFloor ? this.body.y + PLAYER_RADIUS : this.body.y - PLAYER_RADIUS;
    this.particles.burst(
      PLAYER_X,
      contactY,
      7,
      { speed: 150, life: 380, size: 3, colors: [onFloor ? COLORS.cyan : COLORS.magenta, COLORS.ink], angle: onFloor ? -Math.PI / 2 : Math.PI / 2, spread: 2.2, gravity: onFloor ? 200 : -200 },
      profile.particleScale,
    );
    if (profile.shake) this.cameras.main.shake(70, 0.0018);
  }

  /** Poeira de movimento enquanto a esfera corre colada na superfície. */
  private emitDust(dtMs: number, profile: EffectProfile): void {
    const resting = this.body.vy === 0 && (this.body.y === this.bounds.bottom || this.body.y === this.bounds.top);
    if (!resting) {
      this.dustMs = 0;
      return;
    }
    this.dustMs += dtMs;
    if (this.dustMs < DUST_EVERY_MS) return;
    this.dustMs = 0;
    const onFloor = this.flip.side === 'floor';
    this.particles.burst(
      PLAYER_X - 12,
      onFloor ? this.body.y + PLAYER_RADIUS - 2 : this.body.y - PLAYER_RADIUS + 2,
      1,
      { speed: 70, life: 380, size: 2.6, colors: [onFloor ? COLORS.cyan : COLORS.magenta], angle: onFloor ? -Math.PI / 2 : Math.PI / 2, spread: 1.2 },
      profile.particleScale,
    );
  }

  /** Dano (uma vez por obstáculo) e quase-colisão (quando o obstáculo termina de passar). */
  private checkObstacles(): void {
    const now = new Set<ActiveObstacle>();
    for (const o of this.spawn.obstacles) {
      const rects = this.spawn.rectsOf(o);
      const touching = rects.some((r) => circleIntersectsRect(PLAYER_X, this.body.y, HITBOX_RADIUS, r));
      if (touching) {
        now.add(o);
        if (!o.hit) {
          o.hit = true;
          this.applyHit();
          if (this.over) return;
        }
      }
      o.minGap = Math.min(o.minGap, minGapToRects(PLAYER_X, this.body.y, HITBOX_RADIUS, rects));
      const passed = o.x + o.def.width < PLAYER_X - HITBOX_RADIUS;
      if (passed && !o.nearMissChecked) {
        o.nearMissChecked = true;
        if (!o.hit && isNearMiss(o.minGap)) {
          this.score.nearMiss();
          this.sfx('nearMiss');
          this.popup('QUASE!', PLAYER_X + 60, this.body.y, '#ffe94d', 24);
        }
      }
    }
    this.touchingNow = now;
  }

  private applyHit(): void {
    const result = this.health.takeHit();
    if (result === 'ignored') return;
    const profile = this.profile();
    // Modo "efeitos reduzidos" desliga o tremor de tela; as partículas só diminuem.
    if (profile.shake) {
      this.cameras.main.shake(result === 'absorbed' ? 80 : 160, result === 'absorbed' ? 0.002 : 0.006);
    }
    this.sfx(result === 'absorbed' ? 'absorb' : result === 'dead' ? 'death' : 'hit');
    if (result === 'absorbed') {
      this.particles.burst(PLAYER_X, this.body.y, 18, { speed: 320, life: 550, size: 4.5, colors: [COLORS.shield, COLORS.ink] }, profile.particleScale);
    } else {
      // Dano zera o combo; o escudo absorve a colisão e preserva o combo.
      this.score.resetCombo();
      const count = result === 'dead' ? 46 : 26;
      this.particles.burst(
        PLAYER_X,
        this.body.y,
        count,
        { speed: 420, life: 700, size: 5, colors: [COLORS.magenta, COLORS.ink, COLORS.gold], gravity: 260 },
        profile.particleScale,
      );
    }
    if (result === 'dead') {
      this.over = true;
      bus.emit('game:over', {
        score: this.score.score,
        coins: this.score.coins,
        maxCombo: this.score.maxMultiplier,
        nearMisses: this.score.nearMisses,
        durationMs: Math.round(this.elapsedMs),
      });
    }
  }

  private sfx(name: SfxName, level = 0): void {
    bus.emit('audio:sfx', { name, level });
  }

  private popup(text: string, x: number, y: number, color: string, size: number): void {
    this.events.emit('hud:popup', { text, x, y, color, size });
  }

  private render(profile: EffectProfile): void {
    const cam = this.cameras.main;
    cam.setRotation(profile.tilt ? flipTilt(this.sinceFlipMs, this.flipDir) : 0);
    cam.scrollX = this.glitchMs > 0 && profile.glitch ? (Math.random() - 0.5) * 10 : 0;

    const detail = !this.lowPerf;
    this.gfxBack.clear();
    this.gfx.clear();
    this.glow.clear();

    drawSkylines(this.gfxBack, this.skylines, this.travelPx, detail);
    drawSurfaces(this.gfx, this.glow, this.scrollX, detail);
    this.renderObstacles(this.gfx, this.glow, detail);
    this.renderCollectibles(this.gfx, this.glow);

    if (!this.over) this.renderPlayer(this.gfx, this.glow);
    drawParticles(this.gfx, this.glow, this.particles, detail);

    // Anel de luz da inversão e um leve clarão (desligado nos efeitos reduzidos).
    const wave = shockwave(this.sinceFlipMs);
    if (wave) drawShockwave(this.glow, PLAYER_X, this.body.y, wave, this.flipColor, profile.flash ? 1 : 0.6);
    if (profile.flash && this.sinceFlipMs < FLASH_MS) {
      this.glow.fillStyle(this.flipColor, 0.06 * (1 - this.sinceFlipMs / FLASH_MS)).fillRect(-200, -200, LOGICAL_WIDTH + 400, LOGICAL_HEIGHT + 400);
    }
    if (this.glitchMs > 0 && profile.glitch) this.renderGlitch(this.glow);

    if (this.debug) {
      this.debugText.setText(`estágio ${this.stage + 1}  velocidade ${Math.round(this.speed)}  seed ${this.seed}  partículas ${this.particles.particles.length}${this.lowPerf ? '  (modo leve)' : ''}`);
    }
  }

  private renderPlayer(g: Phaser.GameObjects.Graphics, glow: Phaser.GameObjects.Graphics): void {
    drawTrail(g, this.trail);

    // Pisca enquanto está invulnerável; estica na direção do movimento durante a travessia.
    const blinkOff = this.health.invulnerable && Math.floor(this.health.invulnerableMs / 90) % 2 === 0;
    const { sx, sy } = stretchFor(this.body.vy);
    drawOrb(g, glow, PLAYER_X, this.body.y, { sx, sy, alpha: blinkOff ? 0.25 : 1 });
    if (this.health.shield) {
      g.lineStyle(4, COLORS.shield, 1).strokeCircle(PLAYER_X, this.body.y, PLAYER_RADIUS + 18);
      glow.lineStyle(10, COLORS.shield, 0.2).strokeCircle(PLAYER_X, this.body.y, PLAYER_RADIUS + 18);
    }

    // Anel de recarga: enche enquanto a inversão não está disponível.
    const ringR = PLAYER_RADIUS + 10;
    const ready = this.flip.readiness;
    g.lineStyle(3, COLORS.ink, 0.2).strokeCircle(PLAYER_X, this.body.y, ringR);
    if (ready < 1) {
      g.lineStyle(3, COLORS.gold, 1);
      g.beginPath();
      g.arc(PLAYER_X, this.body.y, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ready, false);
      g.strokePath();
    }
  }

  /** Faixas horizontais rápidas, de baixo contraste. Só nos momentos especiais e fora do modo reduzido. */
  private renderGlitch(glow: Phaser.GameObjects.Graphics): void {
    for (let i = 0; i < 6; i++) {
      const y = Math.random() * LOGICAL_HEIGHT;
      const h = 3 + Math.random() * 6;
      const x = (Math.random() - 0.5) * 40;
      glow.fillStyle(i % 2 === 0 ? COLORS.cyan : COLORS.magenta, 0.2).fillRect(x, y, LOGICAL_WIDTH, h);
    }
  }

  private renderCollectibles(g: Phaser.GameObjects.Graphics, glow: Phaser.GameObjects.Graphics): void {
    for (const c of this.spawn.coins) {
      if (c.x > LOGICAL_WIDTH + 50) continue;
      glow.fillStyle(COLORS.gold, 0.2).fillCircle(c.x, c.y, COIN_RADIUS * 1.9);
      g.fillStyle(COLORS.gold, 1).fillCircle(c.x, c.y, COIN_RADIUS);
      g.lineStyle(2, COLORS.ink, 0.8).strokeCircle(c.x, c.y, COIN_RADIUS * 0.55);
    }
    for (const p of this.spawn.pickups) {
      glow.fillStyle(COLORS.shield, 0.25).fillCircle(p.x, p.y, PICKUP_RADIUS * 2);
      g.lineStyle(4, COLORS.shield, 1).strokeCircle(p.x, p.y, PICKUP_RADIUS);
      g.fillStyle(COLORS.shield, 1).fillCircle(p.x, p.y, PICKUP_RADIUS * 0.4);
    }
  }

  private renderObstacles(g: Phaser.GameObjects.Graphics, glow: Phaser.GameObjects.Graphics, detail: boolean): void {
    for (const o of this.spawn.obstacles) {
      if (o.x > LOGICAL_WIDTH + 50) continue;
      const fill = this.touchingNow.has(o) ? COLORS.ink : COLORS.magenta;
      for (const r of this.spawn.rectsOf(o)) {
        if (o.def.type === 'spike') {
          const base = o.def.side === 'floor' ? r.y + r.h : r.y;
          const tip = o.def.side === 'floor' ? r.y : r.y + r.h;
          g.fillStyle(fill, 0.9).fillTriangle(r.x, base, r.x + r.w / 2, tip, r.x + r.w, base);
          g.lineStyle(2, COLORS.ink, 0.6).strokeTriangle(r.x, base, r.x + r.w / 2, tip, r.x + r.w, base);
          if (detail) glow.lineStyle(8, COLORS.magenta, 0.22).strokeTriangle(r.x, base, r.x + r.w / 2, tip, r.x + r.w, base);
        } else {
          g.fillStyle(fill, o.def.type === 'barrier' ? 0.55 : 0.85).fillRect(r.x, r.y, r.w, r.h);
          g.lineStyle(3, COLORS.magenta, 1).strokeRect(r.x, r.y, r.w, r.h);
          if (detail) glow.lineStyle(10, COLORS.magenta, 0.2).strokeRect(r.x, r.y, r.w, r.h);
        }
      }
    }
  }
}
