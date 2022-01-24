import { Tile } from '../objects/tile';
import { GameController } from '../controller/game-controller';
import { CONST } from '../const/const';
import { EGameImage } from './boot-scene';

export class GameScene extends Phaser.Scene {
  private gameController: GameController;

  constructor() {
    super({
      key: 'GameScene',
    });
  }

  init(): void {
    // Init the game controller
    this.gameController = new GameController(this);

    // set background color
    this.cameras.main.setBackgroundColor('#606252');

    let tileIndex = 0;
    for (let y = 0; y < CONST.gridHeight; y += 1) {
      for (let x = 0; x < CONST.gridWidth; x += 1) {
        this.createTile(x, y, tileIndex);
        tileIndex += 1;
      }
    }

    // create events from hud
    const hud = this.scene.get('HUDScene');
    hud.events.on('labelWinnerClicked', this.restartScene, this);

    // create events from scene
    this.input.on('pointerdown', this.handlePlayerClick, this);
  }

  createTile(x: number, y: number, tileIndex: any) {
    const tile = new Tile({
      scene: this,
      x:
        x * (CONST.tileWidth + +CONST.tilePadding) +
        (CONST.width / 3 + CONST.tileWidth / 2),
      y: y * (CONST.tileHeight + CONST.tilePadding) + CONST.tileHeight,
      texture: EGameImage.TILE,
    });

    this.gameController.addTileToBoard(tile, tileIndex);
  }

  /**
   * This function gets called, as soon as a tile has been pressed or clicked.
   * @param pointer
   * @param gameobject
   * @param event
   */
  private async handlePlayerClick(
    pointer: any,
    gameObjectArray: Array<Phaser.GameObjects.GameObject>
  ) {
    gameObjectArray.forEach((gameObject: Phaser.GameObjects.GameObject) => {
      if (gameObject instanceof Tile) {
        const tile: Tile = gameObject;
        this.gameController.handleTileOccupation(tile);
      }
    });
  }

  restartScene() {
    this.scene.restart();
    this.gameController.restartScene();
  }
}
