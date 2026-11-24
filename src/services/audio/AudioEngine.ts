import { STEP_SECONDS, midiToFreq, musicStep, type MusicEvent } from '@/core/music';
import { bus, type SettingsState } from '@/services/events';
import { sfxRecipe, type SfxName } from './sfx';

const MUSIC_GAIN = 0.35;
const SFX_GAIN = 0.8;
const PAUSE_DUCK = 0.25;
const LOOKAHEAD_S = 0.14;
const TICK_MS = 30;
const MIN_REPEAT_MS = 35;

/** Motor de áudio: tudo sintetizado com Web Audio, sem arquivos. O contexto só nasce após um gesto do usuário. */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicGain!: GainNode;
  private sfxGain!: GainNode;
  private noise: AudioBuffer | null = null;
  private settings: SettingsState;
  private musicOn = false;
  private ducked = false;
  private stage = 0;
  private step = 0;
  private nextTime = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private lastPlayed = new Map<SfxName, number>();

  constructor(settings: SettingsState) {
    this.settings = settings;
  }

  /** Cria o contexto (precisa de gesto do usuário, por causa da política de autoplay dos navegadores). */
  unlock(): void {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.connect(this.master);
      this.sfxGain.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.noise = this.makeNoise(this.ctx);
      this.applyVolumes();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    if (this.musicOn) this.startScheduler();
  }

  resumeIfSuspended(): void {
    if (this.ctx && this.ctx.state !== 'running') void this.ctx.resume();
  }

  setSettings(settings: SettingsState): void {
    this.settings = settings;
    this.applyVolumes();
  }

  setDucked(ducked: boolean): void {
    this.ducked = ducked;
    this.applyVolumes();
  }

  setStage(stage: number): void {
    this.stage = stage;
  }

  startMusic(): void {
    this.musicOn = true;
    this.step = 0;
    this.stage = 0;
    this.ducked = false;
    this.applyVolumes();
    this.startScheduler();
  }

  stopMusic(): void {
    this.musicOn = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  play(name: SfxName, level = 0): void {
    const ctx = this.ctx;
    if (!ctx || this.settings.muted || ctx.state !== 'running') return;
    const now = performance.now();
    if (now - (this.lastPlayed.get(name) ?? -1e9) < MIN_REPEAT_MS) return;
    this.lastPlayed.set(name, now);
    const t0 = ctx.currentTime + 0.005;
    for (const voice of sfxRecipe(name, level)) {
      this.voice(voice.wave, voice.f0, voice.f1, t0 + voice.at, voice.dur, voice.vol, this.sfxGain);
    }
  }

  private applyVolumes(): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const muted = this.settings.muted;
    this.master.gain.setTargetAtTime(muted ? 0 : 1, t, 0.02);
    this.musicGain.gain.setTargetAtTime(this.settings.musicVolume * MUSIC_GAIN * (this.ducked ? PAUSE_DUCK : 1), t, 0.05);
    this.sfxGain.gain.setTargetAtTime(this.settings.sfxVolume * SFX_GAIN, t, 0.02);
  }

  private startScheduler(): void {
    if (!this.ctx || this.timer) return;
    this.nextTime = this.ctx.currentTime + 0.08;
    this.timer = setInterval(() => this.schedule(), TICK_MS);
  }

  /** Agenda os passos da música um pouco à frente do relógio do áudio, para o ritmo não oscilar. */
  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicOn) return;
    if (this.nextTime < ctx.currentTime - 0.5) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + LOOKAHEAD_S) {
      for (const e of musicStep(this.step, this.stage)) this.playMusicEvent(e, this.nextTime);
      this.step++;
      this.nextTime += STEP_SECONDS;
    }
  }

  private playMusicEvent(e: MusicEvent, t: number): void {
    const out = this.musicGain;
    switch (e.kind) {
      case 'kick':
        this.voice('sine', 150, 42, t, 0.14, 0.9, out);
        break;
      case 'bass':
        this.voice('sawtooth', midiToFreq(e.midi ?? 45), midiToFreq(e.midi ?? 45), t, STEP_SECONDS * 1.8, 0.35, out, 380);
        break;
      case 'hat':
        this.voice('noise', 7000, 7000, t, 0.04, 0.18, out, 7000, 'highpass');
        break;
      case 'arp':
        this.voice('square', midiToFreq(e.midi ?? 69), midiToFreq(e.midi ?? 69), t, STEP_SECONDS * 0.9, 0.12, out, 2600);
        break;
    }
  }

  private voice(
    wave: OscillatorType | 'noise',
    f0: number,
    f1: number,
    t: number,
    dur: number,
    vol: number,
    out: AudioNode,
    cutoff?: number,
    filterType: BiquadFilterType = 'lowpass',
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let source: AudioScheduledSourceNode;
    if (wave === 'noise') {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = filterType === 'highpass' ? 'highpass' : 'lowpass';
      filter.frequency.setValueAtTime(f0, t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(f1, 20), t + dur);
      src.connect(filter).connect(gain);
      source = src;
    } else {
      const osc = ctx.createOscillator();
      osc.type = wave;
      osc.frequency.setValueAtTime(f0, t);
      if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 20), t + dur);
      if (cutoff) {
        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = cutoff;
        osc.connect(filter).connect(gain);
      } else {
        osc.connect(gain);
      }
      source = osc;
    }
    gain.connect(out);
    source.start(t);
    source.stop(t + dur + 0.02);
  }

  private makeNoise(ctx: AudioContext): AudioBuffer {
    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}

/** Liga o motor aos eventos do jogo e da interface. Retorna a função que desfaz as ligações. */
export function attachAudio(initial: SettingsState): () => void {
  const engine = new AudioEngine(initial);
  const unlock = () => engine.unlock();
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
  // iOS Safari suspende o áudio ao trocar de app; ao voltar, o contexto precisa ser retomado.
  const onVisible = () => !document.hidden && engine.resumeIfSuspended();
  document.addEventListener('visibilitychange', onVisible);

  const offs = [
    bus.on('settings:changed', (s) => engine.setSettings(s)),
    bus.on('game:start', () => engine.startMusic()),
    bus.on('game:pause', () => engine.setDucked(true)),
    bus.on('game:resume', () => engine.setDucked(false)),
    bus.on('game:quit', () => engine.stopMusic()),
    bus.on('game:over', () => {
      engine.stopMusic();
      window.setTimeout(() => engine.play('gameOver'), 450);
    }),
    bus.on('record:new', () => window.setTimeout(() => engine.play('record'), 700)),
    bus.on('audio:stage', ({ stage }) => engine.setStage(stage)),
    bus.on('audio:sfx', ({ name, level }) => engine.play(name, level ?? 0)),
  ];
  return () => {
    offs.forEach((off) => off());
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    document.removeEventListener('visibilitychange', onVisible);
    engine.stopMusic();
  };
}
