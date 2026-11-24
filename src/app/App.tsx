import { useEffect, useRef, useState } from 'react';
import { createGame } from '@/game/config';
import { attachGameController } from '@/game/GameController';
import { useGameStore } from '@/app/store/gameStore';
import { attachAudio } from '@/services/audio/AudioEngine';
import { GameOver } from '@/app/screens/GameOver';
import { MainMenu } from '@/app/screens/MainMenu';
import { OrientationNotice } from '@/app/screens/OrientationNotice';
import { PauseButton } from '@/app/screens/PauseButton';
import { PauseMenu } from '@/app/screens/PauseMenu';
import { QuickSettings } from '@/app/screens/QuickSettings';
import { Records } from '@/app/screens/Records';

const isPortraitPhone = () => window.innerHeight > window.innerWidth && window.innerWidth < 900;

export function App() {
  const container = useRef<HTMLDivElement>(null);
  const screen = useGameStore((s) => s.screen);
  const settingsOpen = useGameStore((s) => s.settingsOpen);
  const [portrait, setPortrait] = useState(isPortraitPhone);

  // Cria o jogo uma única vez e liga os eventos da interface às cenas.
  useEffect(() => {
    if (!container.current) return;
    let game: ReturnType<typeof createGame> | undefined;
    let detach: (() => void) | undefined;
    let cancelled = false;
    // Espera as fontes carregarem para o canvas já desenhar o HUD com a fonte certa.
    const fonts = Promise.all([document.fonts.load('900 24px Orbitron'), document.fonts.load('700 24px Orbitron')]).catch(() => undefined);
    void fonts.then(() => {
      if (cancelled || !container.current) return;
      game = createGame(container.current);
      detach = attachGameController(game);
      useGameStore.getState().syncSettings();
    });
    return () => {
      cancelled = true;
      detach?.();
      game?.destroy(true);
    };
  }, []);

  // Áudio sintetizado: o contexto só é criado no primeiro gesto do usuário.
  useEffect(() => attachAudio(useGameStore.getState().settings), []);

  // Atalhos: P ou Esc pausam e retomam; Esc também fecha painéis.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || !(e.key === 'Escape' || e.key === 'p' || e.key === 'P')) return;
      const s = useGameStore.getState();
      if (s.settingsOpen) s.closeSettings();
      else if (s.screen === 'playing') s.pause();
      else if (s.screen === 'paused') s.resume();
      else if (s.screen === 'records') s.closeRecords();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Pausa automática ao esconder a aba ou perder o foco da janela (ex.: ligação ou troca de app no celular).
  useEffect(() => {
    const pause = () => useGameStore.getState().pause();
    const onHidden = () => document.hidden && pause();
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('blur', pause);
    window.addEventListener('pagehide', pause);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('blur', pause);
      window.removeEventListener('pagehide', pause);
    };
  }, []);

  // Em retrato no celular, mostra o aviso e pausa a partida.
  useEffect(() => {
    const onResize = () => setPortrait(isPortraitPhone());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useEffect(() => {
    if (portrait) useGameStore.getState().pause();
  }, [portrait]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={container} data-testid="game-root" className="absolute inset-0" />
      <div className={`absolute inset-0 ${screen === 'playing' ? 'pointer-events-none' : ''}`}>
        {screen === 'menu' && <MainMenu />}
        {screen === 'records' && <Records />}
        {screen === 'playing' && <PauseButton />}
        {screen === 'paused' && <PauseMenu />}
        {screen === 'gameover' && <GameOver />}
        {settingsOpen && <QuickSettings />}
        {portrait && <OrientationNotice />}
      </div>
    </div>
  );
}
