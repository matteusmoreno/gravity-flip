import { describe, expect, it } from 'vitest';
import { LocalStorageRepository, migrate } from '@/services/storage/LocalStorageRepository';
import { SAVE_VERSION, defaultSave } from '@/services/storage/StorageRepository';

const fakeStorage = (initial?: string) => {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_k: string, v: string) => {
      value = v;
    },
  };
};

describe('persistência versionada', () => {
  it('retorna o padrão quando não há dados', () => {
    expect(new LocalStorageRepository(fakeStorage()).load()).toEqual(defaultSave());
  });

  it('retorna o padrão quando o dado está corrompido', () => {
    expect(new LocalStorageRepository(fakeStorage('{nao-e-json')).load()).toEqual(defaultSave());
  });

  it('grava e lê os mesmos dados', () => {
    const repo = new LocalStorageRepository(fakeStorage());
    repo.save({ ...defaultSave(), bestScore: 1234, totalCoins: 7 });
    expect(repo.load().bestScore).toBe(1234);
    expect(repo.load().totalCoins).toBe(7);
  });

  it('migra dados antigos preenchendo campos novos', () => {
    const migrated = migrate({ version: 1, bestScore: 50 });
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.settings.sfxVolume).toBe(defaultSave().settings.sfxVolume);
  });

  it('descarta versões desconhecidas', () => {
    expect(migrate({ version: 999, bestScore: 50 })).toEqual(defaultSave());
  });
});
