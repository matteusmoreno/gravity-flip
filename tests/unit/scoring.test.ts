import { describe, expect, it } from 'vitest';
import { ScoreState } from '@/core/scoring';
import {
  COIN_POINTS,
  COMBO_DECAY_MS,
  COMBO_STEP,
  COMBO_TIMEOUT_MS,
  MAX_MULTIPLIER,
  NEAR_MISS_POINTS,
  POINTS_PER_METER,
  PX_PER_METER,
} from '@/core/constants';

describe('ScoreState', () => {
  it('pontua pela distância percorrida', () => {
    const s = new ScoreState();
    s.addDistance(PX_PER_METER * 10);
    expect(s.score).toBe(10 * POINTS_PER_METER);
  });

  it('moeda e quase-colisão dão pontos e contam nas estatísticas', () => {
    const s = new ScoreState();
    s.collectCoin();
    s.nearMiss();
    expect(s.score).toBe(COIN_POINTS + NEAR_MISS_POINTS);
    expect(s.coins).toBe(1);
    expect(s.nearMisses).toBe(1);
  });

  it('o multiplicador sobe a cada COMBO_STEP eventos', () => {
    const s = new ScoreState();
    expect(s.multiplier).toBe(1);
    for (let i = 0; i < COMBO_STEP; i++) s.collectCoin();
    expect(s.multiplier).toBe(2);
    for (let i = 0; i < COMBO_STEP; i++) s.nearMiss();
    expect(s.multiplier).toBe(3);
  });

  it('o multiplicador tem teto', () => {
    const s = new ScoreState();
    for (let i = 0; i < COMBO_STEP * 20; i++) s.collectCoin();
    expect(s.multiplier).toBe(MAX_MULTIPLIER);
    expect(s.maxMultiplier).toBe(MAX_MULTIPLIER);
    expect(s.comboProgress).toBe(1);
  });

  it('o multiplicador aumenta os pontos seguintes', () => {
    const s = new ScoreState();
    for (let i = 0; i < COMBO_STEP; i++) s.collectCoin();
    const before = s.score;
    s.addDistance(PX_PER_METER);
    expect(s.score - before).toBe(POINTS_PER_METER * 2);
  });

  it('resetCombo zera o multiplicador mas mantém o maior alcançado', () => {
    const s = new ScoreState();
    for (let i = 0; i < COMBO_STEP * 2; i++) s.collectCoin();
    s.resetCombo();
    expect(s.multiplier).toBe(1);
    expect(s.maxMultiplier).toBe(3);
  });

  it('sem eventos por muito tempo, o combo decai aos poucos', () => {
    const s = new ScoreState();
    for (let i = 0; i < COMBO_STEP * 2; i++) s.collectCoin(); // x3
    s.update(COMBO_TIMEOUT_MS);
    expect(s.multiplier).toBe(3); // ainda dentro do prazo
    s.update(COMBO_DECAY_MS * COMBO_STEP);
    expect(s.multiplier).toBe(2);
    s.update(COMBO_DECAY_MS * 100);
    expect(s.multiplier).toBe(1);
    expect(s.comboCount).toBe(0);
  });

  it('um novo evento reinicia o prazo do combo', () => {
    const s = new ScoreState();
    for (let i = 0; i < COMBO_STEP; i++) s.collectCoin();
    s.update(COMBO_TIMEOUT_MS - 1);
    s.collectCoin();
    s.update(COMBO_TIMEOUT_MS - 1);
    expect(s.comboCount).toBe(COMBO_STEP + 1);
  });
});
