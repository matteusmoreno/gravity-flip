import type Phaser from 'phaser';
import { bus } from '@/services/events';

/** Liga os eventos da interface às cenas do Phaser. Retorna a função que desfaz as ligações. */
export function attachGameController(game: Phaser.Game): () => void {
  const offs = [
    bus.on('game:start', () => {
      game.scene.stop('MenuBackdropScene');
      game.scene.stop('HudScene');
      game.scene.stop('GameScene');
      game.scene.start('GameScene'); // a GameScene abre a HudScene por cima
    }),
    bus.on('game:pause', () => game.scene.pause('GameScene')),
    bus.on('game:resume', () => game.scene.resume('GameScene')),
    bus.on('game:quit', () => {
      game.scene.stop('HudScene');
      game.scene.stop('GameScene');
      game.scene.start('MenuBackdropScene');
    }),
    bus.on('settings:changed', (settings) => game.registry.set('settings', settings)),
  ];
  return () => offs.forEach((off) => off());
}
