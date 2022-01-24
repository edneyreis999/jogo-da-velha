import { Tile } from './tile';
import { CONST } from '../const/const';

const ai = require('tictactoe-complex-ai');

export class Alfa {
  private aiInstance: any;

  init() {
    this.aiInstance = ai.createAI({
      level: CONST.iaLevel,
      player: 1,
      ai: 0,
      empty: 2,
    });
  }

  async getMove(board: Tile[]) {
    // Normalize board
    const boardNormalized = board.map((tile: Tile) => {
      return tile.getOccupiedBy();
    });

    const alfaPlays = await this.aiInstance
      .play(boardNormalized)
      .then((pos: any) => {
        return pos;
      });
    return board[alfaPlays];
  }
}
