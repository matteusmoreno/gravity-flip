import { create } from 'zustand';
import { bus, type GameOverResult, type SettingsState } from '@/services/events';
import { LocalStorageRepository } from '@/services/storage/LocalStorageRepository';
import { applyResult } from '@/services/storage/progress';
import type { SaveData } from '@/services/storage/StorageRepository';

export type Screen = 'menu' | 'playing' | 'paused' | 'gameover' | 'records';

interface GameStore {
  screen: Screen;
  settingsOpen: boolean;
  settings: SettingsState;
  save: SaveData;
  lastResult: GameOverResult | null;
  isNewRecord: boolean;
  lastRank: number | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  quitToMenu: () => void;
  openRecords: () => void;
  closeRecords: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  updateSettings: (patch: Partial<SettingsState>) => void;
  syncSettings: () => void;
}

const repo = new LocalStorageRepository();
const initialSave = repo.load();
if (!repo.hasSave()) {
  // Primeira visita: respeita a preferência do sistema por menos movimento.
  initialSave.settings.reducedEffects =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const useGameStore = create<GameStore>((set, get) => {
  // O jogo avisa o fim da partida; a interface registra o resultado e mostra a tela.
  bus.on('game:over', (result) => {
    if (get().screen !== 'playing') return;
    const applied = applyResult(get().save, result, new Date());
    repo.save(applied.save);
    set({
      screen: 'gameover',
      save: applied.save,
      lastResult: result,
      isNewRecord: applied.isNewRecord,
      lastRank: applied.rank,
    });
    if (applied.isNewRecord) bus.emit('record:new', { score: result.score });
  });

  return {
    screen: 'menu',
    settingsOpen: false,
    settings: initialSave.settings,
    save: initialSave,
    lastResult: null,
    isNewRecord: false,
    lastRank: null,

    start: () => {
      set({ screen: 'playing', settingsOpen: false });
      bus.emit('game:start', undefined);
    },
    pause: () => {
      if (get().screen !== 'playing') return;
      set({ screen: 'paused' });
      bus.emit('game:pause', undefined);
    },
    resume: () => {
      if (get().screen !== 'paused') return;
      set({ screen: 'playing', settingsOpen: false });
      bus.emit('game:resume', undefined);
    },
    restart: () => {
      set({ screen: 'playing', settingsOpen: false });
      bus.emit('game:start', undefined);
    },
    quitToMenu: () => {
      set({ screen: 'menu', settingsOpen: false });
      bus.emit('game:quit', undefined);
    },
    openRecords: () => set({ screen: 'records' }),
    closeRecords: () => set({ screen: 'menu' }),
    openSettings: () => set({ settingsOpen: true }),
    closeSettings: () => set({ settingsOpen: false }),
    updateSettings: (patch) => {
      const current = get().settings;
      const settings: SettingsState = {
        ...current,
        ...patch,
        musicVolume: clamp01(patch.musicVolume ?? current.musicVolume),
        sfxVolume: clamp01(patch.sfxVolume ?? current.sfxVolume),
      };
      const save = { ...get().save, settings };
      repo.save(save);
      set({ settings, save });
      bus.emit('settings:changed', settings);
    },
    syncSettings: () => bus.emit('settings:changed', get().settings),
  };
});
