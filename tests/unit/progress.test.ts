import { describe, expect, it } from 'vitest';
import { applyResult } from '@/services/storage/progress';
import { defaultSave } from '@/services/storage/StorageRepository';
import { RANKING_SIZE } from '@/core/constants';

const result = (score: number, coins = 0) => ({ score, coins, maxCombo: 1, nearMisses: 0, durationMs: 1000 });
const now = new Date('2026-11-24T20:00:00Z');

describe('applyResult', () => {
  it('primeira partida vira recorde, entra no ranking e atualiza carteira e contagem', () => {
    const r = applyResult(defaultSave(), result(500, 7), now);
    expect(r.isNewRecord).toBe(true);
    expect(r.rank).toBe(1);
    expect(r.save.bestScore).toBe(500);
    expect(r.save.totalCoins).toBe(7);
    expect(r.save.gamesPlayed).toBe(1);
    expect(r.save.ranking).toEqual([{ score: 500, date: now.toISOString() }]);
  });

  it('pontuação menor não é recorde, mas entra no ranking na posição certa', () => {
    const first = applyResult(defaultSave(), result(500), now).save;
    const r = applyResult(first, result(300), now);
    expect(r.isNewRecord).toBe(false);
    expect(r.rank).toBe(2);
    expect(r.save.bestScore).toBe(500);
    expect(r.save.ranking.map((e) => e.score)).toEqual([500, 300]);
  });

  it('o ranking mantém só as melhores e descarta a menor', () => {
    let save = defaultSave();
    for (let i = 1; i <= RANKING_SIZE; i++) save = applyResult(save, result(i * 100), now).save;
    expect(save.ranking.length).toBe(RANKING_SIZE);
    const r = applyResult(save, result(550), now);
    expect(r.save.ranking.length).toBe(RANKING_SIZE);
    expect(r.save.ranking.map((e) => e.score)).not.toEqual(save.ranking.map((e) => e.score));
    expect(r.save.ranking[r.save.ranking.length - 1]!.score).toBe(200);
    expect(r.rank).toBe(6);
  });

  it('pontuação abaixo do top 10 fica sem posição', () => {
    let save = defaultSave();
    for (let i = 1; i <= RANKING_SIZE; i++) save = applyResult(save, result(i * 100), now).save;
    const r = applyResult(save, result(50), now);
    expect(r.rank).toBe(null);
    expect(r.save.ranking.length).toBe(RANKING_SIZE);
  });

  it('em empate, a pontuação mais antiga mantém a posição', () => {
    const first = applyResult(defaultSave(), result(400), new Date('2026-01-01T00:00:00Z')).save;
    const r = applyResult(first, result(400), now);
    expect(r.rank).toBe(2);
    expect(r.isNewRecord).toBe(false);
    expect(r.save.ranking[0]!.date).toBe('2026-01-01T00:00:00.000Z');
  });

  it('pontuação zero não vira recorde nem entra no ranking, mas conta partida e moedas', () => {
    const r = applyResult(defaultSave(), result(0, 3), now);
    expect(r.isNewRecord).toBe(false);
    expect(r.rank).toBe(null);
    expect(r.save.ranking).toEqual([]);
    expect(r.save.gamesPlayed).toBe(1);
    expect(r.save.totalCoins).toBe(3);
  });

  it('não altera o save original', () => {
    const save = defaultSave();
    const copy = JSON.parse(JSON.stringify(save));
    applyResult(save, result(900, 5), now);
    expect(save).toEqual(copy);
  });
});
