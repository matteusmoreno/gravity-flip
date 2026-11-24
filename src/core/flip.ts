import { FLIP_COOLDOWN_MS, FLIP_INPUT_BUFFER_MS } from './constants';

export type Side = 'floor' | 'ceiling';

export const oppositeSide = (side: Side): Side => (side === 'floor' ? 'ceiling' : 'floor');

/**
 * Controla a inversão de gravidade: recarga e buffer de entrada.
 * Pura e sem dependência do Phaser (testável com Vitest).
 */
export class FlipController {
  side: Side = 'floor';
  cooldownMs = 0;
  private bufferMs = 0;

  constructor(
    private readonly cooldownTotalMs = FLIP_COOLDOWN_MS,
    private readonly bufferWindowMs = FLIP_INPUT_BUFFER_MS,
  ) {}

  /** Progresso da recarga de 0 (acabou de inverter) a 1 (pronto). */
  get readiness(): number {
    return 1 - this.cooldownMs / this.cooldownTotalMs;
  }

  /** Pedido de inversão. Retorna true se a inversão ocorreu agora. */
  requestFlip(): boolean {
    if (this.cooldownMs <= 0) {
      this.doFlip();
      return true;
    }
    // Durante a recarga, guarda o pedido só se faltar pouco para terminar.
    if (this.cooldownMs <= this.bufferWindowMs) this.bufferMs = this.bufferWindowMs;
    return false;
  }

  /** Avança o tempo. Retorna true se uma inversão guardada em buffer ocorreu neste passo. */
  update(dtMs: number): boolean {
    this.cooldownMs = Math.max(0, this.cooldownMs - dtMs);
    this.bufferMs = Math.max(0, this.bufferMs - dtMs);
    if (this.cooldownMs <= 0 && this.bufferMs > 0) {
      this.bufferMs = 0;
      this.doFlip();
      return true;
    }
    return false;
  }

  reset(): void {
    this.side = 'floor';
    this.cooldownMs = 0;
    this.bufferMs = 0;
  }

  private doFlip(): void {
    this.side = oppositeSide(this.side);
    this.cooldownMs = this.cooldownTotalMs;
    this.bufferMs = 0;
  }
}
