import { EPlayer } from '../interfaces/gameplay-interfaces';
import { IImageConstructor } from '../interfaces/image.interface';

export class Tile extends Phaser.GameObjects.Image {
  private currentScene: Phaser.Scene;

  private occupiedBy: EPlayer = EPlayer.NOBODY;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // set image settings
    // this.setOrigin(0, 0);
    this.setInteractive();
    this.currentScene = aParams.scene;
    this.scene.add.existing(this);
  }

  getOccupiedBy() {
    return this.occupiedBy;
  }

  setOccupiedBy(occupiedBy: EPlayer) {
    this.occupiedBy = occupiedBy;
    this.currentScene.events.emit('tileOccupied', this);
  }
}
