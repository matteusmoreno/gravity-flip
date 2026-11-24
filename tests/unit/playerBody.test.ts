import { describe, expect, it } from 'vitest';
import { stepBody, type Body } from '@/core/playerBody';

const bounds = { top: 100, bottom: 600 };
const run = (body: Body, side: 'floor' | 'ceiling', ms: number) => {
  let landed = false;
  for (let t = 0; t < ms; t += 1000 / 60) landed = stepBody(body, side, 1 / 60, bounds) || landed;
  return landed;
};

describe('stepBody', () => {
  it('fica parado ao descansar na superfície alvo', () => {
    const body = { y: 600, vy: 0 };
    stepBody(body, 'floor', 1 / 60, bounds);
    expect(body).toEqual({ y: 600, vy: 0 });
  });

  it('vai ao teto e pousa ao inverter', () => {
    const body = { y: 600, vy: 0 };
    const landed = run(body, 'ceiling', 800);
    expect(body.y).toBe(100);
    expect(body.vy).toBe(0);
    expect(landed).toBe(true);
  });

  it('chega ao outro lado em tempo curto (cerca de 0,35 s)', () => {
    const body = { y: 600, vy: 0 };
    run(body, 'ceiling', 300);
    expect(body.y).toBeGreaterThan(100); // ainda em trânsito aos 0,3 s
    run(body, 'ceiling', 200);
    expect(body.y).toBe(100);
  });

  it('nunca ultrapassa os limites', () => {
    const body = { y: 600, vy: 0 };
    run(body, 'ceiling', 2000);
    run(body, 'floor', 2000);
    expect(body.y).toBeLessThanOrEqual(600);
    expect(body.y).toBeGreaterThanOrEqual(100);
  });

  it('permite reverter no meio do trajeto', () => {
    const body = { y: 600, vy: 0 };
    run(body, 'ceiling', 150);
    run(body, 'floor', 800);
    expect(body.y).toBe(600);
  });
});
