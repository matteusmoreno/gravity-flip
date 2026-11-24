/** Música procedural: dados puros (sem Web Audio), para poder testar. O motor de áudio só toca estes eventos. */

export const MUSIC_BPM = 128;
/** Duração de uma semicolcheia, em segundos. */
export const STEP_SECONDS = 60 / MUSIC_BPM / 4;
export const STEPS_PER_BAR = 16;

export type MusicKind = 'kick' | 'bass' | 'hat' | 'arp';

export interface MusicEvent {
  kind: MusicKind;
  /** Nota MIDI (só para bass e arp). */
  midi?: number;
}

/** Progressão Am - F - C - G: raiz do baixo e tríade de cada compasso. */
const BARS: { bass: number; triad: [number, number, number] }[] = [
  { bass: 45, triad: [57, 60, 64] },
  { bass: 41, triad: [53, 57, 60] },
  { bass: 48, triad: [60, 64, 67] },
  { bass: 43, triad: [55, 59, 62] },
];
const ARP_ORDER = [0, 1, 2, 1] as const;

export function midiToFreq(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

/** Camadas entram conforme o estágio: bumbo e baixo sempre; chimbal a partir do 2; arpejo a partir do 3. */
export function musicStep(step: number, stage: number): MusicEvent[] {
  const inBar = ((step % STEPS_PER_BAR) + STEPS_PER_BAR) % STEPS_PER_BAR;
  const bar = BARS[Math.floor(step / STEPS_PER_BAR) % BARS.length] ?? BARS[0]!;
  const events: MusicEvent[] = [];
  if (inBar % 4 === 0) events.push({ kind: 'kick' });
  if (inBar === 0 || inBar % 4 === 2) events.push({ kind: 'bass', midi: bar.bass });
  if (stage >= 1 && inBar % 2 === 1) events.push({ kind: 'hat' });
  if (stage >= 2) {
    const idx = ARP_ORDER[inBar % 4] ?? 0;
    const octave = inBar % 8 >= 4 ? 12 : 0;
    events.push({ kind: 'arp', midi: bar.triad[idx] + octave });
  }
  return events;
}
