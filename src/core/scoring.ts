import {
  COIN_POINTS,
  COMBO_DECAY_MS,
  COMBO_STEP,
  COMBO_TIMEOUT_MS,
  MAX_MULTIPLIER,
  NEAR_MISS_POINTS,
  POINTS_PER_METER,
  PX_PER_METER,
} from './constants';

/** Pontuação e combo. Pura e sem dependência do Phaser. */
export class ScoreState {
  coins = 0;
  nearMisses = 0;
  maxMultiplier = 1;
  comboCount = 0;
  private raw = 0;
  private sinceEventMs = 0;
  private decayMs = 0;

  get score(): number {
    return Math.floor(this.raw);
  }

  get multiplier(): number {
    return Math.min(MAX_MULTIPLIER, 1 + Math.floor(this.comboCount / COMBO_STEP));
  }

  /** Progresso (0 a 1) para o próximo nível do multiplicador; 1 no teto. */
  get comboProgress(): number {
    return this.multiplier >= MAX_MULTIPLIER ? 1 : (this.comboCount % COMBO_STEP) / COMBO_STEP;
  }

  addDistance(px: number): void {
    this.raw += (px / PX_PER_METER) * POINTS_PER_METER * this.multiplier;
  }

  collectCoin(): void {
    this.coins += 1;
    this.raw += COIN_POINTS * this.multiplier;
    this.bump();
  }

  nearMiss(): void {
    this.nearMisses += 1;
    this.raw += NEAR_MISS_POINTS * this.multiplier;
    this.bump();
  }

  resetCombo(): void {
    this.comboCount = 0;
    this.sinceEventMs = 0;
    this.decayMs = 0;
  }

  /** Sem eventos por muito tempo, o combo desce um ponto por intervalo. */
  update(dtMs: number): void {
    this.sinceEventMs += dtMs;
    if (this.sinceEventMs <= COMBO_TIMEOUT_MS || this.comboCount === 0) return;
    this.decayMs += dtMs;
    while (this.decayMs >= COMBO_DECAY_MS && this.comboCount > 0) {
      this.comboCount -= 1;
      this.decayMs -= COMBO_DECAY_MS;
    }
  }

  private bump(): void {
    this.comboCount += 1;
    this.sinceEventMs = 0;
    this.decayMs = 0;
    this.maxMultiplier = Math.max(this.maxMultiplier, this.multiplier);
  }
}
