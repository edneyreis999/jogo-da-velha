import { CONST } from '../const/const';
import { EEVENTS } from '../const/events';
import { EGameState, EPlayer } from '../interfaces/gameplay-interfaces';
import { Alfa } from '../objects/ai';
import { Tile } from '../objects/tile';

export class GameController {
  private currentScene: Phaser.Scene;

  // Variables
  private canPlayerMove: boolean;

  // Grid with tiles
  private board!: Tile[];

  private currentTurn: EPlayer;

  private currentGameState = EGameState.PLAYING;

  private alfa: Alfa;

  constructor(currentScene: Phaser.Scene) {
    this.currentScene = currentScene;
    this.init();
  }

  init() {
    this.canPlayerMove = true;
    this.currentTurn = EPlayer.PLAYER;
    this.currentGameState = EGameState.PLAYING;

    // Init grid with tiles
    this.board = [];

    // Init AI
    this.alfa = new Alfa();
    this.alfa.init();
  }

  addTileToBoard(tile: Tile, tileIndex: number): void {
    this.board[tileIndex] = tile;
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

    this.currentScene.events.emit(EEVENTS.TOGGLE_TURN, this.currentTurn);

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
    this.currentScene.events.emit(EEVENTS.HAS_WINNER, winnerTiles);
  };

  gameIsATie = () => {
    this.currentGameState = EGameState.PAUSED;
    this.currentTurn = EPlayer.NOBODY;
    this.currentScene.events.emit(EEVENTS.GAME_TIED);
  };

  restartScene = () => {
    this.currentGameState = EGameState.PLAYING;
    this.currentTurn = EPlayer.PLAYER;
  };
}
