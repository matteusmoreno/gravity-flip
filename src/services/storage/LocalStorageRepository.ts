import { SAVE_VERSION, defaultSave, type SaveData, type StorageRepository } from './StorageRepository';

const KEY = 'gravity-flip:save';

/** Aplica migrações em sequência; dado inválido ou ausente volta ao padrão. */
export function migrate(raw: unknown): SaveData {
  if (typeof raw !== 'object' || raw === null) return defaultSave();
  const data = raw as Partial<SaveData>;
  if (typeof data.version !== 'number' || data.version > SAVE_VERSION) return defaultSave();
  return { ...defaultSave(), ...data, version: SAVE_VERSION, settings: { ...defaultSave().settings, ...data.settings } };
}

export class LocalStorageRepository implements StorageRepository {
  constructor(private readonly storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage) {}

  hasSave(): boolean {
    try {
      return this.storage.getItem(KEY) !== null;
    } catch {
      return false;
    }
  }

  load(): SaveData {
    try {
      const text = this.storage.getItem(KEY);
      return text ? migrate(JSON.parse(text)) : defaultSave();
    } catch {
      return defaultSave();
    }
  }

  save(data: SaveData): void {
    try {
      this.storage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* armazenamento indisponível: o jogo continua sem persistir */
    }
  }
}
