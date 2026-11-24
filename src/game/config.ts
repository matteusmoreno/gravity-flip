import Phaser from 'phaser';
import { COLORS, LOGICAL_HEIGHT, LOGICAL_WIDTH } from '@/core/constants';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { HudScene } from './scenes/HudScene';
import { MenuBackdropScene } from './scenes/MenuBackdropScene';

export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
    backgroundColor: COLORS.night,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: 'arcade' },
    scene: [BootScene, MenuBackdropScene, GameScene, HudScene],
  });
}
