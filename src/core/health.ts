import { INVULNERABLE_MS, SHIELD_BREAK_INVULN_MS, START_LIVES } from './constants';

export type HitResult = 'ignored' | 'absorbed' | 'damaged' | 'dead';

/** Vidas, invulnerabilidade e escudo. Pura e sem dependência do Phaser. */
export class HealthState {
  lives = START_LIVES;
  shield = false;
  invulnerableMs = 0;

  get invulnerable(): boolean {
    return this.invulnerableMs > 0;
  }

  get dead(): boolean {
    return this.lives <= 0;
  }

  update(dtMs: number): void {
    this.invulnerableMs = Math.max(0, this.invulnerableMs - dtMs);
  }

  /** Só existe um escudo por vez: coletar outro não acumula. */
  collectShield(): void {
    this.shield = true;
  }

  takeHit(): HitResult {
    if (this.dead || this.invulnerable) return 'ignored';
    if (this.shield) {
      this.shield = false;
      this.invulnerableMs = SHIELD_BREAK_INVULN_MS;
      return 'absorbed';
    }
    this.lives -= 1;
    this.invulnerableMs = INVULNERABLE_MS;
    return this.dead ? 'dead' : 'damaged';
  }

  reset(): void {
    this.lives = START_LIVES;
    this.shield = false;
    this.invulnerableMs = 0;
  }
}
