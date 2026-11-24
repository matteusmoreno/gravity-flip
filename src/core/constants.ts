/** Parâmetros de balanceamento centralizados (ajustáveis em testes). Ver DECISIONS.md. */
export const FLIP_COOLDOWN_MS = 300;
export const FLIP_INPUT_BUFFER_MS = 100;
export const START_LIVES = 3;
export const INVULNERABLE_MS = 1500;
export const HITBOX_SCALE = 0.8;
export const STAGE_DURATION_MS = 25_000;
export const LOGICAL_WIDTH = 1280;
export const LOGICAL_HEIGHT = 720;

export const COLORS = {
  night: 0x0b0b1e,
  night2: 0x14143a,
  cyan: 0x19f0ff,
  magenta: 0xff2e9a,
  gold: 0xffe94d,
  shield: 0x4d7cff,
  ink: 0xeaf6ff,
} as const;

/** Física do jogador (M1). Valores iniciais, ajustáveis em testes de jogo. */
export const PLAYER_RADIUS = 24;
export const SURFACE_MARGIN = 80;
export const GRAVITY_ACCEL = 9000;
export const MAX_FALL_SPEED = 1500;
export const FIXED_STEP_MS = 1000 / 60;
export const BASE_SCROLL_SPEED = 420;

/** Obstáculos e geração (M2). */
export const BARRIER_GAP_HEIGHT = 150;
export const MAX_STAGE = 8;
export const STAGE_SPEED_STEP = 0.1;
export const PATTERN_GAP_SECONDS = 1.1;
export const MIN_PATTERN_GAP = 400;

/** Dano e escudo (M3). */
export const SHIELD_BREAK_INVULN_MS = 600;
export const PICKUP_RADIUS = 18;
export const SHIELD_PICKUP_CHANCE = 0.25;

/** Moedas, pontuação e combo (M4). Valores iniciais, ajustáveis em testes de jogo. */
export const COIN_RADIUS = 12;
export const COIN_GROUP_CHANCE = 0.75;
export const PX_PER_METER = 60;
export const POINTS_PER_METER = 10;
export const COIN_POINTS = 50;
export const NEAR_MISS_POINTS = 25;
export const NEAR_MISS_PX = 28;
export const COMBO_STEP = 4;
export const MAX_MULTIPLIER = 5;
export const COMBO_TIMEOUT_MS = 3000;
export const COMBO_DECAY_MS = 1000;

/** Progressão e interface (M5). */
export const RANKING_SIZE = 10;
export const RESUME_COUNTDOWN_MS = 3000;
export const GAME_OVER_LOCK_MS = 500;

/** Efeitos visuais (M6). */
export const FLIP_TILT_MAX = 0.05;
export const FLIP_TILT_MS = 280;
export const SHOCKWAVE_MS = 350;
export const SHOCKWAVE_MAX_RADIUS = 180;
export const STRETCH_MAX = 0.45;
export const MAX_PARTICLES = 320;
export const GLITCH_MS = 240;
export const SKYLINE_WIDTH = 1700;
export const LOW_FPS_THRESHOLD = 45;
