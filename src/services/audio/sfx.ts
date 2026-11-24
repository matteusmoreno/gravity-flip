/** Receitas dos efeitos sonoros: listas de "vozes" sintetizadas. Dados puros, sem Web Audio. */

export type SfxName =
  | 'flip'
  | 'land'
  | 'coin'
  | 'shield'
  | 'absorb'
  | 'hit'
  | 'nearMiss'
  | 'stage'
  | 'death'
  | 'gameOver'
  | 'record'
  | 'tick'
  | 'ui';

export interface Voice {
  wave: OscillatorType | 'noise';
  /** Frequência inicial e final em Hz (para ruído, é a frequência do filtro). */
  f0: number;
  f1: number;
  /** Atraso e duração em segundos. */
  at: number;
  dur: number;
  vol: number;
}

const v = (wave: Voice['wave'], f0: number, f1: number, at: number, dur: number, vol: number): Voice => ({
  wave,
  f0,
  f1,
  at,
  dur,
  vol,
});

/** `level` (0 a 4) sobe o tom da moeda conforme o combo. */
export function sfxRecipe(name: SfxName, level = 0): Voice[] {
  switch (name) {
    case 'flip':
      return [v('sine', 260, 760, 0, 0.14, 0.5), v('triangle', 520, 1500, 0, 0.1, 0.18)];
    case 'land':
      return [v('sine', 120, 55, 0, 0.09, 0.35), v('noise', 900, 300, 0, 0.05, 0.12)];
    case 'coin': {
      const base = 880 * 2 ** (Math.min(Math.max(level, 0), 4) / 12 * 2);
      return [v('square', base, base, 0, 0.07, 0.22), v('square', base * 1.5, base * 1.5, 0.07, 0.12, 0.22)];
    }
    case 'shield':
      return [v('sine', 440, 440, 0, 0.1, 0.4), v('sine', 660, 660, 0.08, 0.1, 0.4), v('sine', 880, 880, 0.16, 0.2, 0.4)];
    case 'absorb':
      return [v('triangle', 900, 300, 0, 0.25, 0.45), v('noise', 4000, 800, 0, 0.18, 0.2)];
    case 'hit':
      return [v('sawtooth', 220, 60, 0, 0.3, 0.5), v('noise', 2500, 200, 0, 0.25, 0.4)];
    case 'nearMiss':
      return [v('sine', 700, 1400, 0, 0.12, 0.3)];
    case 'stage':
      return [v('square', 330, 330, 0, 0.1, 0.2), v('square', 440, 440, 0.1, 0.1, 0.2), v('square', 660, 660, 0.2, 0.22, 0.2)];
    case 'death':
      return [v('sawtooth', 400, 40, 0, 0.7, 0.5), v('noise', 3000, 100, 0, 0.6, 0.45)];
    case 'gameOver':
      return [v('triangle', 330, 330, 0, 0.25, 0.4), v('triangle', 262, 262, 0.25, 0.25, 0.4), v('triangle', 196, 196, 0.5, 0.55, 0.4)];
    case 'record':
      return [
        v('square', 523, 523, 0, 0.12, 0.22),
        v('square', 659, 659, 0.12, 0.12, 0.22),
        v('square', 784, 784, 0.24, 0.12, 0.22),
        v('square', 1047, 1047, 0.36, 0.4, 0.25),
      ];
    case 'tick':
      return [v('sine', 660, 660, 0, 0.07, 0.3)];
    case 'ui':
      return [v('triangle', 500, 700, 0, 0.05, 0.2)];
  }
}
