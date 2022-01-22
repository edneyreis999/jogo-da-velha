import 'phaser';
import { EGameState, EOccupiedBy, IBoard, ISquare } from './interface';
import { logoImg, blankSquareImg, tttOxImg } from './assets';

export default class JogoDaVelha extends Phaser.Scene {
  private gameInstance: Phaser.Game | null = null;

  private currentTurn = EOccupiedBy.PLAYER_X;

  private board: IBoard;

  private currentGameState = EGameState.PLAYING;

  private possibleWins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
    this.board = {
      squares: [],
    };
  }

  restartScene = (gameInstance: Phaser.Game) => {
    const currentScene = gameInstance.scene.getScenes()[0];
    if (currentScene) {
      currentScene.scene.restart();
      this.currentGameState = EGameState.PLAYING;
      this.currentTurn = EOccupiedBy.PLAYER_X;
    }
  };

  preload() {
    this.load.image('logo', logoImg);
    this.load.image('blankSquare', blankSquareImg);
    this.load.spritesheet('thePlayers', tttOxImg, {
      frameWidth: 200,
      frameHeight: 173,
    });
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

    const x = +currentScene.game.config.width / 2;
    const y = +currentScene.game.config.height / 2;

    let displayText: string;

    if (this.currentTurn === EOccupiedBy.PLAYER_X) {
      displayText = 'X WINSSS!';
    } else if (this.currentTurn === EOccupiedBy.PLAYER_O) {
      displayText = 'O WINS!';
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
        const sprite = this.board.squares[winLine[n]];

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

    const displayText = `Player ${
      this.currentTurn === EOccupiedBy.PLAYER_X ? 'X' : 'O'
    } Turn`;

    const label = currentScene.add.text(x, y, displayText, {
      fontSize: '72px Arial',
    });
    label.setOrigin(0.5, 0.5);

    currentScene.tweens.add({
      targets: label,
      alpha: 0,
      ease: 'Power1',
      duration: 3000,
    });
  };

  checkForwinCondition = () => {
    for (let line = 0; line < this.possibleWins.length; line += 1) {
      const winLine = this.possibleWins[line];
      if (
        this.board.squares[winLine[0]].occupiedBy === this.currentTurn &&
        this.board.squares[winLine[1]].occupiedBy === this.currentTurn &&
        this.board.squares[winLine[2]].occupiedBy === this.currentTurn
      ) {
        return this.gameHasWinner(winLine);
      }
    }

    let movesLeft = false;
    for (let n = 0; n < this.board.squares.length; n += 1) {
      if (this.board.squares[n].occupiedBy === EOccupiedBy.NOBODY) {
        movesLeft = true;
      }
    }

    if (!movesLeft) {
      return this.gameIsATie();
    }

    this.toggleTurn();

    return true;
  };

  create() {
    this.board = {
      squares: [],
    };
    const blankSquareSize = 200; // 200x200 square
    const halfBlankSquareSize = 100;
    // chamar um método no back que vai voltar 9 squares
    for (let row = 0; row < 3; row += 1) {
      const y = halfBlankSquareSize + blankSquareSize * row + row * 10;

      // This inner loop gets executed before the outer loop
      // so our sprites will be created by column first, then by row
      for (let col = 0; col < 3; col += 1) {
        const x = halfBlankSquareSize + blankSquareSize * col + col * 10;

        const square: ISquare = this.add.sprite(x, y, 'blankSquare');
        this.board.squares.push(square);
        square.occupiedBy = EOccupiedBy.NOBODY;
        square.setInteractive();
        square.on('pointerdown', () => {
          if (
            square.occupiedBy === EOccupiedBy.NOBODY &&
            this.currentGameState === EGameState.PLAYING
          ) {
            square.occupiedBy = this.currentTurn;
            this.add.sprite(
              square.x,
              square.y,
              'thePlayers',
              square.occupiedBy
            );
            this.checkForwinCondition();
          }
        });
      }
    }
  }
}
