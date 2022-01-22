import { IImageConstructor } from '../interfaces/image.interface';
import { EOccupiedBy } from '../interfaces/interface';

export class Tile extends Phaser.GameObjects.Image {
  private occupiedBy: EOccupiedBy = EOccupiedBy.NOBODY;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // set image settings
    // this.setOrigin(0, 0);
    this.setInteractive();

    this.scene.add.existing(this);
  }

  getOccupiedBy() {
    return this.occupiedBy;
  }

  setOccupiedBy(occupiedBy: EOccupiedBy) {
    this.occupiedBy = occupiedBy;
  }
}
