import { Button } from '@/app/components/Button';
import { useGameStore } from '@/app/store/gameStore';

export function MainMenu() {
  const best = useGameStore((s) => s.save.bestScore);
  const start = useGameStore((s) => s.start);
  const openRecords = useGameStore((s) => s.openRecords);
  const openSettings = useGameStore((s) => s.openSettings);

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 p-4 text-center">
      <h1 className="neon-title text-5xl font-black uppercase tracking-[0.2em] text-cyan-neon sm:text-7xl">
        Gravity <span className="text-magenta-neon">Flip</span>
      </h1>
      <div className="flex flex-col items-center gap-4">
        <Button variant="primary" className="min-w-56 text-2xl" onClick={start} autoFocus>
          Jogar
        </Button>
        <Button className="min-w-56" onClick={openRecords}>
          Recordes
        </Button>
      </div>
      <p className="text-ink-dim">
        Melhor recorde: <span className="font-bold text-gold-neon">{best}</span>
      </p>
      <Button
        aria-label="Som e efeitos"
        className="absolute right-4 top-4 !px-3 !py-2 text-2xl normal-case"
        onClick={openSettings}
      >
        ♪
      </Button>
    </div>
  );
}
