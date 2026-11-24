import { describe, expect, it } from 'vitest';
import { PatternGenerator } from '@/core/generator';
import { circleIntersectsRect } from '@/core/geometry';
import { PATTERN_LIBRARY } from '@/core/patterns/library';
import { COIN_RADIUS, PICKUP_RADIUS } from '@/core/constants';
import { SpawnSystem } from '@/game/systems/SpawnSystem';

const make = (seed: number) => new SpawnSystem(new PatternGenerator(PATTERN_LIBRARY, seed), seed);

describe('SpawnSystem', () => {
  it('gera obstáculos à frente e descarta os que saíram da tela', () => {
    const s = make(5);
    s.update(0, 0, 420);
    expect(s.obstacles.length).toBeGreaterThan(0);
    for (let i = 0; i < 3000; i++) s.update(7, 0, 420);
    expect(s.obstacles.every((o) => o.x + o.def.width > -120)).toBe(true);
  });

  it('itens de escudo nunca nascem dentro de obstáculos e há no máximo um por vez', () => {
    let seen = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const s = make(seed);
      for (let i = 0; i < 2000; i++) {
        s.update(7, i % 9, 420);
        expect(s.pickups.length).toBeLessThanOrEqual(1);
        for (const p of s.pickups) {
          seen++;
          for (const o of s.obstacles) {
            for (const r of s.rectsOf(o)) {
              expect(circleIntersectsRect(p.x, p.y, PICKUP_RADIUS, r)).toBe(false);
            }
          }
        }
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

  it('coleta remove o item tocado e conta', () => {
    const s = make(11);
    s.pickups = [{ x: 100, y: 200 }];
    expect(s.collectPickups(500, 500, 24)).toBe(0);
    expect(s.collectPickups(100, 210, 24)).toBe(1);
    expect(s.pickups.length).toBe(0);
  });

  it('é determinístico para a mesma seed', () => {
    const a = make(9);
    const b = make(9);
    for (let i = 0; i < 500; i++) {
      a.update(7, 2, 420);
      b.update(7, 2, 420);
    }
    expect(a.obstacles.map((o) => [o.def.type, Math.round(o.x)])).toEqual(b.obstacles.map((o) => [o.def.type, Math.round(o.x)]));
    expect(a.pickups).toEqual(b.pickups);
  });

  it('moedas nunca nascem dentro de obstáculos nem do item de escudo', () => {
    let seen = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const s = make(seed);
      for (let i = 0; i < 1000; i++) {
        s.update(7, i % 9, 420 + (i % 9) * 42);
        for (const c of s.coins) {
          seen++;
          for (const o of s.obstacles) {
            for (const r of s.rectsOf(o)) {
              expect(circleIntersectsRect(c.x, c.y, COIN_RADIUS, r), `seed ${seed}`).toBe(false);
            }
          }
          for (const p of s.pickups) {
            expect(Math.hypot(c.x - p.x, c.y - p.y)).toBeGreaterThan(COIN_RADIUS + PICKUP_RADIUS);
          }
        }
      }
    }
    expect(seen).toBeGreaterThan(300);
  }, 30_000);

  it('coletar moedas remove as tocadas e conta', () => {
    const s = make(3);
    s.coins = [{ x: 100, y: 200 }, { x: 400, y: 200 }];
    expect(s.collectCoins(100, 205, 24)).toBe(1);
    expect(s.coins.length).toBe(1);
  });
});
