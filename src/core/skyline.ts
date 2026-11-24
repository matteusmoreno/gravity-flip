import { createRng } from './rng';

export interface Building {
  x: number;
  w: number;
  h: number;
}

export interface SkylineLayer {
  width: number;
  buildings: Building[];
}

export interface SkylineOptions {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

/** Prédios contíguos que cobrem exatamente `width` pixels, para repetir sem emenda. Determinístico por seed. */
export function generateSkyline(seed: number, width: number, o: SkylineOptions): SkylineLayer {
  const rng = createRng(seed);
  const buildings: Building[] = [];
  let x = 0;
  while (x < width) {
    const remaining = width - x;
    let w = Math.round(o.minWidth + rng() * (o.maxWidth - o.minWidth));
    // Evita um último prédio estreito demais: o resto é absorvido pelo anterior ou ocupa o espaço que sobrou.
    if (remaining - w < o.minWidth) w = remaining;
    const h = Math.round(o.minHeight + rng() * (o.maxHeight - o.minHeight));
    buildings.push({ x, w, h });
    x += w;
  }
  return { width, buildings };
}

/** Janela acesa ou apagada, de forma determinística por posição (0 a 1 na proporção de acesas). */
export function windowLit(buildingX: number, col: number, row: number, litRatio = 0.4): boolean {
  let h = (buildingX * 73856093) ^ (col * 19349663) ^ (row * 83492791);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296 < litRatio;
}
