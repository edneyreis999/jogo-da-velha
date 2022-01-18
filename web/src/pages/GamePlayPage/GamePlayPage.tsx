import { MetaTags } from '@redwoodjs/web'
import Phaser from 'phaser'
import {
  IBoard,
  ISquare,
  EOccupiedBy,
  EGameState,
} from 'src/interfaces/gamePlay'
import { logoImg, blankSquareImg, tttOxImg } from '../../assets'

let currentGameInstance: Phaser.Game
const blankSquareSize = 200 // 200x200 square
const halfBlankSquareSize = 100
let currentTurn = EOccupiedBy.PLAYER_X
let board: IBoard
let currentGameState = EGameState.PLAYING
const possibleWins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
]

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 620,
  height: 620,
  backgroundColor: 0x000000,
  scene: {
    name: 'GamePlayPage',
    preload: preload,
    create: create,
  },
}

function preload() {
  this.load.image('logo', logoImg)
  this.load.image('blankSquare', blankSquareImg)
  this.load.spritesheet('thePlayers', tttOxImg, {
    frameWidth: 200,
    frameHeight: 173,
  })
}

function create() {
  board = {
    squares: [],
  }
  for (let row = 0; row < 3; row++) {
    const y = halfBlankSquareSize + blankSquareSize * row + row * 10

    // This inner loop gets executed before the outer loop
    // so our sprites will be created by column first, then by row
    for (let col = 0; col < 3; col++) {
      const x = halfBlankSquareSize + blankSquareSize * col + col * 10

      const square: ISquare = this.add.sprite(x, y, 'blankSquare')
      board.squares.push(square)
      square.occupiedBy = EOccupiedBy.NOBODY
      square.setInteractive()

      square.on('pointerdown', () => {
        if (
          square.occupiedBy === EOccupiedBy.NOBODY &&
          currentGameState === EGameState.PLAYING
        ) {
          square.occupiedBy = currentTurn
          this.add.sprite(square.x, square.y, 'thePlayers', square.occupiedBy)
          checkForwinCondition()
        }
      })
    }
  }
}

function checkForwinCondition() {
  for (let line = 0; line < possibleWins.length; line++) {
    const winLine = possibleWins[line]
    if (
      board.squares[winLine[0]].occupiedBy === currentTurn &&
      board.squares[winLine[1]].occupiedBy === currentTurn &&
      board.squares[winLine[2]].occupiedBy === currentTurn
    ) {
      return gameHasWinner(winLine)
    }
  }

  let movesLeft = false
  for (let n = 0; n < board.squares.length; n++) {
    if (board.squares[n].occupiedBy === EOccupiedBy.NOBODY) {
      movesLeft = true
    }
  }

  if (!movesLeft) {
    return gameIsATie()
  }

  toggleTurn()
}

function gameHasWinner(winLine: number[]) {
  currentGameState = EGameState.PAUSED
  broadcastWinner(winLine)
}

function gameIsATie() {
  currentGameState = EGameState.PAUSED
  currentTurn = EOccupiedBy.NOBODY
  broadcastWinner([])
}

function toggleTurn() {
  currentTurn =
    currentTurn === EOccupiedBy.PLAYER_X
      ? EOccupiedBy.PLAYER_O
      : EOccupiedBy.PLAYER_X

  const x = +currentGameInstance.config.width / 2
  const y = +currentGameInstance.config.height / 2

  const currentScene = currentGameInstance.scene.getScenes()[0]

  const displayText = `Player ${
    currentTurn === EOccupiedBy.PLAYER_X ? 'X' : 'O'
  } Turn`

  const label = currentScene.add.text(x, y, displayText, {
    fontSize: '72px Arial',
  })
  label.setOrigin(0.5, 0.5)

  currentScene.tweens.add({
    targets: label,
    alpha: 0,
    ease: 'Power1',
    duration: 3000,
  })
}

const broadcastWinner = (winLine: number[]) => {
  const currentScene = currentGameInstance.scene.getScenes()[0]
  currentScene.tweens.killAll()

  const x = +currentScene.game.config.width / 2
  const y = +currentScene.game.config.height / 2

  let displayText: string

  if (currentTurn === EOccupiedBy.PLAYER_X) {
    displayText = 'X WINS!'
  } else if (currentTurn === EOccupiedBy.PLAYER_O) {
    displayText = 'O WINS!'
  } else {
    displayText = 'TIE!'
  }

  let label = currentScene.add.text(x, y, displayText, {
    fontSize: '104px Arial',
    backgroundColor: '#00F',
  })
  label.setOrigin(0.5, 0.5)
  label.setInteractive()

  label.on(
    'pointerdown',
    () => {
      restartScene()
    },
    this
  )

  label = currentScene.add.text(x, y, displayText, {
    fontSize: '104px Arial',
  })
  label.setOrigin(0.5, 0.5)

  currentScene.tweens.add({
    targets: label,
    alpha: 0,
    ease: 'Power1',
    duration: 1000,
    yoyo: true,
    repeat: -1,
  })

  if (currentTurn !== EOccupiedBy.NOBODY) {
    for (let n = 0; n < winLine.length; n++) {
      const sprite = board.squares[winLine[n]]

      currentScene.tweens.add({
        targets: sprite,
        angle: 360,
        ease: 'None',
        duration: 1000,
        repeat: -1,
      })
    }
  }
}

const onStartGameClick = () => {
  if (!currentGameInstance) {
    currentGameInstance = new Phaser.Game(config)
  } else {
    restartScene()
  }
}

const restartScene = () => {
  const currentScene = currentGameInstance.scene.getScenes()[0]

  currentScene.scene.restart()
  currentGameState = EGameState.PLAYING
  currentTurn = EOccupiedBy.PLAYER_X
}

const GamePlayPage = () => {
  return (
    <div>
      <MetaTags title="GamePlay" description="GamePlay page" />

      <h1 style={{ color: 'yellowgreen' }}>GamePlayPage</h1>
      <button
        type="button"
        title={'New Game'}
        className="rw-button rw-button-small rw-button-blue"
        onClick={() => onStartGameClick()}
      >
        Start
      </button>
    </div>
  )
}

export default GamePlayPage
