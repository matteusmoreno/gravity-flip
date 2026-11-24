import { RANKING_SIZE } from '@/core/constants';
import type { GameOverResult } from '@/services/events';
import type { RankingEntry, SaveData } from './StorageRepository';

export interface AppliedResult {
  save: SaveData;
  isNewRecord: boolean;
  /** Posição (1 a RANKING_SIZE) no ranking local, ou null se ficou fora. */
  rank: number | null;
}

/** Aplica o resultado de uma partida ao save: recorde, ranking local, carteira e contagem de partidas. */
export function applyResult(save: SaveData, result: GameOverResult, now: Date): AppliedResult {
  const counted = result.score > 0;
  const isNewRecord = counted && result.score > save.bestScore;

  let ranking: RankingEntry[] = save.ranking;
  let rank: number | null = null;
  if (counted) {
    const entry: RankingEntry = { score: result.score, date: now.toISOString() };
    // Ordenação estável: em empate, a pontuação mais antiga mantém a posição.
    ranking = [...save.ranking, entry].sort((a, b) => b.score - a.score).slice(0, RANKING_SIZE);
    const index = ranking.indexOf(entry);
    rank = index === -1 ? null : index + 1;
  }

  return {
    save: {
      ...save,
      bestScore: isNewRecord ? result.score : save.bestScore,
      ranking,
      totalCoins: save.totalCoins + result.coins,
      gamesPlayed: save.gamesPlayed + 1,
    },
    isNewRecord,
    rank,
  };
}
