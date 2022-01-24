import { BootScene } from './game/scenes/boot-scene';
import { GameScene } from './game/scenes/game-scene';
import { HUDScene } from './game/scenes/hud-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Super Tic Tac Toe',
  version: '1.0',
  width: 620,
  height: 300,
  type: Phaser.AUTO,
  parent: 'game-refactor',
  scene: [BootScene, HUDScene, GameScene],
  backgroundColor: '#de3412',
  render: { pixelArt: true, antialias: false },
};
