import Phaser from 'phaser';

export enum EPlayer {
  ALFA,
  PLAYER,
  NOBODY,
}

export enum EGameState {
  PLAYING,
  PAUSED,
}

export interface ISquare extends Phaser.GameObjects.Sprite {
  occupiedBy?: EPlayer;
}

export interface IBoard {
  squares: ISquare[];
}
