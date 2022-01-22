import { CONST } from '../const/const';
import { EGameState, EOccupiedBy } from '../interfaces/interface';
import { Tile } from '../objects/tile';
import { EGameImage } from './boot-scene';

export class GameScene extends Phaser.Scene {
  // Variables
  private canMove: boolean;

  // Grid with tiles
  private board!: Tile[];

  // Selected Tiles
  private firstSelectedTile: Tile | undefined;

  private currentTurn: EOccupiedBy;

  private currentGameState = EGameState.PLAYING;

  constructor() {
    super({
      key: 'GameScene',
    });
  }

  init(): void {
    // Init variables
    this.canMove = true;
    this.currentTurn = EOccupiedBy.PLAYER_X;
    this.currentGameState = EGameState.PLAYING;

    // set background color
    this.cameras.main.setBackgroundColor('#606252');

    // Init grid with tiles
    this.board = [];
    let tileCounter = 0;
    for (let y = 0; y < CONST.gridHeight; y += 1) {
      for (let x = 0; x < CONST.gridWidth; x += 1) {
        const newTile = this.addTile(x, y);
        this.board[tileCounter] = newTile;
        tileCounter += 1;
      }
    }

    // Selected Tiles
    this.firstSelectedTile = undefined;
  }

  /**
   * Add a new random tile at the specified position.
   * @param x
   * @param y
   */
  private addTile(x: number, y: number): Tile {
    // Get a random tile
    const randomTileType: string = CONST.tileTexture;
    // Return the created tile
    const newTile = new Tile({
      scene: this,
      x: x * (CONST.tileWidth + +CONST.tilePadding) + CONST.width / 3,
      y: y * (CONST.tileHeight + CONST.tilePadding) + CONST.tileHeight,
      texture: randomTileType,
    });

    newTile.on(
      'pointerdown',
      () => {
        if (this.canMove) {
          if (
            newTile.getOccupiedBy() === EOccupiedBy.NOBODY &&
            this.currentGameState === EGameState.PLAYING
          ) {
            newTile.setOccupiedBy(this.currentTurn);

            const imageToSpawn: EGameImage =
              this.currentTurn === EOccupiedBy.PLAYER_X
                ? EGameImage.ELF_X
                : EGameImage.ELF_O;

            this.add.sprite(newTile.x, newTile.y, imageToSpawn);

            const winLine = this.checkForwinLine();
            if (!winLine) {
              this.toggleTurn();
            } else if (winLine && winLine.length > 0) {
              this.gameHasWinner(winLine);
            } else {
              this.gameIsATie();
            }
          }
        }
      },
      this
    );

    return newTile;
  }

  checkForwinLine(): number[] | undefined {
    for (let line = 0; line < CONST.possibleWins.length; line += 1) {
      const winLine = CONST.possibleWins[line];
      if (
        this.board[winLine[0]].getOccupiedBy() === this.currentTurn &&
        this.board[winLine[1]].getOccupiedBy() === this.currentTurn &&
        this.board[winLine[2]].getOccupiedBy() === this.currentTurn
      ) {
        return winLine;
      }
    }

    let movesLeft = false;
    for (let n = 0; n < this.board.length; n += 1) {
      if (this.board[n].getOccupiedBy() === EOccupiedBy.NOBODY) {
        movesLeft = true;
      }
    }

    if (!movesLeft) {
      return [];
    }

    return undefined;
  }

  gameHasWinner = (winLine: number[]) => {
    this.currentGameState = EGameState.PAUSED;
    this.broadcastWinner(winLine);
  };

  gameIsATie = () => {
    this.currentGameState = EGameState.PAUSED;
    this.currentTurn = EOccupiedBy.NOBODY;
    this.broadcastWinner([]);
  };

  broadcastWinner = (winLine: number[]) => {
    const currentScene = this.game.scene.getScenes()[0];
    currentScene.tweens.killAll();

    const x = CONST.width / 2;
    const y = CONST.height / 2;

    let displayText: string;

    if (this.currentTurn === EOccupiedBy.PLAYER_X) {
      displayText = 'Red Won!!';
    } else if (this.currentTurn === EOccupiedBy.PLAYER_O) {
      displayText = 'Blue Won!!';
    } else {
      displayText = 'TIE!';
    }

    let label = currentScene.add.text(x, y, displayText, {
      fontSize: '104px Arial',
      backgroundColor: '#00F',
    });
    label.setOrigin(0.5, 0.5);
    label.setInteractive();

    label.on(
      'pointerdown',
      () => {
        this.restartScene(this.game);
      },
      this
    );

    label = currentScene.add.text(x, y, displayText, {
      fontSize: '104px Arial',
    });
    label.setOrigin(0.5, 0.5);

    currentScene.tweens.add({
      targets: label,
      alpha: 0,
      ease: 'Power1',
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    if (this.currentTurn !== EOccupiedBy.NOBODY) {
      for (let n = 0; n < winLine.length; n += 1) {
        const sprite = this.board[winLine[n]];

        currentScene.tweens.add({
          targets: sprite,
          angle: 360,
          ease: 'None',
          duration: 1000,
          repeat: -1,
        });
      }
    }
  };

  toggleTurn = () => {
    this.currentTurn =
      this.currentTurn === EOccupiedBy.PLAYER_X
        ? EOccupiedBy.PLAYER_O
        : EOccupiedBy.PLAYER_X;

    const x = +this.game.config.width / 2;
    const y = +this.game.config.height / 2;

    const currentScene = this.game.scene.getScenes()[0];

    const displayText = `${
      this.currentTurn === EOccupiedBy.PLAYER_X ? 'Red' : 'Blue'
    } Turn`;

    const label = currentScene.add.text(x, y, displayText, {
      fontSize: '72px Arial',
    });
    label.setOrigin(0.5, 0.5);

    currentScene.tweens.add({
      targets: label,
      alpha: 0,
      ease: 'Power1',
      duration: 1000,
    });
  };

  restartScene = (gameInstance: Phaser.Game) => {
    const currentScene = gameInstance.scene.getScenes()[0];
    if (currentScene) {
      currentScene.scene.restart();
      this.currentGameState = EGameState.PLAYING;
      this.currentTurn = EOccupiedBy.PLAYER_X;
    }
  };

  getCurrentTurn = () => {
    return this.currentTurn;
  };
}
