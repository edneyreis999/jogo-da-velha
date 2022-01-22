import {
  elf_red,
  elf_blue,
  orc_red,
  orc_blue,
  dwarf_red,
  dwarf_blue,
  tile,
} from '../../assets';

export enum EGameImage {
  BLANKSQUARE = 'blankSquare',
  COOKIE1 = 'cookie1',
  COOKIE2 = 'cookie2',
  POPTART1 = 'poptart1',
  TILE = 'tile',
  ELF_X = 'elf_red',
  ELF_O = 'elf_blue',
  ORC_X = 'orc_red',
  ORC_O = 'orc_blue',
  DWARF_X = 'dwarf_red',
  DWARF_O = 'dwarf_blue',
}

export class BootScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;

  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: 'BootScene',
    });
  }

  preload(): void {
    // set the background and create loading bar
    this.cameras.main.setBackgroundColor(0x98d687);
    this.createLoadingbar();

    // pass value to change the loading bar fill
    this.load.on(
      'progress',
      (value: number) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xfff6d3, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    // delete bar graphics, when loading complete
    this.load.on(
      'complete',
      () => {
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );

    this.load.image(EGameImage.TILE, tile);
    this.load.image(EGameImage.ELF_X, elf_red);
    this.load.image(EGameImage.ELF_O, elf_blue);
    this.load.image(EGameImage.ORC_X, orc_red);
    this.load.image(EGameImage.ORC_O, orc_blue);
    this.load.image(EGameImage.DWARF_X, dwarf_red);
    this.load.image(EGameImage.DWARF_O, dwarf_blue);
  }

  update(): void {
    this.scene.start('GameScene');
  }

  private createLoadingbar(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x5dae47, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
