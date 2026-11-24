import { describe, expect, it } from 'vitest';
import { MUSIC_BPM, STEPS_PER_BAR, STEP_SECONDS, midiToFreq, musicStep } from '@/core/music';
import { sfxRecipe, type SfxName } from '@/services/audio/sfx';

const NAMES: SfxName[] = ['flip', 'land', 'coin', 'shield', 'absorb', 'hit', 'nearMiss', 'stage', 'death', 'gameOver', 'record', 'tick', 'ui'];

describe('música procedural', () => {
  it('converte MIDI em frequência', () => {
    expect(midiToFreq(69)).toBeCloseTo(440, 5);
    expect(midiToFreq(57)).toBeCloseTo(220, 5);
  });

  it('o passo dura uma semicolcheia do andamento', () => {
    expect(STEP_SECONDS).toBeCloseTo(60 / MUSIC_BPM / 4, 9);
  });

  it('bumbo cai nos 4 tempos de cada compasso', () => {
    for (let bar = 0; bar < 4; bar++) {
      const kicks = [];
      for (let i = 0; i < STEPS_PER_BAR; i++) {
        if (musicStep(bar * STEPS_PER_BAR + i, 0).some((e) => e.kind === 'kick')) kicks.push(i);
      }
      expect(kicks).toEqual([0, 4, 8, 12]);
    }
  });

  it('camadas entram por estágio', () => {
    const kinds = (stage: number) => {
      const set = new Set<string>();
      for (let i = 0; i < 64; i++) musicStep(i, stage).forEach((e) => set.add(e.kind));
      return [...set].sort();
    };
    expect(kinds(0)).toEqual(['bass', 'kick']);
    expect(kinds(1)).toEqual(['bass', 'hat', 'kick']);
    expect(kinds(2)).toEqual(['arp', 'bass', 'hat', 'kick']);
  });

  it('é determinística e se repete a cada 4 compassos', () => {
    for (let i = 0; i < 64; i++) {
      expect(musicStep(i, 3)).toEqual(musicStep(i, 3));
      expect(musicStep(i, 3)).toEqual(musicStep(i + 64, 3));
    }
  });

  it('notas ficam em faixa audível', () => {
    for (let i = 0; i < 64; i++) {
      for (const e of musicStep(i, 5)) {
        if (e.midi !== undefined) expect(midiToFreq(e.midi)).toBeGreaterThan(40);
        if (e.midi !== undefined) expect(midiToFreq(e.midi)).toBeLessThan(2000);
      }
    }
  });
});

describe('efeitos sonoros', () => {
  it('toda receita tem vozes válidas', () => {
    for (const name of NAMES) {
      const voices = sfxRecipe(name);
      expect(voices.length, name).toBeGreaterThan(0);
      for (const v of voices) {
        expect(v.f0).toBeGreaterThan(0);
        expect(v.f1).toBeGreaterThan(0);
        expect(v.dur).toBeGreaterThan(0);
        expect(v.at).toBeGreaterThanOrEqual(0);
        expect(v.vol).toBeGreaterThan(0);
        expect(v.vol).toBeLessThanOrEqual(1);
      }
    }
  });

  it('a moeda sobe de tom com o combo e limita o nível', () => {
    const f = (level: number) => sfxRecipe('coin', level)[0]!.f0;
    expect(f(1)).toBeGreaterThan(f(0));
    expect(f(4)).toBeGreaterThan(f(2));
    expect(f(10)).toBe(f(4));
    expect(f(-3)).toBe(f(0));
  });
});
