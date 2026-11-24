import { Button } from '@/app/components/Button';
import { Panel } from '@/app/components/Panel';
import { Slider } from '@/app/components/Slider';
import { Toggle } from '@/app/components/Toggle';
import { useGameStore } from '@/app/store/gameStore';

/** Painel rápido: volumes, mudo e efeitos reduzidos. Aparece no menu e no pause. */
export function QuickSettings() {
  const settings = useGameStore((s) => s.settings);
  const update = useGameStore((s) => s.updateSettings);
  const close = useGameStore((s) => s.closeSettings);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-night/70 p-4">
      <Panel className="w-full max-w-md">
        <div role="dialog" aria-modal="true" aria-label="Som e efeitos" className="flex flex-col gap-5">
          <h2 className="neon-title text-2xl font-bold uppercase tracking-widest text-cyan-neon">Som e efeitos</h2>
          <Slider label="Música" value={settings.musicVolume} onChange={(v) => update({ musicVolume: v })} />
          <Slider label="Efeitos" value={settings.sfxVolume} onChange={(v) => update({ sfxVolume: v })} />
          <Toggle label="Mudo" checked={settings.muted} onChange={(muted) => update({ muted })} />
          <Toggle
            label="Efeitos reduzidos"
            description="Desliga rotação do cenário, glitch e tremor de tela"
            checked={settings.reducedEffects}
            onChange={(reducedEffects) => update({ reducedEffects })}
          />
          <Button variant="primary" onClick={close} autoFocus>
            Fechar
          </Button>
        </div>
      </Panel>
    </div>
  );
}
