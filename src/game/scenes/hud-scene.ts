import { CONST } from '../const/const';
import { EPlayer } from '../interfaces/gameplay-interfaces';
import { Tile } from '../objects/tile';
import { EGameImage } from './boot-scene';

export class HUDScene extends Phaser.Scene {
  private playerHeros: Phaser.GameObjects.Sprite[];

  private alfaHeros: Phaser.GameObjects.Sprite[];

  constructor() {
    super({
      key: 'HUDScene',
      active: true,
    });
  }

  create() {
    // create events
    const level = this.scene.get('GameScene');
    level.events.on('tileOccupied', this.updateTileOcupation, this);
    level.events.on('toggleTurn', this.displayToggleTurnMessage, this);
    level.events.on('hasWinner', this.displayWinner, this);
  }

  displayWinner(tiles: Tile[]) {
    const firstTile = tiles[0];
    let displayText: string;
    const x = CONST.width / 2;
    const y = CONST.height / 2;

    if (firstTile.getOccupiedBy() === EPlayer.PLAYER) {
      displayText = 'You Won!!';
    } else if (firstTile.getOccupiedBy() === EPlayer.ALFA) {
      displayText = 'Enemy Won!!';
    } else {
      displayText = 'TIE!';
    }

    const label = this.add.text(x, y, displayText, {
      fontSize: '104px Arial',
      backgroundColor: '#00F',
    });
    label.setOrigin(0.5, 0.5);
    label.setInteractive();

    label.on('pointerdown', () => {
      this.events.emit('labelWinnerClicked');
      this.scene.restart();
    });

    this.tweens.add({
      targets: label,
      alpha: 0,
      ease: 'Power1',
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    if (firstTile.getOccupiedBy() !== EPlayer.NOBODY) {
      tiles.forEach((tile) => {
        this.tweens.add({
          targets: tile,
          angle: 360,
          ease: 'None',
          duration: 1000,
          repeat: -1,
        });
      });
    }
  }

  displayToggleTurnMessage(player: EPlayer) {
    const x = CONST.width / 2;
    const y = CONST.height / 2;
    const displayText = `${
      player === EPlayer.PLAYER ? 'Your' : `Enemy's`
    } Turn`;
    const label = this.add.text(x, y, displayText, {
      fontSize: '72px Arial',
    });
    label.setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: label,
      alpha: 0,
      ease: 'Power1',
      duration: 1000,
    });
  }

  private updateTileOcupation(tile: Tile) {
    const imageToSpawn: EGameImage =
      tile.getOccupiedBy() === EPlayer.PLAYER
        ? EGameImage.ELF_X
        : EGameImage.ELF_O;

    this.add.sprite(tile.x, tile.y, imageToSpawn);
  }
}
