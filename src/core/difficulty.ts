import {
  BASE_SCROLL_SPEED,
  MAX_STAGE,
  MIN_PATTERN_GAP,
  PATTERN_GAP_SECONDS,
  STAGE_DURATION_MS,
  STAGE_SPEED_STEP,
} from './constants';

export const stageForTime = (elapsedMs: number): number =>
  Math.min(MAX_STAGE, Math.max(0, Math.floor(elapsedMs / STAGE_DURATION_MS)));

export const speedForStage = (stage: number): number =>
  BASE_SCROLL_SPEED * (1 + STAGE_SPEED_STEP * Math.min(MAX_STAGE, Math.max(0, stage)));

/** Espaço vazio entre trechos, proporcional à velocidade, para o jogador se posicionar. */
export const gapForSpeed = (speed: number): number =>
  Math.max(MIN_PATTERN_GAP, speed * PATTERN_GAP_SECONDS);
