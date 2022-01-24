import { CONST } from '../const/const';
import { EGameState, EPlayer } from '../interfaces/gameplay-interfaces';
import { Alfa } from '../objects/ai';
import { Pawn } from '../objects/pawn';
import { Tile } from '../objects/tile';
import { EGameImage } from '../scenes/boot-scene';

export class GameController {
  private currentScene: Phaser.Scene;

  // Variables
  private canPlayerMove: boolean;

  // Grid with tiles
  private board!: Tile[];

  private currentTurn: EPlayer;

  private currentGameState = EGameState.PLAYING;

  private alfa: Alfa;

  private pawn!: Pawn[];

  constructor(currentScene: Phaser.Scene) {
    this.currentScene = currentScene;
    this.init();
  }

  init() {
    this.canPlayerMove = true;
    this.currentTurn = EPlayer.PLAYER;
    this.currentGameState = EGameState.PLAYING;

    // Init pawnButton
    this.pawn = [];
    let pawnCounter = 0;
    for (let y = 0; y < CONST.gridHeight; y += 1) {
      for (let x = 0; x < CONST.gridWidth; x += 1) {
        const newPawn = this.addPawn(x, y);
        this.pawn[pawnCounter] = newPawn;
        pawnCounter += 1;
      }
    }

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

    // Init AI
    this.alfa = new Alfa();
    this.alfa.init();
  }

  addPawn(x: number, y: number) {
    const newPawn = new Pawn({
      scene: this.currentScene,
      x:
        x * (CONST.tileWidth + +CONST.tilePadding) +
        (CONST.width / 3 + CONST.tileWidth / 2),
      y: y * (CONST.tileHeight + CONST.tilePadding) + CONST.tileHeight,
      texture: EGameImage.ELF_X,
    });

    return newPawn;
  }

  private addTile(x: number, y: number): Tile {
    // Return the created tile
    const newTile = new Tile({
      scene: this.currentScene,
      x:
        x * (CONST.tileWidth + +CONST.tilePadding) +
        (CONST.width / 3 + CONST.tileWidth / 2),
      y: y * (CONST.tileHeight + CONST.tilePadding) + CONST.tileHeight,
      texture: EGameImage.TILE,
    });

    return newTile;
  }

  async handleTileOccupation(tile: Tile) {
    if (this.canPlayerMove) {
      this.canPlayerMove = false;
      if (
        tile.getOccupiedBy() === EPlayer.NOBODY &&
        this.currentGameState === EGameState.PLAYING
      ) {
        tile.setOccupiedBy(this.currentTurn);
        await this.checkWinCondition();
      }
      this.canPlayerMove = true;
    }
  }

  async checkWinCondition() {
    const winLine = this.checkForwinLine();
    if (!winLine) {
      await this.toggleTurn();
    } else if (winLine && winLine.length > 0) {
      this.gameHasWinner(winLine);
    } else {
      this.gameIsATie();
    }
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
      if (this.board[n].getOccupiedBy() === EPlayer.NOBODY) {
        movesLeft = true;
      }
    }

    if (!movesLeft) {
      return [];
    }

    return undefined;
  }

  toggleTurn = async () => {
    this.currentTurn =
      this.currentTurn === EPlayer.PLAYER ? EPlayer.ALFA : EPlayer.PLAYER;

    this.currentScene.events.emit('toggleTurn', this.currentTurn);

    if (this.currentTurn === EPlayer.ALFA) {
      await this.iaTurn();
    }
  };

  iaTurn = async () => {
    const tileChosenByAlfa = await this.alfa.getMove(this.board);
    tileChosenByAlfa.setOccupiedBy(this.currentTurn);
    await this.checkWinCondition();
    this.canPlayerMove = true;
  };

  gameHasWinner = (winLine: number[]) => {
    this.currentGameState = EGameState.PAUSED;
    const winnerTiles: Array<Tile> = this.board.filter((tile, index) => {
      return winLine.includes(index);
    });
    this.currentScene.events.emit('hasWinner', winnerTiles);
  };

  gameIsATie = () => {
    this.currentGameState = EGameState.PAUSED;
    this.currentTurn = EPlayer.NOBODY;
  };

  restartScene = () => {
    this.currentGameState = EGameState.PLAYING;
    this.currentTurn = EPlayer.PLAYER;
  };
}
