import { MAX_PARTICLES } from './constants';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: number;
  /** Aceleração vertical em px/s². */
  gravity: number;
}

export interface BurstOptions {
  speed: number;
  life: number;
  size: number;
  colors: readonly number[];
  gravity?: number;
  /** Direção central em radianos e abertura total do leque; sem isso, vai em todas as direções. */
  angle?: number;
  spread?: number;
}

/** Sistema de partículas simples, com teto de quantidade. Puro e sem dependência do Phaser. */
export class ParticleSystem {
  particles: Particle[] = [];

  constructor(
    private readonly max = MAX_PARTICLES,
    private readonly rng: () => number = Math.random,
  ) {}

  /** Cria partículas em leque ou radial. `scale` (0 a 1) reduz a quantidade; nunca passa do teto. */
  burst(x: number, y: number, count: number, o: BurstOptions, scale = 1): void {
    const n = Math.round(count * scale);
    for (let i = 0; i < n && this.particles.length < this.max; i++) {
      const angle =
        o.angle === undefined ? this.rng() * Math.PI * 2 : o.angle + (this.rng() - 0.5) * (o.spread ?? Math.PI * 2);
      const speed = o.speed * (0.4 + 0.6 * this.rng());
      const life = o.life * (0.6 + 0.4 * this.rng());
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        size: o.size * (0.6 + 0.4 * this.rng()),
        color: o.colors[Math.floor(this.rng() * o.colors.length)]!,
        gravity: o.gravity ?? 0,
      });
    }
  }

  /** Move e envelhece as partículas. `scrollDx` acompanha o avanço do cenário (partículas pertencem ao mundo). */
  update(dtMs: number, scrollDx = 0): void {
    const dt = dtMs / 1000;
    for (const p of this.particles) {
      p.vy += p.gravity * dt;
      p.x += p.vx * dt - scrollDx;
      p.y += p.vy * dt;
      p.life -= dtMs;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  clear(): void {
    this.particles = [];
  }
}
