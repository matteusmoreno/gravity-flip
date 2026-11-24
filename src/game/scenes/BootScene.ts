import Phaser from 'phaser';

/** Cena inicial: no futuro carrega recursos; por enquanto só abre o fundo do menu. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    this.scene.start('MenuBackdropScene');
  }
}
