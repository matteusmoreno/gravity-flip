import type { SfxName } from '@/services/audio/sfx';

export interface GameOverResult {
  score: number;
  coins: number;
  maxCombo: number;
  nearMisses: number;
  durationMs: number;
}

export interface SettingsState {
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
  reducedEffects: boolean;
}

export interface EventMap {
  'game:start': undefined;
  'game:pause': undefined;
  'game:resume': undefined;
  'game:quit': undefined;
  'game:over': GameOverResult;
  'settings:changed': SettingsState;
  'record:new': { score: number };
  'audio:sfx': { name: SfxName; level?: number };
  'audio:stage': { stage: number };
}

type Handler<T> = (payload: T) => void;

export class TypedEventBus {
  private handlers = new Map<keyof EventMap, Set<Handler<never>>>();

  on<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>): () => void {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler as Handler<never>);
    this.handlers.set(event, set);
    return () => set.delete(handler as Handler<never>);
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    this.handlers.get(event)?.forEach((h) => (h as Handler<EventMap[K]>)(payload));
  }
}

export const bus = new TypedEventBus();
