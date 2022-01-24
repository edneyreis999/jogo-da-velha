import { IImageConstructor } from '../interfaces/image.interface';

export class Pawn extends Phaser.GameObjects.Image {
  private currentScene: Phaser.Scene;

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // set image settings
    // this.setOrigin(0, 0);
    this.setInteractive();
    this.currentScene = aParams.scene;
    this.scene.add.existing(this);
  }
}
