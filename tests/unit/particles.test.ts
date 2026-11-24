import { describe, expect, it } from 'vitest';
import { ParticleSystem } from '@/core/particles';
import { createRng } from '@/core/rng';

const opts = { speed: 100, life: 500, size: 4, colors: [0xff0000, 0x00ff00] };

describe('ParticleSystem', () => {
  it('cria a quantidade pedida, reduzida pela escala', () => {
    const ps = new ParticleSystem(100, createRng(1));
    ps.burst(0, 0, 10, opts);
    expect(ps.particles.length).toBe(10);
    ps.burst(0, 0, 10, opts, 0.5);
    expect(ps.particles.length).toBe(15);
    ps.burst(0, 0, 10, opts, 0);
    expect(ps.particles.length).toBe(15);
  });

  it('respeita o teto de partículas', () => {
    const ps = new ParticleSystem(20, createRng(1));
    ps.burst(0, 0, 50, opts);
    ps.burst(0, 0, 50, opts);
    expect(ps.particles.length).toBe(20);
  });

  it('as partículas morrem depois da vida', () => {
    const ps = new ParticleSystem(100, createRng(2));
    ps.burst(0, 0, 10, opts);
    ps.update(200);
    expect(ps.particles.length).toBe(10);
    ps.update(400);
    expect(ps.particles.length).toBe(0);
  });

  it('a gravidade acelera a queda', () => {
    const ps = new ParticleSystem(100, createRng(3));
    ps.burst(0, 0, 1, { ...opts, speed: 0, gravity: 1000 });
    ps.update(100);
    expect(ps.particles[0]!.vy).toBeCloseTo(100);
    expect(ps.particles[0]!.y).toBeGreaterThan(0);
  });

  it('acompanha o avanço do cenário', () => {
    const ps = new ParticleSystem(100, createRng(4));
    ps.burst(500, 0, 1, { ...opts, speed: 0 });
    ps.update(16, 7);
    expect(ps.particles[0]!.x).toBeCloseTo(493);
  });

  it('o leque direcionado respeita a direção e a abertura', () => {
    const ps = new ParticleSystem(100, createRng(5));
    ps.burst(0, 0, 50, { ...opts, angle: 0, spread: 0.2 });
    for (const p of ps.particles) {
      expect(p.vx).toBeGreaterThan(0);
      expect(Math.abs(p.vy)).toBeLessThan(p.vx);
    }
  });

  it('é determinístico com a mesma seed', () => {
    const a = new ParticleSystem(100, createRng(9));
    const b = new ParticleSystem(100, createRng(9));
    a.burst(1, 2, 8, opts);
    b.burst(1, 2, 8, opts);
    expect(a.particles).toEqual(b.particles);
  });

  it('clear remove tudo', () => {
    const ps = new ParticleSystem(100, createRng(1));
    ps.burst(0, 0, 5, opts);
    ps.clear();
    expect(ps.particles.length).toBe(0);
  });
});
