import type { SettingsState } from '@/services/events';

export const SAVE_VERSION = 1;

export interface RankingEntry {
  score: number;
  date: string;
}

export interface SaveData {
  version: number;
  bestScore: number;
  ranking: RankingEntry[];
  totalCoins: number;
  gamesPlayed: number;
  settings: SettingsState;
}

export const defaultSave = (): SaveData => ({
  version: SAVE_VERSION,
  bestScore: 0,
  ranking: [],
  totalCoins: 0,
  gamesPlayed: 0,
  settings: { musicVolume: 0.6, sfxVolume: 0.8, muted: false, reducedEffects: false },
});

/** Interface de persistência; trocar por backend significa criar outra implementação. */
export interface StorageRepository {
  /** Existe algum dado salvo? (Permite aplicar padrões do sistema só na primeira visita.) */
  hasSave(): boolean;
  load(): SaveData;
  save(data: SaveData): void;
}
