import Phaser from "phaser";

export enum EOccupiedBy {
  PLAYER_O,
  PLAYER_X,
  NOBODY,
}

export enum EGameState {
  PLAYING,
  PAUSED,
}

export interface ISquare extends Phaser.GameObjects.Sprite {
  occupiedBy?: EOccupiedBy;
}

export interface IBoard {
  squares: ISquare[];
}
