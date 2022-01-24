export enum EEVENTS {
  /**
    from: 'GameScene',
    to: 'HUDScene',
    description: 'Used to display a label that indicates whose turn it is',
   */
  TOGGLE_TURN = 'toggleTurn',
  /**
    from: 'GameScene',
    to: 'HUDScene',
    description: 'Used to display a label that indicates who won',
   */
  HAS_WINNER = 'hasWinner',
  /**
    from: 'GameScene',
    to: 'HUDScene',
    description: 'Used to display a label that indicates a tie',
   */
  GAME_TIED = 'gameTied',
  /**
    from: 'GameScene',
    to: 'HUDScene',
    description: 'Used to display an hero image on the tile',
   */
  TILE_OCCUPIED = 'tileOccupied',
  /**
    from: 'HUDScene',
    to: 'GameScene',
    description: 'Used to reset the game',
   */
  LABEL_WINNER_CLICKED = 'labelWinnerClicked',
}
