import { describe, expect, it } from 'vitest';
import { HealthState } from '@/core/health';
import { INVULNERABLE_MS, SHIELD_BREAK_INVULN_MS, START_LIVES } from '@/core/constants';

describe('HealthState', () => {
  it('começa com 3 vidas, sem escudo e vulnerável', () => {
    const h = new HealthState();
    expect(h.lives).toBe(START_LIVES);
    expect(h.shield).toBe(false);
    expect(h.invulnerable).toBe(false);
  });

  it('dano remove uma vida e dá invulnerabilidade', () => {
    const h = new HealthState();
    expect(h.takeHit()).toBe('damaged');
    expect(h.lives).toBe(START_LIVES - 1);
    expect(h.invulnerableMs).toBe(INVULNERABLE_MS);
  });

  it('ignora dano durante a invulnerabilidade', () => {
    const h = new HealthState();
    h.takeHit();
    expect(h.takeHit()).toBe('ignored');
    expect(h.lives).toBe(START_LIVES - 1);
  });

  it('a invulnerabilidade acaba depois de 1,5 s', () => {
    const h = new HealthState();
    h.takeHit();
    h.update(INVULNERABLE_MS - 1);
    expect(h.invulnerable).toBe(true);
    h.update(1);
    expect(h.invulnerable).toBe(false);
    expect(h.takeHit()).toBe('damaged');
    expect(h.lives).toBe(START_LIVES - 2);
  });

  it('o escudo absorve um dano sem perder vida e dá só uma janela curta', () => {
    const h = new HealthState();
    h.collectShield();
    expect(h.takeHit()).toBe('absorbed');
    expect(h.lives).toBe(START_LIVES);
    expect(h.shield).toBe(false);
    expect(h.invulnerableMs).toBe(SHIELD_BREAK_INVULN_MS);
    expect(SHIELD_BREAK_INVULN_MS).toBeLessThan(INVULNERABLE_MS);
  });

  it('coletar escudo de novo não acumula', () => {
    const h = new HealthState();
    h.collectShield();
    h.collectShield();
    h.takeHit();
    h.update(SHIELD_BREAK_INVULN_MS);
    expect(h.takeHit()).toBe('damaged');
  });

  it('morre ao perder a última vida', () => {
    const h = new HealthState();
    for (let i = 0; i < START_LIVES - 1; i++) {
      expect(h.takeHit()).toBe('damaged');
      h.update(INVULNERABLE_MS);
    }
    expect(h.takeHit()).toBe('dead');
    expect(h.dead).toBe(true);
    expect(h.takeHit()).toBe('ignored');
  });

  it('reset restaura o estado inicial', () => {
    const h = new HealthState();
    h.collectShield();
    h.takeHit();
    h.reset();
    expect(h.lives).toBe(START_LIVES);
    expect(h.shield).toBe(false);
    expect(h.invulnerable).toBe(false);
  });
});
