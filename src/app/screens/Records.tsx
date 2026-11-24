import { Button } from '@/app/components/Button';
import { Panel } from '@/app/components/Panel';
import { useGameStore } from '@/app/store/gameStore';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

export function Records() {
  const ranking = useGameStore((s) => s.save.ranking);
  const lastRank = useGameStore((s) => s.lastRank);
  const close = useGameStore((s) => s.closeRecords);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
      <Panel className="flex w-full max-w-md flex-col gap-5">
        <h2 className="neon-title text-3xl font-bold uppercase tracking-widest text-cyan-neon">Recordes</h2>
        {ranking.length === 0 ? (
          <p className="py-6 text-center text-ink-dim">Nenhuma partida ainda. Que tal jogar a primeira?</p>
        ) : (
          <ol className="flex flex-col gap-2" aria-label="Melhores pontuações">
            {ranking.map((entry, i) => (
              <li
                key={`${entry.date}-${i}`}
                className={`flex items-center justify-between rounded-lg px-4 py-2 ${
                  lastRank === i + 1 ? 'bg-gold-neon/15 text-gold-neon' : 'bg-night-2 text-ink'
                }`}
              >
                <span className="w-8 text-ink-dim">{i + 1}.</span>
                <span className="flex-1 text-xl font-bold">{entry.score}</span>
                <span className="text-sm text-ink-dim">{formatDate(entry.date)}</span>
              </li>
            ))}
          </ol>
        )}
        <Button variant="primary" onClick={close} autoFocus>
          Voltar
        </Button>
      </Panel>
    </div>
  );
}
