import { useGameStore } from '@/app/store/gameStore';

/** Botão de pause discreto, no canto superior direito (longe da área principal de toque). */
export function PauseButton() {
  const pause = useGameStore((s) => s.pause);
  return (
    <button
      type="button"
      aria-label="Pausar"
      onClick={pause}
      className="pointer-events-auto absolute right-3 top-3 z-10 h-11 w-11 rounded-lg border border-ink-dim/50 bg-night/50 text-xl text-ink-dim transition hover:text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-ink/80"
    >
      ❚❚
    </button>
  );
}
