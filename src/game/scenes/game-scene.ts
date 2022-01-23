import { Tile } from '../objects/tile';
import { GameController } from '../controller/game-controller';

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

    // create events from hud
    const hud = this.scene.get('HUDScene');
    hud.events.on('labelWinnerClicked', this.restartScene, this);

    // create events from scene
    this.input.on('pointerdown', this.handlePlayerClick, this);
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
