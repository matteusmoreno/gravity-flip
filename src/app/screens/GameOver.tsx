import { useEffect, useState } from 'react';
import { Button } from '@/app/components/Button';
import { Panel } from '@/app/components/Panel';
import { GAME_OVER_LOCK_MS } from '@/core/constants';
import { useGameStore } from '@/app/store/gameStore';

/** Número que sobe até o valor final, para a pontuação "contar". */
function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target === 0) {
      setValue(target);
      return;
    }
    let raf = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - startedAt) / durationMs);
      setValue(Math.round(target * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

export function GameOver() {
  const result = useGameStore((s) => s.lastResult);
  const isNewRecord = useGameStore((s) => s.isNewRecord);
  const restart = useGameStore((s) => s.restart);
  const quit = useGameStore((s) => s.quitToMenu);
  const shownScore = useCountUp(result?.score ?? 0);

  // Evita reiniciar sem querer por causa de toques ou teclas martelados no momento da derrota.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), GAME_OVER_LOCK_MS);
    return () => clearTimeout(t);
  }, []);

  if (!result) return null;
  const seconds = Math.round(result.durationMs / 1000);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-night/70 p-4">
      <Panel className="flex w-full max-w-md flex-col gap-5 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-magenta-neon">Fim de jogo</h2>
        <div>
          <div className="text-6xl font-black tabular-nums text-ink" aria-label={`Pontuação ${result.score}`}>
            {shownScore}
          </div>
          {isNewRecord && (
            <div className="neon-title mt-2 text-xl font-bold uppercase tracking-widest text-gold-neon">
              Novo recorde!
            </div>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-3 text-left">
          <Stat label="Tempo" value={`${seconds} s`} />
          <Stat label="Moedas" value={String(result.coins)} />
          <Stat label="Maior combo" value={`x${result.maxCombo}`} />
          <Stat label="Quase-colisões" value={String(result.nearMisses)} />
        </dl>
        <Button variant="primary" className="text-2xl" onClick={() => armed && restart()} autoFocus>
          Jogar de novo
        </Button>
        <Button onClick={quit}>Menu</Button>
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-night-2 px-4 py-2">
      <dt className="text-sm text-ink-dim">{label}</dt>
      <dd className="text-xl font-bold text-ink">{value}</dd>
    </div>
  );
}
