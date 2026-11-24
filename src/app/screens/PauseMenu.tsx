import { Button } from '@/app/components/Button';
import { Panel } from '@/app/components/Panel';
import { useGameStore } from '@/app/store/gameStore';

export function PauseMenu() {
  const resume = useGameStore((s) => s.resume);
  const restart = useGameStore((s) => s.restart);
  const quit = useGameStore((s) => s.quitToMenu);
  const openSettings = useGameStore((s) => s.openSettings);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-night/60 p-4">
      <Panel className="flex w-full max-w-sm flex-col gap-4 text-center">
        <h2 className="neon-title text-3xl font-bold uppercase tracking-widest text-cyan-neon">Pausado</h2>
        <Button variant="primary" onClick={resume} autoFocus>
          Continuar
        </Button>
        <Button onClick={restart}>Reiniciar</Button>
        <Button onClick={openSettings}>Som e efeitos</Button>
        <Button onClick={quit}>Menu</Button>
      </Panel>
    </div>
  );
}
